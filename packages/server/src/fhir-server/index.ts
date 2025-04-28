import { Redis } from "ioredis";
import pg from "pg";
import { pino } from "pino";
import pretty from "pino-pretty";

import { AsynchronousClient } from "@iguhealth/client";
import { FHIRClient, FHIRClientAsync } from "@iguhealth/client/interface";
import { createMiddlewareAsync } from "@iguhealth/client/middleware";
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
import { createArtifactClient } from "../fhir-clients/clients/artifacts/index.js";
import {
  MEMBERSHIP_METHODS_ALLOWED,
  MEMBERSHIP_RESOURCE_TYPES,
  createMembershipClient,
} from "../fhir-clients/clients/auth-storage/index.js";
import { MemoryParameter } from "../fhir-clients/clients/memory/async.js";
import RouterClient from "../fhir-clients/clients/router/index.js";
import createRequestToResponseMiddleware from "../fhir-clients/middleware/request-to-response.js";
// import sendQueueMiddleware from "../fhir-clients/middleware/send-to-queue.js";
import {
  indexingMiddleware,
  storageMiddleware,
  transactionMiddleware,
} from "../fhir-clients/middleware/storage.js";
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
  IguhealthPasswordResetInvoke,
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
import createCapabilitiesMiddleware from "./middleware/capabilities.js";
import createEncryptionMiddleware from "./middleware/encryption.js";
import createCheckTenantUsageMiddleware from "./middleware/usageCheck.js";
import createValidationMiddleware from "./middleware/validation.js";
import { IGUHealthServerCTX } from "./types.js";

type FHIRArtifactTypes = Record<string, MemoryParameter[]>;

const R4_SPECIAL_TYPES: FHIRArtifactTypes = {
  AUTH: MEMBERSHIP_RESOURCE_TYPES.map((resourceType) => ({ resourceType })),
  ARTIFACTS: [
    { resourceType: "StructureDefinition" as AllResourceTypes },
    {
      resourceType: "SearchParameter" as AllResourceTypes,
      // Don't want to load other searchparameters which could conflict with base for now.
      onlyPackages: [
        "@iguhealth/hl7.fhir.r4.core",
        "@iguhealth/iguhealth.fhir.r4.core",
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
  ARTIFACTS: [
    { resourceType: "StructureDefinition" as AllResourceTypes },
    {
      resourceType: "SearchParameter" as AllResourceTypes,
      onlyPackages: [
        "@iguhealth/hl7.fhir.r4b.core",
        "@iguhealth/iguhealth.fhir.r4b.core",
      ],
    },
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
    {},
    process.env.NODE_ENV === "development"
      ? pretty({
          levelFirst: true,
          colorize: true,
        })
      : undefined,
  );

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

export function createClient(): FHIRClientAsync<IGUHealthServerCTX> {
  const storage: FHIRClient<IGUHealthServerCTX> =
    new AsynchronousClient<IGUHealthServerCTX>(
      createMiddlewareAsync(
        undefined,
        [
          createRequestToResponseMiddleware({
            transaction_entry_limit: parseInt(
              process.env.POSTGRES_TRANSACTION_ENTRY_LIMIT ?? "20",
            ),
          }),
          transactionMiddleware(),
          storageMiddleware(),
          indexingMiddleware(),
          // Temp comment out until we have a better solution for the queue.
          // sendQueueMiddleware(),
        ],
        { logging: false },
      ),
    );

  const executioner = new AWSLambdaExecutioner({
    AWS_REGION: process.env.AWS_REGION as string,
    AWS_ACCESS_KEY_ID: process.env.AWS_LAMBDA_ACCESS_KEY_ID as string,
    AWS_ACCESS_KEY_SECRET: process.env.AWS_LAMBDA_ACCESS_KEY_SECRET as string,
    AWS_ROLE: process.env.AWS_LAMBDA_ROLE as string,
    AWS_LAMBDA_LAYERS: [process.env.AWS_LAMBDA_LAYER_ARN as string],
  });

  const lambdaSource = createOperationExecutioner(executioner);
  const inlineOperations = InlineExecutioner([
    createDeployOperation(executioner),
    StructureDefinitionSnapshotInvoke,
    ResourceValidateInvoke,
    ValueSetExpandInvoke,
    ValueSetValidateInvoke,
    CodeSystemLookupInvoke,
    IguhealthPasswordResetInvoke,
    IguhealthInviteUserInvoke,
    IguhealthUsageStatisticsInvoke,
    IguhealthMessagePostInvoke,
    IguhealthDeleteScopeInvoke,
    IguhealthListScopesInvoke,
    IguhealthListRefreshTokensInvoke,
    IguhealthDeleteRefreshTokenInvoke,
    EvaluatePolicyInvoke,
    IdentityProviderRegistrationInvoke,
  ]);
  const client = RouterClient(
    [
      createCheckTenantUsageMiddleware(),
      createValidationMiddleware(),
      createCapabilitiesMiddleware(),
      createEncryptionMiddleware(["OperationDefinition"]),
      createInjectScopesMiddleware(),
      createValidateScopesMiddleware(),
      createAuthorizationMiddleware(),
    ],
    [
      // OP INVOCATION
      {
        filter: {
          useSource: (request) => {
            return (
              request.type === "invoke-request" &&
              inlineOperations
                .supportedOperations()
                .map((op) => op.code)
                .includes(request.operation)
            );
          },
        },
        middleware: inlineOperations.middleware,
      },
      {
        filter: {
          r4: {
            levelsSupported: ["system", "type", "instance"],
            resourcesSupported: [...r4Sets.resourceTypes] as ResourceType<R4>[],
            interactionsSupported: ["invoke-request"],
          },
        },
        middleware: lambdaSource.middleware,
      },
      {
        filter: {
          r4: {
            levelsSupported: ["type", "instance"],
            resourcesSupported: R4_SPECIAL_TYPES.AUTH.map(
              (m) => m.resourceType,
            ),
            interactionsSupported: MEMBERSHIP_METHODS_ALLOWED,
          },
        },
        middleware: createMembershipClient({ fhirDB: storage }).middleware,
      },
      {
        filter: {
          r4: {
            levelsSupported: ["system", "type", "instance"],
            resourcesSupported: R4_SPECIAL_TYPES.ARTIFACTS.map(
              (m) => m.resourceType,
            ),
            interactionsSupported: ["read-request", "search-request"],
          },
          r4b: {
            levelsSupported: ["system", "type", "instance"],
            resourcesSupported: R4B_SPECIAL_TYPES.ARTIFACTS.map(
              (m) => m.resourceType,
            ),
            interactionsSupported: ["read-request", "search-request"],
          },
        },
        middleware: createArtifactClient({
          db: new pg.Pool({
            host: process.env.ARTIFACT_DB_PG_HOST,
            password: process.env.ARTIFACT_DB_PG_PASSWORD,
            user: process.env.ARTIFACT_DB_PG_USERNAME,
            database: process.env.ARTIFACT_DB_PG_NAME,
            port: parseInt(process.env.ARTIFACT_DB_PG_PORT ?? "5432"),
          }),
          operationsAllowed: [
            "read-request",
            "search-request",
            "vread-request",
            "history-request",
          ],
        }).middleware,
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
        middleware: storage.middleware,
      },
    ],
  );

  return client;
}
