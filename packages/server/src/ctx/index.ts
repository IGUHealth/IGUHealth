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
} from "@iguhealth/fhir-types/r4/types";
import { FHIRClientAsync } from "@iguhealth/client/interface";
import {
  OperationError,
  outcomeFatal,
  outcomeError,
} from "@iguhealth/operation-outcomes";
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
    type: sd.type,
    profile: sd.url,
    interaction: [
      { code: "read" },
      { code: "update" },
      { code: "delete" },
      { code: "search-type" },
      { code: "create" },
      { code: "history-instance" },
    ],
    versioning: "versioned",
    updateCreate: false,
    searchParam: resourceParameters.resources.map((resource) => ({
      name: resource.name,
      definition: resource.url,
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
    status: "active",
    fhirVersion: "4.0",
    date: new Date().toISOString(),
    kind: "capability",
    format: ["json"],
    rest: [
      {
        mode: "server",
        security: {
          cors: true,
          service: [
            {
              coding: [
                {
                  system:
                    "http://terminology.hl7.org/CodeSystem/restful-security-service",
                  code: "OAuth",
                  display: "OAuth",
                },
              ],
            },
          ],
        },
        interaction: [{ code: "search-system" }],
        searchParam: rootParameters.resources.map((resource) => ({
          name: resource.name,
          definition: resource.url,
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
  request,
  { state, ctx },
  next
) => {
  switch (request.type) {
    case "update-request":
    case "create-request":
    case "batch-request":
    case "invoke-request":
    case "transaction-request": {
      const outcome = await validateResource(
        ctx,
        getResourceTypeToValidate(request),
        {
          mode: request.type === "create-request" ? "create" : "update",
          resource: request.body,
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
      const valid = validateJSONPatch(request.body);
      if (!valid) {
        throw new OperationError(
          outcomeError("invalid", `JSON Patch is not valid.`)
        );
      }
      break;
    }
  }
  if (!next) throw new Error("No next");
  return next(request, { state, ctx });
};

const capabilitiesMiddleware: Parameters<
  typeof RouterClient
>[0][number] = async (request, args, next) => {
  if (request.type === "capabilities-request") {
    return {
      ...args,
      response: {
        level: "system",
        type: "capabilities-response",
        body: args.ctx.capabilities,
      },
    };
  }
  if (!next) throw new Error("next middleware was not defined");
  return next(request, args);
};

const encryptionMiddleware: (
  resourceTypesToEncrypt: ResourceType[]
) => Parameters<typeof RouterClient>[0][number] =
  (resourceTypesToEncrypt: ResourceType[]) => async (request, args, next) => {
    if (!next) throw new Error("next middleware was not defined");
    if (!args.ctx.encryptionProvider) {
      args.ctx.logger.warn(
        "Cannot encrypt, no encryption provider configured."
      );
      return next(request, args);
    }
    if (
      "resourceType" in request &&
      resourceTypesToEncrypt.includes(request.resourceType)
    ) {
      switch (request.type) {
        case "create-request":
        case "update-request": {
          const encrypted = await encryptValue(args.ctx, request.body);
          return next({ ...request, body: encrypted }, args);
        }
        case "patch-request": {
          const encrypted = await encryptValue(args.ctx, request.body);
          return next({ ...request, body: encrypted }, args);
        }
        default: {
          return next(request, args);
        }
      }
    } else {
      return next(request, args);
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
    return id ? (data[type]?.[id] as AResource<T>) : undefined;
  };
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
  const cache = new RedisCache({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || "6739"),
  });

  const redisClient = new Redis.default({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || "6739"),
  });
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
