import path from "path";
import { fileURLToPath } from "url";
import createLogger from "pino";
import pg from "pg";
import Redis from "ioredis";

import validate from "@iguhealth/fhir-validation";
import { loadArtifacts } from "@iguhealth/artifacts";
import { resourceTypes } from "@iguhealth/fhir-types/r4/sets";
import {
  id,
  ResourceType,
  Resource,
  CapabilityStatement,
  CapabilityStatementRestResource,
  StructureDefinition,
} from "@iguhealth/fhir-types/r4/types";
import { FHIRClientSync } from "@iguhealth/client/interface";
import { FHIRRequest } from "@iguhealth/client/types";
import {
  OperationError,
  outcomeFatal,
  outcomeError,
  outcome,
} from "@iguhealth/operation-outcomes";

import { createPostgresClient } from "../resourceProviders/postgres/index.js";
import { FHIRServerCTX } from "./types.js";
import { InternalData } from "../resourceProviders/memory/types.js";
import MemoryDatabaseAsync from "../resourceProviders/memory/async.js";
import MemoryDatabaseSync from "../resourceProviders/memory/sync.js";
import RouterClient from "../resourceProviders/router.js";
import RedisLock from "../synchronization/redis.lock.js";
import InlineExecutioner from "../operation-executors/local/index.js";
import ValueSetExpandInvoke from "../operation-executors/local/expand.js";
import ValueSetValidateInvoke from "../operation-executors/local/validate.js";
import CodeSystemLookupInvoke from "../operation-executors/local/lookup.js";
import AWSLambdaExecutioner from "../operation-executors/awsLambda/index.js";
import RedisCache from "../cache/redis.js";
import { TerminologyProviderMemory } from "../terminology/index.js";
import { AWSKMSProvider } from "../encryption/kms.js";

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
  memdb: FHIRClientSync<unknown>,
  sd: StructureDefinition
): Promise<CapabilityStatementRestResource> {
  const resourceParameters = await memdb.search_type({}, "SearchParameter", [
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
  memdb: FHIRClientSync<unknown>
): Promise<CapabilityStatement> {
  const sds = (
    await memdb.search_type({}, "StructureDefinition", [])
  ).resources.filter((sd) => sd.abstract === false && sd.kind === "resource");

  const rootParameters = await memdb.search_type({}, "SearchParameter", [
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
          sds.map((sd) => createResourceRestCapabilities(memdb, sd))
        ),
      },
    ],
  };
}

export const logger = createLogger.default();

function getResourceTypeToValidate(request: FHIRRequest) {
  switch (request.type) {
    case "create-request":
      return request.resourceType || request.body.resourceType;
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
      const resourceType = getResourceTypeToValidate(request);
      const issues = await validate(
        {
          validateCode: async (url: string, code: string) => {
            const result = await ctx.terminologyProvider.validate(ctx, {
              code,
              url,
            });
            return result.result;
          },
          resolveSD: (type) => {
            const sd = ctx.resolveSD(type);
            if (!sd)
              throw new OperationError(
                outcomeError(
                  "invalid",
                  `Could not validate type of ${resourceType}`
                )
              );
            return sd;
          },
        },
        resourceType,
        request.body
      );
      if (issues.length > 0) {
        throw new OperationError(outcome(issues));
      }
      break;
    }
    case "patch-request": {
      throw new OperationError(
        outcomeError(
          "not-supported",
          `Operation '${request.type}' not supported`
        )
      );
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
  const memDBSync = MemoryDatabaseSync(data);
  const inlineOperationExecution = InlineExecutioner([
    ValueSetExpandInvoke,
    ValueSetValidateInvoke,
    CodeSystemLookupInvoke,
  ]);
  const terminologyProvider = new TerminologyProviderMemory();
  const kmsProvider =
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

  const resolveSD = (type: string) => {
    const sd = memDBSync.read({}, "StructureDefinition", type);
    if (!sd) {
      throw new OperationError(
        outcomeFatal(
          "invalid",
          `Could not resolve a structure definition for type '${type}'`
        )
      );
    }
    return sd;
  };
  const capabilities = await serverCapabilities(memDBSync);
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
      [validationMiddleware, capabilitiesMiddleware],
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
      resolveSD,
      lock,
      kmsProvider,
    };
  };
}
