import path from "path";
import { fileURLToPath } from "url";
import createLogger from "pino";
import pg from "pg";
import Redis from "ioredis";
import Ajv from "ajv";

import { loadArtifacts } from "@iguhealth/artifacts";
import { resourceTypes } from "@iguhealth/fhir-types/r4/sets";
import {
  AResource,
  id,
  ResourceType,
  Resource,
  CapabilityStatement,
  CapabilityStatementRestResource,
  StructureDefinition,
  code,
  dateTime,
  canonical,
  uri,
} from "@iguhealth/fhir-types/r4/types";
import { FHIRClientAsync } from "@iguhealth/client/interface";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";
import { FHIRRequest } from "@iguhealth/client/types";

import { createPostgresClient } from "../resourceProviders/postgres/index.js";
import { FHIRServerCTX } from "./types.js";
import { InternalData } from "../resourceProviders/memory/types.js";
import MemoryDatabaseAsync from "../resourceProviders/memory/async.js";
import RouterClient from "../resourceProviders/router.js";
import RedisLock from "../synchronization/redis.lock.js";
import InlineExecutioner from "../operation-executors/local/index.js";
import StructureDefinitionSnapshotInvoke from "../operation-executors/local/structureDefinition/snapshot.js";
import IguhealthEncryptInvoke from "../operation-executors/local/encryption/encrypt.js";
import ResourceValidateInvoke from "../operation-executors/local/resource_validate.js";
import ValueSetExpandInvoke from "../operation-executors/local/terminology/expand.js";
import ValueSetValidateInvoke from "../operation-executors/local/terminology/validate.js";
import CodeSystemLookupInvoke from "../operation-executors/local/terminology/lookup.js";
import AWSLambdaExecutioner from "../operation-executors/awsLambda/index.js";
import RedisCache from "../cache/redis.js";
import { TerminologyProviderMemory } from "../terminology/index.js";
import { AWSKMSProvider } from "../encryption/provider/kms.js";
import { encryptValue } from "../encryption/index.js";
import { validateResource } from "../operation-executors/local/resource_validate.js";
import JSONPatchSchema from "../schemas/jsonpatch.schema.js";

const MEMORY_TYPES: ResourceType[] = [
  "StructureDefinition",
  "SearchParameter",
  "ValueSet",
  "CodeSystem",
];

function createMemoryData(
  resourceTypes: ResourceType[]
): InternalData<ResourceType> {
  const artifactResources: Resource[] = resourceTypes
    .map((resourceType) =>
      loadArtifacts(
        resourceType,
        path.join(fileURLToPath(import.meta.url), "../../../")
      )
    )
    .flat();
  let data: InternalData<ResourceType> = {};
  for (const resource of artifactResources) {
    data = {
      ...data,
      [resource.resourceType]: {
        ...data[resource.resourceType],
        [resource.id as id]: resource,
      },
    };
  }

  return data;
}

async function createResourceRestCapabilities(
  ctx: Partial<FHIRServerCTX>,
  memdb: FHIRClientAsync<unknown>,
  sd: StructureDefinition
): Promise<CapabilityStatementRestResource> {
  const resourceParameters = await memdb.search_type(ctx, "SearchParameter", [
    { name: "_count", value: [1000] },
    {
      name: "base",
      value: ["Resource", "DomainResource", sd.type],
    },
  ]);

  return {
    type: sd.type as unknown as code,
    profile: sd.url as canonical,
    interaction: [
      { code: "read" as code },
      { code: "update" as code },
      { code: "delete" as code },
      { code: "search-type" as code },
      { code: "create" as code },
      { code: "history-instance" as code },
    ],
    versioning: "versioned" as code,
    updateCreate: false,
    searchParam: resourceParameters.resources.map((resource) => ({
      name: resource.name,
      definition: resource.url as canonical,
      type: resource.type,
      documentation: resource.description,
    })),
  };
}

async function serverCapabilities(
  ctx: Partial<FHIRServerCTX>,
  memdb: FHIRClientAsync<unknown>
): Promise<CapabilityStatement> {
  const sds = (
    await memdb.search_type({}, "StructureDefinition", [
      { name: "_count", value: [1000] },
    ])
  ).resources.filter((sd) => sd.abstract === false && sd.kind === "resource");

  const rootParameters = await memdb.search_type(ctx, "SearchParameter", [
    { name: "_count", value: [1000] },
    {
      name: "base",
      value: ["Resource", "DomainResource"],
    },
  ]);

  return {
    resourceType: "CapabilityStatement",
    status: "active" as code,
    fhirVersion: "4.0.1" as code,
    date: new Date().toISOString() as dateTime,
    kind: "capability" as code,
    format: ["json" as code],
    rest: [
      {
        mode: "server" as code,
        security: {
          cors: true,
        },
        interaction: [{ code: "search-system" as code }],
        searchParam: rootParameters.resources.map((resource) => ({
          name: resource.name,
          definition: resource.url as canonical,
          type: resource.type,
          documentation: resource.description,
        })),
        resource: await Promise.all(
          sds.map((sd) => createResourceRestCapabilities(ctx, memdb, sd))
        ),
      },
    ],
  };
}

export const logger = createLogger.default();

function getResourceTypeToValidate(request: FHIRRequest): ResourceType {
  switch (request.type) {
    case "create-request":
      return request.resourceType;
    case "update-request":
      return request.resourceType;
    case "invoke-request":
      return "Parameters";
    case "transaction-request":
    case "batch-request":
      return "Bundle";
    default:
      throw new OperationError(
        outcomeError(
          "invalid",
          `cannot validate resource type '${request.type}'`
        )
      );
  }
}

const ajv = new Ajv.default({});
const validateJSONPatch = ajv.compile(JSONPatchSchema);

const validationMiddleware: Parameters<typeof RouterClient>[0][number] = async (
  context,
  next
) => {
  switch (context.request.type) {
    case "update-request":
    case "create-request":
    case "batch-request":
    case "invoke-request":
    case "transaction-request": {
      const outcome = await validateResource(
        context.ctx,
        getResourceTypeToValidate(context.request),
        {
          mode: (context.request.type === "create-request"
            ? "create"
            : "update") as code,
          resource: context.request.body,
        }
      );
      if (
        outcome.issue.find(
          (i) => i.severity === "fatal" || i.severity === "error"
        )
      ) {
        throw new OperationError(outcome);
      }
      break;
    }
    case "patch-request": {
      const valid = validateJSONPatch(context.request.body);
      if (!valid) {
        throw new OperationError(
          outcomeError("invalid", `JSON Patch is not valid.`)
        );
      }
      break;
    }
  }
  if (!next) throw new Error("No next");
  return next(context);
};

const capabilitiesMiddleware: Parameters<
  typeof RouterClient
>[0][number] = async (context, next) => {
  if (context.request.type === "capabilities-request") {
    return {
      ...context,
      response: {
        level: "system",
        type: "capabilities-response",
        body: context.ctx.capabilities,
      },
    };
  }
  if (!next) throw new Error("next middleware was not defined");
  return next(context);
};

const encryptionMiddleware: (
  resourceTypesToEncrypt: ResourceType[]
) => Parameters<typeof RouterClient>[0][number] =
  (resourceTypesToEncrypt: ResourceType[]) => async (context, next) => {
    if (!next) throw new Error("next middleware was not defined");
    if (!context.ctx.encryptionProvider) {
      return next(context);
    }
    if (
      "resourceType" in context.request &&
      resourceTypesToEncrypt.includes(context.request.resourceType)
    ) {
      switch (context.request.type) {
        case "create-request":
        case "update-request": {
          const encrypted = await encryptValue(
            context.ctx,
            context.request.body
          );
          return next({
            ...context,
            request: { ...context.request, body: encrypted },
          });
        }
        case "patch-request": {
          const encrypted = await encryptValue(
            context.ctx,
            context.request.body
          );
          return next({
            ...context,
            request: { ...context.request, body: encrypted },
          });
        }
        default: {
          return next(context);
        }
      }
    } else {
      return next(context);
    }
  };

function createResolveCanonical(
  data: InternalData<ResourceType>
): <T extends ResourceType>(type: T, url: string) => AResource<T> | undefined {
  const map = new Map<ResourceType, Map<string, string>>();
  for (const resourceType of Object.keys(data)) {
    for (const resource of Object.values(
      data[resourceType as ResourceType] || {}
    )) {
      if ((resource as { url: string })?.url) {
        if (!map.has(resourceType as ResourceType)) {
          map.set(resourceType as ResourceType, new Map());
        }
        const url = (resource as { url: string }).url;
        const id = resource?.id;
        if (!map.get(resourceType as ResourceType)?.has(url) && id) {
          map.get(resourceType as ResourceType)?.set(url, id);
        }
      }
    }
  }

  return <T extends ResourceType>(type: T, url: string) => {
    const id = map.get(type)?.get(url);
    return id ? (data[type]?.[id as id] as AResource<T>) : undefined;
  };
}

export function getRedisClient() {
  const redisClient = new Redis.default({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || "6739"),
    tls:
      process.env.REDIS_SSL === "true"
        ? {
            rejectUnauthorized: false,
          }
        : undefined,
  });
  return redisClient;
}

export async function deriveCTX(): Promise<
  ({
    pg,
    workspace,
    author,
    user_access_token,
  }: Pick<FHIRServerCTX, "workspace" | "author" | "user_access_token"> & {
    pg: pg.PoolClient;
  }) => FHIRServerCTX
> {
  const data = createMemoryData(MEMORY_TYPES);
  const memDBAsync = MemoryDatabaseAsync(data);
  const resolveCanonical = createResolveCanonical(data);

  const inlineOperationExecution = InlineExecutioner([
    StructureDefinitionSnapshotInvoke,
    IguhealthEncryptInvoke,
    ResourceValidateInvoke,
    ValueSetExpandInvoke,
    ValueSetValidateInvoke,
    CodeSystemLookupInvoke,
  ]);
  const terminologyProvider = new TerminologyProviderMemory();
  const encryptionProvider =
    process.env.ENCRYPTION_TYPE === "aws"
      ? new AWSKMSProvider({
          clientConfig: {
            credentials: {
              accessKeyId: process.env.AWS_KMS_ACCESS_KEY_ID as string,
              secretAccessKey: process.env.AWS_KMS_ACCESS_KEY_SECRET as string,
            },
          },
          generatorKeyARN: process.env.AWS_ENCRYPTION_GENERATOR_KEY as string,
          encryptorKeyARNS: [process.env.AWS_ENCRYPTION_KEY as string],
        })
      : undefined;

  const capabilities = await serverCapabilities(
    { resolveCanonical },
    memDBAsync
  );

  const redisClient = getRedisClient();

  const cache = new RedisCache(redisClient);
  const lock = new RedisLock(redisClient);

  const lambdaExecutioner = AWSLambdaExecutioner({
    AWS_REGION: process.env.AWS_REGION as string,
    AWS_ACCESS_KEY_ID: process.env.AWS_LAMBDA_ACCESS_KEY_ID as string,
    AWS_ACCESS_KEY_SECRET: process.env.AWS_LAMBDA_ACCESS_KEY_SECRET as string,
    LAMBDA_ROLE: process.env.AWS_LAMBDA_ROLE as string,
    LAYERS: [process.env.AWS_LAMBDA_LAYER_ARN as string],
  });

  return ({ pg, workspace, author, user_access_token }) => {
    const client = RouterClient(
      [
        validationMiddleware,
        capabilitiesMiddleware,
        encryptionMiddleware(["OperationDefinition"]),
      ],
      [
        // OP INVOCATION
        {
          useSource: (request) => {
            return (
              request.type === "invoke-request" &&
              inlineOperationExecution
                .supportedOperations()
                .map((op) => op.code)
                .includes(request.operation)
            );
          },
          source: inlineOperationExecution,
        },
        {
          resourcesSupported: [...resourceTypes] as ResourceType[],
          interactionsSupported: ["invoke-request"],
          source: lambdaExecutioner,
        },
        {
          resourcesSupported: MEMORY_TYPES,
          interactionsSupported: ["read-request", "search-request"],
          source: memDBAsync,
        },
        {
          resourcesSupported: [...resourceTypes].filter(
            (type) => MEMORY_TYPES.indexOf(type as ResourceType) === -1
          ) as ResourceType[],
          interactionsSupported: [
            "read-request",
            "search-request",
            "create-request",
            "patch-request",
            "update-request",
            "delete-request",
            "history-request",
            "transaction-request",
          ],
          source: createPostgresClient(pg, {
            transaction_entry_limit: parseInt(
              process.env.POSTGRES_TRANSACTION_ENTRY_LIMIT || "20"
            ),
          }),
        },
      ]
    );

    return {
      workspace,
      author,
      user_access_token,
      logger,
      terminologyProvider,
      capabilities,
      client,
      cache,
      resolveCanonical,
      lock,
      encryptionProvider,
    };
  };
}
