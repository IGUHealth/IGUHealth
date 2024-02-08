import Router from "@koa/router";
import Ajv from "ajv";
import { Redis } from "ioredis";
import type * as koa from "koa";
import path from "path";
import pg from "pg";
import { pino } from "pino";
import { fileURLToPath } from "url";

import { loadArtifacts } from "@iguhealth/artifacts";
import { AsynchronousClient } from "@iguhealth/client";
import { FHIRClientAsync } from "@iguhealth/client/interface";
import {
  MiddlewareAsync,
  createMiddlewareAsync,
} from "@iguhealth/client/middleware";
import { FHIRRequest } from "@iguhealth/client/types";
import { resourceTypes } from "@iguhealth/fhir-types/r4/sets";
import {
  AResource,
  CapabilityStatement,
  CapabilityStatementRestResource,
  Resource,
  ResourceType,
  StructureDefinition,
  canonical,
  code,
  id,
  uri,
} from "@iguhealth/fhir-types/r4/types";
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
import ResourceValidateInvoke, {
  validateResource,
} from "../fhir-operation-executors/providers/local/resource_validate.js";
import StructureDefinitionSnapshotInvoke from "../fhir-operation-executors/providers/local/structureDefinition/snapshot.js";
import ValueSetExpandInvoke from "../fhir-operation-executors/providers/local/terminology/expand.js";
import CodeSystemLookupInvoke from "../fhir-operation-executors/providers/local/terminology/lookup.js";
import ValueSetValidateInvoke from "../fhir-operation-executors/providers/local/terminology/validate.js";
import MemoryDatabaseAsync from "../fhir-storage/providers/memory/async.js";
import { InternalData } from "../fhir-storage/providers/memory/types.js";
import { createPostgresClient } from "../fhir-storage/providers/postgres/index.js";
import RouterClient from "../fhir-storage/router.js";
import { TerminologyProviderMemory } from "../fhir-terminology/index.js";
import JSONPatchSchema from "../json-schemas/jsonpatch.schema.js";
import RedisLock from "../synchronization/redis.lock.js";
import { FHIRServerCTX, TenantId, asSystemCTX } from "./context.js";
import { KoaFHIRContext, KoaFHIRServicesContext } from "./koa.js";

export const MEMORY_TYPES: ResourceType[] = [
  "StructureDefinition",
  "SearchParameter",
  "ValueSet",
  "CodeSystem",
];

export function createMemoryData(
  resourceTypes: ResourceType[],
): InternalData<ResourceType> {
  const artifactResources: Resource[] = resourceTypes
    .map((resourceType) =>
      loadArtifacts({
        resourceType,
        packageLocation: path.join(fileURLToPath(import.meta.url), "../../../"),
      }),
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
  sd: StructureDefinition,
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

export async function serverCapabilities(
  ctx: Partial<FHIRServerCTX>,
  memdb: FHIRClientAsync<unknown>,
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
    fhirVersion: "4.0.1",
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
          sds.map((sd) => createResourceRestCapabilities(ctx, memdb, sd)),
        ),
      },
    ],
  } as CapabilityStatement;
}

export const logger = pino<string>();

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

const validationMiddleware: MiddlewareAsync<
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
          outcomeError("invalid", `JSON Patch is not valid.`),
        );
      }
      break;
    }
  }
  if (!next) throw new Error("No next");
  return next(context);
};

const capabilitiesMiddleware: MiddlewareAsync<
  RouterState,
  FHIRServerCTX
> = async (context, next) => {
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
  resourceTypesToEncrypt: ResourceType[],
) => MiddlewareAsync<RouterState, FHIRServerCTX> =
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
            context.request.body,
          );
          return next({
            ...context,
            request: { ...context.request, body: encrypted },
          });
        }
        case "patch-request": {
          const encrypted = await encryptValue(
            context.ctx,
            context.request.body,
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

export function createResolveCanonical(
  data: InternalData<ResourceType>,
): <T extends ResourceType>(type: T, url: string) => AResource<T> | undefined {
  const map = new Map<ResourceType, Map<string, string>>();
  for (const resourceType of Object.keys(data)) {
    for (const resource of Object.values(
      data[resourceType as ResourceType] ?? {},
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

export function createResolveTypeToCanonical(
  data: InternalData<ResourceType>,
): (type: uri) => canonical | undefined {
  const map = new Map<uri, canonical>();
  const sds: Record<id, StructureDefinition | undefined> = data[
    "StructureDefinition"
  ] as Record<id, StructureDefinition | undefined>;

  for (const resource of Object.values(sds || {})) {
    if (resource?.type && resource?.url) {
      map.set(resource.type, resource.url as canonical);
    }
  }

  return (type: uri) => {
    return map.get(type);
  };
}

export function getRedisClient() {
  const redisClient = new Redis({
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
      encryptionMiddleware(["OperationDefinition", "Membership"]),
      createAuthorizationMiddleWare<RouterState>(),
    ],
    sources,
  );
}

export async function createFHIRServices(
  pool: pg.Pool,
): Promise<Omit<FHIRServerCTX, "tenant" | "user">> {
  const data = createMemoryData(MEMORY_TYPES);
  const memDBAsync = MemoryDatabaseAsync(data);

  const inlineOperationExecution = InlineExecutioner([
    StructureDefinitionSnapshotInvoke,
    IguhealthEncryptInvoke,
    ResourceValidateInvoke,
    ValueSetExpandInvoke,
    ValueSetValidateInvoke,
    CodeSystemLookupInvoke,
  ]);

  const lambdaExecutioner = AWSLambdaExecutioner({
    AWS_REGION: process.env.AWS_REGION as string,
    AWS_ACCESS_KEY_ID: process.env.AWS_LAMBDA_ACCESS_KEY_ID as string,
    AWS_ACCESS_KEY_SECRET: process.env.AWS_LAMBDA_ACCESS_KEY_SECRET as string,
    LAMBDA_ROLE: process.env.AWS_LAMBDA_ROLE as string,
    LAYERS: [process.env.AWS_LAMBDA_LAYER_ARN as string],
  });

  const resolveCanonical = createResolveCanonical(data);
  const resolveTypeToCanonical = createResolveTypeToCanonical(data);
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
  const capabilities = await serverCapabilities(
    { resolveCanonical, resolveTypeToCanonical },
    memDBAsync,
  );
  const client = await createFHIRClient([
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
        (type) => MEMORY_TYPES.indexOf(type as ResourceType) === -1,
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
      source: createPostgresClient(pool, {
        transaction_entry_limit: parseInt(
          process.env.POSTGRES_TRANSACTION_ENTRY_LIMIT || "20",
        ),
      }),
    },
  ]);

  return {
    logger: logger,
    lock,
    cache,
    capabilities,
    terminologyProvider,
    encryptionProvider,
    resolveCanonical,
    resolveTypeToCanonical,
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
    KoaFHIRServicesContext<Context> &
      Router.RouterParamContext<State, KoaFHIRServicesContext<Context>>
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
  Context extends KoaFHIRServicesContext<unknown>,
>(): Promise<
  koa.Middleware<
    State,
    KoaFHIRContext<Context> &
      Router.RouterParamContext<State, KoaFHIRContext<Context>>
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
  MiddlewareAsync<unknown, FHIRServerCTX>
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
  return new AsynchronousClient({}, await fhirAPIMiddleware());
}
