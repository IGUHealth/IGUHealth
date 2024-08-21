// Backend Processes used for subscriptions and cron jobs.
import { randomUUID } from "crypto";
import pg from "pg";
import * as db from "zapatos/db";
import * as s from "zapatos/schema";

import { AsynchronousClient } from "@iguhealth/client";
import createHTTPClient from "@iguhealth/client/http";
import {
  BundleEntry,
  Parameters,
  Subscription,
  code,
  id,
} from "@iguhealth/fhir-types/r4/types";
import * as r4b from "@iguhealth/fhir-types/r4b/types";
import {
  AllResourceTypes,
  FHIR_VERSION,
  R4,
  Resource,
} from "@iguhealth/fhir-types/versions";
import * as fhirpath from "@iguhealth/fhirpath";
import {
  createCertsIfNoneExists,
  getSigningKey,
} from "@iguhealth/jwt/certifications";
import { createToken } from "@iguhealth/jwt/token";
import {
  AccessTokenPayload,
  CUSTOM_CLAIMS,
  Subject,
  TenantId,
} from "@iguhealth/jwt/types";
import {
  OperationError,
  isOperationError,
  outcomeError,
} from "@iguhealth/operation-outcomes";

import { getIssuer } from "../authN/oidc/constants.js";
import { WORKER_APP } from "../authN/oidc/hardcodedClients/worker-app.js";
import RedisCache from "../cache/providers/redis.js";
import loadEnv from "../env.js";
import { createLogger, getRedisClient } from "../fhir-api/index.js";
import { IGUHealthServerCTX } from "../fhir-api/types.js";
import { httpRequestToFHIRRequest } from "../fhir-http/index.js";
import logAuditEvent, {
  MAJOR_FAILURE,
  SERIOUS_FAILURE,
  createAuditEvent,
} from "../fhir-logging/auditEvents.js";
import { resolveOperationDefinition } from "../fhir-operation-executors/utilities.js";
import { createArtifactMemoryDatabase } from "../fhir-storage/providers/memory/async.js";
import { fitsSearchCriteria } from "../fhir-storage/providers/memory/search.js";
import { createPGPool } from "../fhir-storage/providers/postgres/pg.js";
import { createResolverRemoteCanonical } from "../fhir-storage/utilities/canonical.js";
import {
  SearchParameterResource,
  deriveResourceTypeFilter,
  findSearchParameter,
  parametersWithMetaAssociated,
} from "../fhir-storage/utilities/search/parameters.js";
import * as Sentry from "../monitoring/sentry.js";
import RedisLock from "../synchronization/redis.lock.js";
import { LIB_VERSION } from "../version.js";

loadEnv();

type WorkerServices = Pick<
  IGUHealthServerCTX,
  | "db"
  | "logger"
  | "cache"
  | "tenant"
  | "user"
  | "resolveCanonical"
  | "resolveTypeToCanonical"
>;

if (process.env.NODE_ENV === "development") {
  await createCertsIfNoneExists(
    process.env.AUTH_LOCAL_CERTIFICATION_LOCATION,
    process.env.AUTH_LOCAL_SIGNING_KEY,
  );
}

if (process.env.SENTRY_WORKER_DSN)
  Sentry.enableSentry(process.env.SENTRY_WORKER_DSN, LIB_VERSION, {
    tracesSampleRate: parseFloat(
      process.env.SENTRY_TRACES_SAMPLE_RATE || "0.1",
    ),
    profilesSampleRate: parseFloat(
      process.env.SENTRY_PROFILES_SAMPLE_RATE || "0.1",
    ),
  });

async function getVersionSequence(
  resource: Resource<R4, AllResourceTypes>,
): Promise<number> {
  const evaluation = (
    await fhirpath.evaluate(
      "$this.meta.extension.where(url=%sequenceUrl).value",
      resource,
      {
        variables: {
          sequenceUrl: "https://iguhealth.app/version-sequence",
        },
      },
    )
  )[0];

  if (typeof evaluation !== "number") {
    throw new Error("No version sequence found.");
  }

  return evaluation;
}

async function handleSubscriptionPayload(
  client: AsynchronousClient<unknown, unknown>,
  services: WorkerServices,
  fhirVersion: R4,
  subscription: Subscription,
  payload: Resource<FHIR_VERSION, AllResourceTypes>[],
): Promise<void> {
  const channelType = (
    await fhirpath.evaluate(
      "$this.channel.type | $this.channel.type.extension.where(url=%typeUrl).value",
      subscription,
      {
        variables: {
          typeUrl: "https://iguhealth.app/Subscription/channel-type",
        },
      },
    )
  )[0];

  switch (channelType) {
    case "rest-hook": {
      if (!subscription.channel.endpoint) {
        throw new OperationError(
          outcomeError("invalid", `Subscription channel is missing endpoint.`),
        );
      }

      const headers = subscription.channel.header
        ?.map((h) => h.split(":").map((h) => h.trim()))
        .reduce((acc: Record<string, string>, [key, value]) => {
          if (!key || !value) return acc;
          acc[key] = value;
          return acc;
        }, {});

      await Promise.all(
        payload.map((resource) =>
          fetch(subscription.channel.endpoint as string, {
            method: "POST",
            // headers: subscription.channel.header,
            headers: { ...headers, "Content-Type": "application/fhir+json" },
            body: JSON.stringify(resource),
          }),
        ),
      );
      return;
    }
    case "operation": {
      const OPERATION_URL = "https://iguhealth.app/Subscription/operation-code";
      const operation = (
        await fhirpath.evaluate(
          "$this.channel.type.extension.where(url=%operationUrl).value",
          subscription,
          {
            variables: {
              operationUrl: OPERATION_URL,
            },
          },
        )
      )[0];
      if (typeof operation !== "string") {
        logAuditEvent(
          client,
          {},
          fhirVersion,
          createAuditEvent(
            services.user.payload,
            MAJOR_FAILURE,
            { reference: `Subscription/${subscription.id}` },
            `No Operation was specified, specifiy via extension '${OPERATION_URL}' with valueCode of operation code.`,
          ),
        );
        throw new OperationError(
          outcomeError("invalid", "Subscription contained invalid operation"),
        );
      }
      const operationDefinition = await resolveOperationDefinition(
        client,
        services,
        fhirVersion,
        operation,
      );

      await client.invoke_system(operationDefinition.code, {}, fhirVersion, {
        resourceType: "Parameters",
        parameter: payload.map((resource) => ({
          name: "payload",
          resource: resource as Resource<R4, AllResourceTypes>,
        })),
      } as Parameters);

      return;
    }
    case "message": {
      if (!subscription.channel.endpoint) {
        throw new OperationError(
          outcomeError("invalid", `Subscription channel is missing endpoint.`),
        );
      }

      const bundle: Resource<R4, "Bundle"> = {
        resourceType: "Bundle",
        type: "message",
        timestamp: new Date().toISOString(),
        entry: [
          {
            resource: {
              eventCoding: {
                system: "https://iguhealth.app",
                code: "subscription-message",
              },
              resourceType: "MessageHeader",
              source: {
                name: "worker",
                endpoint: `${subscription.resourceType}/${subscription.id}`,
              },
            } as Resource<R4, "MessageHeader">,
          },
          ...payload.map((resource) => ({
            resource,
          })),
        ],
      } as Resource<R4, "Bundle">;

      const endpoint = subscription.channel.endpoint;
      const headers = subscription.channel.header
        ?.map((h) => h.split(":").map((h) => h.trim()))
        .reduce((acc: Record<string, string>, [key, value]) => {
          if (!key || !value) return acc;
          acc[key] = value;
          return acc;
        }, {});

      const response = await fetch(endpoint as string, {
        method: "POST",
        // headers: subscription.channel.header,
        headers: { ...headers, "Content-Type": "application/fhir+json" },
        body: JSON.stringify(bundle),
      });

      if (response.status >= 400) {
        throw new OperationError(
          outcomeError(
            "invalid",
            `Failed to send message to endpoint ${endpoint}.`,
          ),
        );
      }

      return;
    }

    default: {
      throw new OperationError(
        outcomeError(
          `not-supported`,
          `'${channelType}' is not supported for subscription.`,
        ),
      );
    }
  }
}

// Returns key for subscription lock.
function subscriptionLockKey(tenant: string, subscriptionId: string) {
  return `${tenant}:${subscriptionId}`;
}

function processSubscription(
  workerID: string,
  ctx: WorkerServices,
  fhirVersion: FHIR_VERSION,
  client: AsynchronousClient<unknown, unknown>,
  subscriptionId: id,
) {
  if (fhirVersion !== R4)
    throw new OperationError(
      outcomeError(
        "not-supported",
        `FHIR version ${fhirVersion} is not supported.`,
      ),
    );
  return async () => {
    // Reread here in event that concurrent process has altered the id.
    const subscription = await client.read(
      {},
      fhirVersion,
      "Subscription",
      subscriptionId,
    );
    if (!subscription)
      throw new OperationError(
        outcomeError(
          "not-found",
          `Subscription with id '${subscriptionId}' not found.`,
        ),
      );
    if (subscription.status !== "active") return;

    const logger = ctx.logger.child({
      worker: workerID,
      tenant: ctx.tenant,
      criteria: subscription.criteria,
    });

    try {
      // Only doing r4 for Subs right now.
      const request = httpRequestToFHIRRequest("r4", {
        url: subscription.criteria,
        method: "GET",
      });

      if (request.type !== "search-request") {
        throw new OperationError(
          outcomeError(
            "invalid",
            `Criteria must be a search request but found ${request.type}`,
          ),
        );
      }

      if (request.fhirVersion !== R4) {
        throw new OperationError(
          outcomeError(
            "invalid",
            `Criteria must be a search request for FHIR version 4.0 but found ${request.fhirVersion}`,
          ),
        );
      }

      const sortParameter = request.parameters.find((p) => p.name === "_sort");

      if (sortParameter) {
        throw new OperationError(
          outcomeError(
            "invalid",
            `Criteria cannot include _sort. Sorting must be based order resource was updated.`,
          ),
        );
      }

      const cachedSubID = await ctx.cache.get(ctx, `${subscription.id}_latest`);

      const latestVersionIdForSub = cachedSubID
        ? cachedSubID
        : // If latest isn't there then use the subscription version when created.
          await getVersionSequence(subscription);

      let historyPoll: (BundleEntry | r4b.BundleEntry)[] = [];

      switch (request.level) {
        case "system": {
          historyPoll = await client.history_system({}, fhirVersion, [
            {
              name: "_since-version",
              value: [latestVersionIdForSub],
            },
          ]);
          break;
        }
        case "type": {
          historyPoll = await client.history_type(
            {},
            fhirVersion,
            request.resourceType,
            [
              {
                name: "_since-version",
                value: [latestVersionIdForSub],
              },
            ],
          );
          break;
        }
      }
      // Reverse mutates the array in place.
      historyPoll.reverse();

      const resourceTypes = deriveResourceTypeFilter(request);
      // Remove _type as using on derived resourceTypeFilter
      request.parameters = request.parameters.filter((p) => p.name !== "_type");

      const parameters = await parametersWithMetaAssociated(
        async (resourceTypes, name) =>
          await findSearchParameter(
            client,
            ctx,
            fhirVersion,
            resourceTypes,
            name,
          ),
        resourceTypes,
        request.parameters,
      );

      // Standard parameters
      const resourceParameters = parameters.filter(
        (v): v is SearchParameterResource => v.type === "resource",
      );

      if (historyPoll.length > 0) {
        logger.info(`PROCESSING Subscription '${subscription.id}'`);
        if (historyPoll[0].resource === undefined)
          throw new OperationError(
            outcomeError(
              "invalid",
              "history poll returned entry missing resource.",
            ),
          );

        // Do reverse as ordering is the latest update first.
        const payload: Resource<R4, AllResourceTypes>[] = [];

        for (const entry of historyPoll) {
          if (entry.resource === undefined)
            throw new OperationError(
              outcomeError(
                "invalid",
                "history poll returned entry missing resource.",
              ),
            );

          if (
            entry.resource &&
            (await fitsSearchCriteria(
              {
                resolveCanonical: ctx.resolveCanonical,
                resolveTypeToCanonical: ctx.resolveTypeToCanonical,
                resolveRemoteCanonical: createResolverRemoteCanonical(
                  client,
                  {},
                ),
              },
              R4,
              entry.resource,
              resourceParameters,
            ))
          ) {
            payload.push(entry.resource as Resource<R4, AllResourceTypes>);
          }
        }
        await handleSubscriptionPayload(
          client,
          ctx,
          fhirVersion,
          subscription,
          payload,
        );
        await ctx.cache.set(
          ctx,
          `${subscription.id}_latest`,
          await getVersionSequence(
            historyPoll[historyPoll.length - 1].resource as Resource<
              R4,
              AllResourceTypes
            >,
          ),
        );
      }
    } catch (e) {
      logger.error(e);
      Sentry.logError(e);
      let errorDescription = "Subscription failed to process";

      if (isOperationError(e)) {
        errorDescription = e.outcome.issue.map((i) => i.details).join(". ");
      }
      await logAuditEvent(
        client,
        {},
        fhirVersion,
        createAuditEvent(
          ctx.user.payload,
          SERIOUS_FAILURE,
          { reference: `Subscription/${subscription.id}` },
          errorDescription,
        ),
      );

      await client.update(
        {},
        fhirVersion,
        "Subscription",
        subscription.id as id,
        {
          ...subscription,
          status: "error" as code,
        },
      );
    }
  };
}

async function getActiveTenants(pool: pg.Pool): Promise<TenantId[]> {
  const tenants = await db.sql<s.tenants.SQL, s.tenants.Selectable[]>`
    SELECT ${"id"} from ${"tenants"} where ${{ deleted: false }}
  `.run(pool);

  return tenants.map((w) => w.id as TenantId);
}

function getTokenClaims(
  workerID: string,
  tenant: TenantId,
): AccessTokenPayload<s.user_role> {
  const accessTokenPayload = {
    iss: getIssuer(tenant),
    scope: "system/*.*",
    aud: WORKER_APP.id as id,
    sub: WORKER_APP.id as string as Subject,
    [CUSTOM_CLAIMS.RESOURCE_ID]: WORKER_APP.id as id,
    [CUSTOM_CLAIMS.RESOURCE_TYPE]: WORKER_APP.resourceType,
    [CUSTOM_CLAIMS.TENANT]: tenant,
    [CUSTOM_CLAIMS.ROLE]: "admin",
  } as AccessTokenPayload<s.user_role>;

  return accessTokenPayload;
}

async function createWorker(
  workerID = randomUUID(),
  fhirVersion: FHIR_VERSION = R4,
  loopInterval = 500,
) {
  const db = createPGPool();
  const redis = getRedisClient();
  const lock = new RedisLock(redis);
  const cache = new RedisCache(redis);
  const logger = createLogger().child({ worker: workerID });
  const sdArtifacts = createArtifactMemoryDatabase({
    r4: ["StructureDefinition"],
    r4b: ["StructureDefinition"],
  });

  let isRunning = true;

  logger.info(`Worker started with interval '${loopInterval}'`);
  /*eslint no-constant-condition: ["error", { "checkLoops": false }]*/
  while (isRunning) {
    try {
      const activeTenants = await getActiveTenants(db);
      for (const tenant of activeTenants) {
        const payload = getTokenClaims(workerID, tenant);
        const client = createHTTPClient({
          url: new URL(`w/${tenant}`, process.env.API_URL).href,
          getAccessToken: async () => {
            const token = await createToken({
              signingKey: await getSigningKey(
                process.env.AUTH_LOCAL_CERTIFICATION_LOCATION,
                process.env.AUTH_LOCAL_SIGNING_KEY,
              ),
              payload,
            });
            return token;
          },
        });

        const ctx: WorkerServices = {
          resolveCanonical: sdArtifacts.resolveCanonical,
          resolveTypeToCanonical: sdArtifacts.resolveTypeToCanonical,
          db,
          logger,
          cache,
          tenant: tenant,
          user: {
            payload,
          },
        };
        const activeSubscriptionIds = (
          await client.search_type({}, fhirVersion, "Subscription", [
            { name: "status", value: ["active"] },
          ])
        ).resources.map((r) => r.id);
        for (const subscriptionId of activeSubscriptionIds) {
          // Use lock to avoid duplication on sub processing (could have two concurrent subs running in unison otherwise).
          if (!subscriptionId)
            throw new Error("Subscription ID was undefined.");
          try {
            await lock.withLock(
              subscriptionLockKey(tenant, subscriptionId),
              processSubscription(
                workerID,
                ctx,
                fhirVersion,
                client,
                subscriptionId,
              ),
            );
          } catch (e) {
            logger.error(e);
          }
        }
      }
    } catch (e) {
      logger.error(e);
    } finally {
      await new Promise((resolve) => setTimeout(resolve, loopInterval));
    }
  }
  return () => {
    isRunning = false;
  };
}

export default createWorker;
