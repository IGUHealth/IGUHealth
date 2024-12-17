import { Redis } from "ioredis";
import { pino } from "pino";

import { FHIRClientAsync } from "@iguhealth/client/interface";
import * as r4Sets from "@iguhealth/fhir-types/r4/sets";
import * as r4bSets from "@iguhealth/fhir-types/r4b/sets";
import {
  AllResourceTypes,
  R4,
  R4B,
  ResourceType,
} from "@iguhealth/fhir-types/versions";

import createAuthorizationMiddleware from "../authZ/middleware/authorization.js";
import {
  createInjectScopesMiddleware,
  createValidateScopesMiddleware,
} from "../authZ/middleware/scopes.js";
import { AWSLambdaExecutioner } from "../fhir-operation-executors/providers/aws/index.js";
import {
  CodeSystemLookupInvoke,
  EvaluatePolicyInvoke,
  IguhealthDeleteRefreshTokenInvoke,
  IguhealthDeleteScopeInvoke,
  IguhealthInviteUserInvoke,
  IguhealthListRefreshTokensInvoke,
  IguhealthListScopesInvoke,
  IguhealthMessagePostInvoke,
  IguhealthUsageStatisticsInvoke,
  ResourceValidateInvoke,
  StructureDefinitionSnapshotInvoke,
  ValueSetExpandInvoke,
  ValueSetValidateInvoke,
} from "../fhir-operation-executors/providers/local/index.js";
import InlineExecutioner from "../fhir-operation-executors/providers/local/middleware.js";
import { createDeployOperation } from "../fhir-operation-executors/providers/local/ops/deploy-operation.js";
import { IdentityProviderRegistrationInvoke } from "../fhir-operation-executors/providers/local/ops/identity_provider/registration-info.js";
import createOperationExecutioner from "../fhir-operation-executors/providers/middleware.js";
import {
  AUTH_METHODS_ALLOWED,
  AUTH_RESOURCETYPES,
  createAuthStorageClient,
} from "../fhir-storage/providers/middleware/auth-storage/index.js";
import {
  MemoryParameter,
  createArtifactMemoryDatabase,
} from "../fhir-storage/providers/middleware/memory/async.js";
import { createRemoteStorage } from "../fhir-storage/providers/middleware/postgres/index.js";
import RouterClient from "../fhir-storage/providers/middleware/router/index.js";
import createCapabilitiesMiddleware from "./middleware/capabilities.js";
import createEncryptionMiddleware from "./middleware/encryption.js";
import createCheckTenantUsageMiddleware from "./middleware/usageCheck.js";
import createValidationMiddleware from "./middleware/validation.js";
import { IGUHealthServerCTX } from "./types.js";
import { PostgresStore } from "../fhir-storage/resource-stores/postgres.js";
import { PostgresSearchEngine } from "../fhir-storage/search-stores/postgres/index.js";

type FHIRArtifactTypes = Record<string, MemoryParameter[]>;

const R4_SPECIAL_TYPES: FHIRArtifactTypes = {
  AUTH: AUTH_RESOURCETYPES.map((resourceType) => ({ resourceType })),
  MEMORY: [
    { resourceType: "StructureDefinition" as AllResourceTypes },
    {
      resourceType: "SearchParameter" as AllResourceTypes,
      // Don't want to load other searchparameters which could conflict with base for now.
      onlyPackages: [
        "@iguhealth/hl7.fhir.r4.core",
        "@iguhealth/hl7.fhir.r4b.core",
        "@iguhealth/iguhealth.fhir.r4.core",
        "@iguhealth/iguhealth.fhir.r4b.core",
      ],
    },
    { resourceType: "ValueSet" as AllResourceTypes },
    { resourceType: "CodeSystem" as AllResourceTypes },
  ],
};
const R4_ALL_SPECIAL_TYPES = Object.values(R4_SPECIAL_TYPES).flatMap((v) => v);
const R4_DB_TYPES: ResourceType<R4>[] = (
  [...r4Sets.resourceTypes] as ResourceType<R4>[]
).filter(
  (type) =>
    R4_ALL_SPECIAL_TYPES.find((k) => k.resourceType === type) === undefined,
);

const R4B_SPECIAL_TYPES: FHIRArtifactTypes = {
  DISSALLOWED: [
    // "Subscription",
    // "SubscriptionTopic",
    // "SubscriptionStatus",
    { resourceType: "OperationDefinition" as AllResourceTypes },
  ],
  MEMORY: [
    { resourceType: "StructureDefinition" as AllResourceTypes },
    { resourceType: "SearchParameter" as AllResourceTypes },
    { resourceType: "ValueSet" as AllResourceTypes },
    { resourceType: "CodeSystem" as AllResourceTypes },
  ],
};

const R4B_ALL_SPECIAL_TYPES = Object.values(R4B_SPECIAL_TYPES).flatMap(
  (v) => v,
);
const R4B_DB_TYPES: ResourceType<R4B>[] = (
  [...r4bSets.resourceTypes] as ResourceType<R4B>[]
).filter(
  (type) =>
    R4B_ALL_SPECIAL_TYPES.find((k) => k.resourceType === type) === undefined,
);

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
      createInjectScopesMiddleware(),
      createValidateScopesMiddleware(),
      createAuthorizationMiddleware(),
    ],
    sources,
  );
}

export function createClient(): {
  client: FHIRClientAsync<IGUHealthServerCTX>;
  resolveCanonical: IGUHealthServerCTX["resolveCanonical"];
  resolveTypeToCanonical: IGUHealthServerCTX["resolveTypeToCanonical"];
} {
  const memSource = createArtifactMemoryDatabase({
    r4: R4_SPECIAL_TYPES.MEMORY,
    r4b: R4B_SPECIAL_TYPES.MEMORY,
  });
  const remoteStorage = createRemoteStorage({
    transaction_entry_limit: parseInt(
      process.env.POSTGRES_TRANSACTION_ENTRY_LIMIT || "20",
    ),
    store: new PostgresStore(),
    search: new PostgresSearchEngine(),
  });
  const executioner = new AWSLambdaExecutioner({
    AWS_REGION: process.env.AWS_REGION as string,
    AWS_ACCESS_KEY_ID: process.env.AWS_LAMBDA_ACCESS_KEY_ID as string,
    AWS_ACCESS_KEY_SECRET: process.env.AWS_LAMBDA_ACCESS_KEY_SECRET as string,
    AWS_ROLE: process.env.AWS_LAMBDA_ROLE as string,
    AWS_LAMBDA_LAYERS: [process.env.AWS_LAMBDA_LAYER_ARN as string],
  });
  const lambdaSource = createOperationExecutioner(executioner);
  const inlineSource = InlineExecutioner([
    createDeployOperation(executioner),
    StructureDefinitionSnapshotInvoke,
    ResourceValidateInvoke,
    ValueSetExpandInvoke,
    ValueSetValidateInvoke,
    CodeSystemLookupInvoke,
    IguhealthMessagePostInvoke,
    IguhealthInviteUserInvoke,
    IguhealthUsageStatisticsInvoke,
    IguhealthDeleteScopeInvoke,
    IguhealthListScopesInvoke,
    IguhealthListRefreshTokensInvoke,
    IguhealthDeleteRefreshTokenInvoke,
    EvaluatePolicyInvoke,
    IdentityProviderRegistrationInvoke,
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
          resourcesSupported: R4_SPECIAL_TYPES.MEMORY.map(
            (m) => m.resourceType,
          ),
          interactionsSupported: ["read-request", "search-request"],
        },
        r4b: {
          levelsSupported: ["system", "type", "instance"],
          resourcesSupported: R4B_SPECIAL_TYPES.MEMORY.map(
            (m) => m.resourceType,
          ),
          interactionsSupported: ["read-request", "search-request"],
        },
      },
      source: memSource,
    },
    {
      filter: {
        r4: {
          levelsSupported: ["type", "instance"],
          resourcesSupported: R4_SPECIAL_TYPES.AUTH.map((m) => m.resourceType),
          interactionsSupported: AUTH_METHODS_ALLOWED,
        },
      },
      source: createAuthStorageClient(remoteStorage),
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
      source: remoteStorage,
    },
  ]);

  return {
    resolveCanonical: memSource.resolveCanonical,
    resolveTypeToCanonical: memSource.resolveTypeToCanonical,
    client,
  };
}
