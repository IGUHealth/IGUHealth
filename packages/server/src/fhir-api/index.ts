import { Redis } from "ioredis";
import { pino } from "pino";

import { AsynchronousClient } from "@iguhealth/client";
import {
  MiddlewareAsyncChain,
  createMiddlewareAsync,
} from "@iguhealth/client/middleware";
import * as r4Sets from "@iguhealth/fhir-types/r4/sets";
import * as r4bSets from "@iguhealth/fhir-types/r4b/sets";
import { R4, R4B, ResourceType } from "@iguhealth/fhir-types/versions";

import { associateUserMiddleware } from "../authZ/middleware/associateUser.js";
import createAuthorizationMiddleware from "../authZ/middleware/authorization.js";
import AWSLambdaExecutioner from "../fhir-operation-executors/providers/awsLambda/index.js";
import InlineExecutioner from "../fhir-operation-executors/providers/local/index.js";
import IguhealthInviteUserInvoke from "../fhir-operation-executors/providers/local/invite_user.js";
import IguhealthMessagePostInvoke from "../fhir-operation-executors/providers/local/message_post.js";
import ResourceValidateInvoke from "../fhir-operation-executors/providers/local/resource_validate.js";
import StructureDefinitionSnapshotInvoke from "../fhir-operation-executors/providers/local/snapshot.js";
import ValueSetExpandInvoke from "../fhir-operation-executors/providers/local/terminology/expand.js";
import CodeSystemLookupInvoke from "../fhir-operation-executors/providers/local/terminology/lookup.js";
import ValueSetValidateInvoke from "../fhir-operation-executors/providers/local/terminology/validate.js";
import IguhealthUsageStatisticsInvoke from "../fhir-operation-executors/providers/local/usage_statistics.js";
import {
  AUTH_METHODS_ALLOWED,
  AUTH_RESOURCETYPES,
  createAuthStorageClient,
} from "../fhir-storage/providers/auth-storage/index.js";
import { createArtifactMemoryDatabase } from "../fhir-storage/providers/memory/async.js";
import { createPostgresClient } from "../fhir-storage/providers/postgres/index.js";
import RouterClient from "../fhir-storage/router.js";
import createCapabilitiesMiddleware from "./middleware/capabilities.js";
import createEncryptionMiddleware from "./middleware/encryption.js";
import createCheckTenantUsageMiddleware from "./middleware/usageCheck.js";
import createValidationMiddleware from "./middleware/validation.js";
import { IGUHealthServerCTX } from "./types.js";

const R4_SPECIAL_TYPES: {
  MEMORY: ResourceType<R4>[];
  AUTH: ResourceType<R4>[];
} = {
  AUTH: AUTH_RESOURCETYPES,
  MEMORY: ["StructureDefinition", "SearchParameter", "ValueSet", "CodeSystem"],
};
const R4_ALL_SPECIAL_TYPES = Object.values(R4_SPECIAL_TYPES).flatMap((v) => v);
const R4_DB_TYPES: ResourceType<R4>[] = (
  [...r4Sets.resourceTypes] as ResourceType<R4>[]
).filter((type) => R4_ALL_SPECIAL_TYPES.indexOf(type) === -1);

const R4B_SPECIAL_TYPES: { MEMORY: ResourceType<R4B>[] } & Record<
  string,
  ResourceType<R4B>[]
> = {
  DISSALLOWED: [
    // "Subscription",
    // "SubscriptionTopic",
    // "SubscriptionStatus",
    "OperationDefinition",
  ],
  MEMORY: ["StructureDefinition", "SearchParameter", "ValueSet", "CodeSystem"],
};
const R4B_ALL_SPECIAL_TYPES = Object.values(R4B_SPECIAL_TYPES).flatMap(
  (v) => v,
);
const R4B_DB_TYPES: ResourceType<R4B>[] = (
  [...r4bSets.resourceTypes] as ResourceType<R4B>[]
).filter((type) => R4B_ALL_SPECIAL_TYPES.indexOf(type) === -1);

export const createLogger = () =>
  pino<string>(
    process.env.NODE_ENV === "development"
      ? {
          transport: {
            target: "pino-pretty",
          },
        }
      : undefined,
  );

/**
 * Type manipulation to get state of a routerclient used for subsequent middlewares.
 */
type RouterState = Parameters<
  Parameters<typeof RouterClient>[0][number]
>[0]["state"];

let _redis_client: Redis | undefined = undefined;
/**
 * Returns instantiated Redis client based on environment variables.
 * @returns Singleton Redis client
 */
export function getRedisClient(): Redis {
  if (!_redis_client) {
    _redis_client = new Redis({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT || "6739"),
      tls:
        process.env.REDIS_SSL === "true"
          ? {
              rejectUnauthorized: false,
            }
          : undefined,
    });
  }

  return _redis_client;
}

/**
 * Creates the root ctx.client. Includes the expected middleware like validation and capabilities by default.
 * @param sources Client sources
 * @returns FHIRClientAsync instance
 */
function createFHIRClient(sources: RouterState["sources"]) {
  return RouterClient(
    [
      createCheckTenantUsageMiddleware(),
      createValidationMiddleware(),
      createCapabilitiesMiddleware(),
      createEncryptionMiddleware(["OperationDefinition"]),
      createAuthorizationMiddleware<RouterState>(),
    ],
    sources,
  );
}

export function createClient() {
  const memSource = createArtifactMemoryDatabase({
    r4: R4_SPECIAL_TYPES.MEMORY,
    r4b: R4B_SPECIAL_TYPES.MEMORY,
  });
  const pgSource = createPostgresClient({
    transaction_entry_limit: parseInt(
      process.env.POSTGRES_TRANSACTION_ENTRY_LIMIT || "20",
    ),
  });
  const lambdaSource = AWSLambdaExecutioner({
    AWS_REGION: process.env.AWS_REGION as string,
    AWS_ACCESS_KEY_ID: process.env.AWS_LAMBDA_ACCESS_KEY_ID as string,
    AWS_ACCESS_KEY_SECRET: process.env.AWS_LAMBDA_ACCESS_KEY_SECRET as string,
    LAMBDA_ROLE: process.env.AWS_LAMBDA_ROLE as string,
    LAYERS: [process.env.AWS_LAMBDA_LAYER_ARN as string],
  });
  const inlineSource = InlineExecutioner([
    StructureDefinitionSnapshotInvoke,
    ResourceValidateInvoke,
    ValueSetExpandInvoke,
    ValueSetValidateInvoke,
    CodeSystemLookupInvoke,
    IguhealthMessagePostInvoke,
    IguhealthInviteUserInvoke,
    IguhealthUsageStatisticsInvoke,
  ]);
  const client = createFHIRClient([
    // OP INVOCATION
    {
      filter: {
        useSource: (request) => {
          return (
            request.type === "invoke-request" &&
            inlineSource
              .supportedOperations()
              .map((op) => op.code)
              .includes(request.operation)
          );
        },
      },
      source: inlineSource,
    },
    {
      filter: {
        r4: {
          levelsSupported: ["system", "type", "instance"],
          resourcesSupported: [...r4Sets.resourceTypes] as ResourceType<R4>[],
          interactionsSupported: ["invoke-request"],
        },
      },
      source: lambdaSource,
    },
    {
      filter: {
        r4: {
          levelsSupported: ["system", "type", "instance"],
          resourcesSupported: R4_SPECIAL_TYPES.MEMORY,
          interactionsSupported: ["read-request", "search-request"],
        },
        r4b: {
          levelsSupported: ["system", "type", "instance"],
          resourcesSupported: R4B_SPECIAL_TYPES.MEMORY,
          interactionsSupported: ["read-request", "search-request"],
        },
      },
      source: memSource,
    },
    {
      filter: {
        r4: {
          levelsSupported: ["type", "instance"],
          resourcesSupported: R4_SPECIAL_TYPES.AUTH,
          interactionsSupported: AUTH_METHODS_ALLOWED,
        },
      },
      source: createAuthStorageClient(pgSource),
    },
    {
      filter: {
        r4: {
          levelsSupported: ["system", "type", "instance"],
          resourcesSupported: R4_DB_TYPES,
          interactionsSupported: [
            "vread-request",
            "read-request",
            "search-request",
            "create-request",
            "patch-request",
            "update-request",
            "delete-request",
            "history-request",
            "transaction-request",
            "batch-request",
          ],
        },
        r4b: {
          levelsSupported: ["system", "type", "instance"],
          resourcesSupported: R4B_DB_TYPES,
          interactionsSupported: [
            "vread-request",
            "read-request",
            "search-request",
            "create-request",
            "patch-request",
            "update-request",
            "delete-request",
            "history-request",
            "transaction-request",
            "batch-request",
          ],
        },
      },
      source: pgSource,
    },
  ]);

  return {
    resolveCanonical: memSource.resolveCanonical,
    resolveTypeToCanonical: memSource.resolveTypeToCanonical,
    client,
  };
}

async function fhirAPIMiddleware(): Promise<
  MiddlewareAsyncChain<unknown, IGUHealthServerCTX>
> {
  return createMiddlewareAsync([
    associateUserMiddleware,
    async (context) => {
      return {
        state: context.state,
        ctx: context.ctx,
        request: context.request,
        response: await context.ctx.client.request(
          context.ctx,
          context.request,
        ),
      };
    },
  ]);
}

export async function createFHIRAPI() {
  return new AsynchronousClient(
    {},
    createMiddlewareAsync([await fhirAPIMiddleware()]),
  );
}
