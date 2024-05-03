import Router from "@koa/router";
import Ajv from "ajv";
import { Redis } from "ioredis";
import type * as koa from "koa";
import pg from "pg";
import { pino } from "pino";

import { AsynchronousClient } from "@iguhealth/client";
import { FHIRClientAsync } from "@iguhealth/client/interface";
import {
  MiddlewareAsyncChain,
  createMiddlewareAsync,
} from "@iguhealth/client/middleware";
import { FHIRRequest, FHIRResponse } from "@iguhealth/client/types";
import * as r4Sets from "@iguhealth/fhir-types/r4/sets";
import {
  CapabilityStatementRestResource,
  code,
} from "@iguhealth/fhir-types/r4/types";
import * as r4bSets from "@iguhealth/fhir-types/r4b/sets";
import {
  AllResourceTypes,
  FHIR_VERSION,
  R4,
  R4B,
  Resource,
  ResourceType,
} from "@iguhealth/fhir-types/versions";
import { TenantId } from "@iguhealth/jwt";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { associateUserMiddleware } from "../authZ/middleware/associateUser.js";
import { createAuthorizationMiddleWare } from "../authZ/middleware/authorization.js";
import RedisCache from "../cache/providers/redis.js";
import { EmailProvider } from "../email/interface.js";
import SendGrid from "../email/providers/sendgrid.js";
import { encryptValue } from "../encryption/index.js";
import { AWSKMSProvider } from "../encryption/provider/kms.js";
import AWSLambdaExecutioner from "../fhir-operation-executors/providers/awsLambda/index.js";
import IguhealthEncryptInvoke from "../fhir-operation-executors/providers/local/encryption/encrypt.js";
import InlineExecutioner from "../fhir-operation-executors/providers/local/index.js";
import IguhealthMessagePostInvoke from "../fhir-operation-executors/providers/local/messaging/message_post.js";
import ResourceValidateInvoke, {
  validateResource,
} from "../fhir-operation-executors/providers/local/resource_validate.js";
import StructureDefinitionSnapshotInvoke from "../fhir-operation-executors/providers/local/structureDefinition/snapshot.js";
import ValueSetExpandInvoke from "../fhir-operation-executors/providers/local/terminology/expand.js";
import CodeSystemLookupInvoke from "../fhir-operation-executors/providers/local/terminology/lookup.js";
import ValueSetValidateInvoke from "../fhir-operation-executors/providers/local/terminology/validate.js";
import {
  AUTH_METHODS_ALLOWED,
  AUTH_RESOURCETYPES,
  createAuthStorageClient,
} from "../fhir-storage/providers/auth-storage/index.js";
import { createArtifactMemoryDatabase } from "../fhir-storage/providers/memory/async.js";
import { createPostgresClient } from "../fhir-storage/providers/postgres/index.js";
import RouterClient from "../fhir-storage/router.js";
import { TerminologyProviderMemory } from "../fhir-terminology/index.js";
import JSONPatchSchema from "../json-schemas/schemas/jsonpatch.schema.json" with { type: "json" };
import RedisLock from "../synchronization/redis.lock.js";
import { FHIRServerCTX, KoaContext, asSystemCTX } from "./types.js";

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

async function createResourceRestCapabilities(
  ctx: FHIRServerCTX,
  fhirVersion: FHIR_VERSION,
  memdb: FHIRClientAsync<FHIRServerCTX>,
  sd: Resource<FHIR_VERSION, "StructureDefinition">,
): Promise<CapabilityStatementRestResource> {
  const resourceParameters = await memdb.search_type(
    ctx,
    fhirVersion,
    "SearchParameter",
    [
      { name: "_count", value: [1000] },
      {
        name: "base",
        value: ["Resource", "DomainResource", sd.type],
      },
    ],
  );

  return {
    type: sd.type as unknown as code,
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
  } as CapabilityStatementRestResource;
}

async function serverCapabilities<Version extends FHIR_VERSION>(
  ctx: FHIRServerCTX,
  fhirVersion: Version,
  client: FHIRClientAsync<FHIRServerCTX>,
): Promise<Resource<Version, "CapabilityStatement">> {
  const sds = (
    await client.search_type(ctx, fhirVersion, "StructureDefinition", [
      { name: "_count", value: [1000] },
    ])
  ).resources.filter((sd) => sd.abstract === false && sd.kind === "resource");

  const rootParameters = await client.search_type(
    ctx,
    fhirVersion,
    "SearchParameter",
    [
      { name: "_count", value: [1000] },
      {
        name: "base",
        value: ["Resource", "DomainResource"],
      },
    ],
  );

  return {
    resourceType: "CapabilityStatement",
    status: "active",
    fhirVersion: fhirVersion,
    date: new Date().toISOString(),
    kind: "capability",
    format: ["json"],
    rest: [
      {
        mode: "server",
        security: {
          cors: true,
        },
        interaction: [{ code: "search-system" }],
        searchParam: rootParameters.resources.map((resource) => ({
          name: resource.name,
          definition: resource.url,
          type: resource.type,
          documentation: resource.description,
        })),
        resource: await Promise.all(
          sds.map((sd) =>
            createResourceRestCapabilities(ctx, fhirVersion, client, sd),
          ),
        ),
      },
    ],
  } as Resource<Version, "CapabilityStatement">;
}

export const logger = pino<string>();

function getResourceTypeToValidate(
  request: FHIRRequest,
): ResourceType<FHIR_VERSION> {
  switch (request.type) {
    case "create-request":
      return request.resourceType;
    case "update-request":
      return request.resourceType;
    case "invoke-request":
      return request.body.resourceType;
    case "transaction-request":
    case "batch-request":
      return "Bundle";
    default:
      throw new OperationError(
        outcomeError(
          "invalid",
          `cannot validate resource type '${request.type}'`,
        ),
      );
  }
}

/**
 * Used for JSON PATCH validation which is non FHIR data.
 */
const ajv = new Ajv.default({});
const validateJSONPatch = ajv.compile(JSONPatchSchema);

/**
 * Type manipulation to get state of a routerclient used for subsequent middlewares.
 */
type RouterState = Parameters<
  Parameters<typeof RouterClient>[0][number]
>[0]["state"];

const validationMiddleware: MiddlewareAsyncChain<
  RouterState,
  FHIRServerCTX
> = async (context, next) => {
  switch (context.request.type) {
    case "update-request":
    case "create-request":
    case "batch-request":
    case "invoke-request":
    case "transaction-request": {
      const outcome = await validateResource(
        asSystemCTX(context.ctx),
        context.request.fhirVersion,
        getResourceTypeToValidate(context.request),
        {
          mode: (context.request.type === "create-request"
            ? "create"
            : "update") as code,
          resource: context.request.body,
        },
      );
      if (
        outcome.issue.find(
          (i) => i.severity === "fatal" || i.severity === "error",
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
          outcomeError("invalid", ajv.errorsText(validateJSONPatch.errors)),
        );
      }
      break;
    }
  }

  return next(context);
};

const capabilitiesMiddleware: MiddlewareAsyncChain<
  RouterState,
  FHIRServerCTX
> = async (context, next) => {
  if (context.request.type === "capabilities-request") {
    return {
      ...context,
      response: {
        fhirVersion: context.request.fhirVersion,
        level: "system",
        type: "capabilities-response",
        body: await serverCapabilities(
          context.ctx,
          context.request.fhirVersion,
          context.ctx.client,
        ),
      } as FHIRResponse,
    };
  }

  return next(context);
};

const encryptionMiddleware: (
  resourceTypesToEncrypt: AllResourceTypes[],
) => MiddlewareAsyncChain<RouterState, FHIRServerCTX> =
  (resourceTypesToEncrypt: AllResourceTypes[]) => async (context, next) => {
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
            context.request.body,
          );
          return next({
            ...context,
            // @ts-ignore
            request: { ...context.request, body: encrypted },
          });
        }
        case "patch-request": {
          const encrypted = await encryptValue(
            context.ctx,
            // Should be safe as given patch should be validated.
            context.request.body as object,
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

let _redis_client: Redis | undefined = undefined;
/**
 * Returns instantiated Redis client based on environment variables.
 * @returns Singleton Redis client
 */
export function getRedisClient() {
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
async function createFHIRClient(sources: RouterState["sources"]) {
  return RouterClient(
    [
      validationMiddleware,
      capabilitiesMiddleware,
      encryptionMiddleware(["OperationDefinition"]),
      createAuthorizationMiddleWare<RouterState>(),
    ],
    sources,
  );
}

export async function createFHIRServices(
  pool: pg.Pool,
): Promise<Omit<FHIRServerCTX, "tenant" | "user">> {
  const memDBAsync = createArtifactMemoryDatabase({
    r4: R4_SPECIAL_TYPES.MEMORY,
    r4b: R4B_SPECIAL_TYPES.MEMORY,
  });
  const pgFHIR = createPostgresClient({
    transaction_entry_limit: parseInt(
      process.env.POSTGRES_TRANSACTION_ENTRY_LIMIT || "20",
    ),
  });

  const inlineOperationExecution = InlineExecutioner([
    StructureDefinitionSnapshotInvoke,
    IguhealthEncryptInvoke,
    ResourceValidateInvoke,
    ValueSetExpandInvoke,
    ValueSetValidateInvoke,
    CodeSystemLookupInvoke,
    IguhealthMessagePostInvoke,
  ]);

  const lambdaExecutioner = AWSLambdaExecutioner({
    AWS_REGION: process.env.AWS_REGION as string,
    AWS_ACCESS_KEY_ID: process.env.AWS_LAMBDA_ACCESS_KEY_ID as string,
    AWS_ACCESS_KEY_SECRET: process.env.AWS_LAMBDA_ACCESS_KEY_SECRET as string,
    LAMBDA_ROLE: process.env.AWS_LAMBDA_ROLE as string,
    LAYERS: [process.env.AWS_LAMBDA_LAYER_ARN as string],
  });

  const redis = getRedisClient();
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

  const lock = new RedisLock(redis);
  const cache = new RedisCache(redis);

  const client = await createFHIRClient([
    // OP INVOCATION
    {
      filter: {
        useSource: (request) => {
          return (
            request.type === "invoke-request" &&
            inlineOperationExecution
              .supportedOperations()
              .map((op) => op.code)
              .includes(request.operation)
          );
        },
      },
      source: inlineOperationExecution,
    },
    {
      filter: {
        r4: {
          levelsSupported: ["system", "type", "instance"],
          resourcesSupported: [...r4Sets.resourceTypes] as ResourceType<R4>[],
          interactionsSupported: ["invoke-request"],
        },
      },
      source: lambdaExecutioner,
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
      source: memDBAsync,
    },
    {
      filter: {
        r4: {
          levelsSupported: ["type", "instance"],
          resourcesSupported: R4_SPECIAL_TYPES.AUTH,
          interactionsSupported: AUTH_METHODS_ALLOWED,
        },
      },
      source: createAuthStorageClient(pgFHIR),
    },
    {
      filter: {
        r4: {
          levelsSupported: ["system", "type", "instance"],
          resourcesSupported: R4_DB_TYPES,
          interactionsSupported: [
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
      source: pgFHIR,
    },
  ]);

  return {
    db: pool,
    logger: logger,
    lock,
    cache,
    terminologyProvider,
    encryptionProvider,
    resolveCanonical: memDBAsync.resolveCanonical,
    resolveTypeToCanonical: memDBAsync.resolveTypeToCanonical,
    client,
  };
}

export function createEmailProvider(): EmailProvider | undefined {
  switch (process.env.EMAIL_PROVIDER) {
    case "sendgrid": {
      if (!process.env.EMAIL_SENDGRID_API_KEY)
        throw new Error("EMAIL_SENDGRID_API_KEY not set");
      return new SendGrid(process.env.EMAIL_SENDGRID_API_KEY as string);
    }
    default:
      return undefined;
  }
}

export async function createKoaFHIRServices<State, Context>(
  pool: pg.Pool,
): Promise<
  koa.Middleware<
    State,
    (Context & KoaContext.FHIRServices) &
      Router.RouterParamContext<State, Context & KoaContext.FHIRServices>
  >
> {
  const fhirServices = await createFHIRServices(pool);

  return async (ctx, next) => {
    ctx.emailProvider = createEmailProvider();
    ctx.postgres = pool;
    ctx.FHIRContext = fhirServices;
    await next();
  };
}

export async function createKoaFHIRContextMiddleware<
  State extends {
    access_token?: string;
    user: { [key: string]: unknown };
  },
  Context extends KoaContext.FHIRServices,
>(): Promise<
  koa.Middleware<
    State,
    KoaContext.FHIR<Context> &
      Router.RouterParamContext<State, KoaContext.FHIR<Context>>
  >
> {
  return async (ctx, next) => {
    if (!ctx.params.tenant)
      throw new OperationError(
        outcomeError("invalid", "No tenant present in request."),
      );

    if (!ctx.FHIRContext) {
      throw new OperationError(
        outcomeError("invariant", "FHIR Context not set"),
      );
    }

    ctx.FHIRContext = {
      ...ctx.FHIRContext,
      tenant: ctx.params.tenant as TenantId,
    };
    await next();
  };
}

async function fhirAPIMiddleware(): Promise<
  MiddlewareAsyncChain<unknown, FHIRServerCTX>
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
