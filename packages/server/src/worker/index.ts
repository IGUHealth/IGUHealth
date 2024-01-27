// Backend Processes used for subscriptions and cron jobs.
import { randomUUID } from "crypto";
import dotEnv from "dotenv";
import pg from "pg";
import * as db from "zapatos/db";
import * as s from "zapatos/schema";

import { AsynchronousClient } from "@iguhealth/client";
import {
  BundleEntry,
  Resource,
  Subscription,
  code,
  id,
} from "@iguhealth/fhir-types/r4/types";
import { evaluate } from "@iguhealth/fhirpath";
import { Operation } from "@iguhealth/operation-execution";
import {
  OperationError,
  isOperationError,
  outcomeError,
} from "@iguhealth/operation-outcomes";

import {
  createCertsIfNoneExists,
  getSigningKey,
} from "../authN/certifications.js";
import { IGUHEALTH_ISSUER, createToken } from "../authN/token.js";
import { FHIRServerCTX, JWT, TenantClaim, TenantId } from "../fhir/context.js";
import { createFHIRAPI, createFHIRServices } from "../fhir/index.js";
import { SUPER_ADMIN } from "../fhir/roles.js";
import { httpRequestToFHIRRequest } from "../http/index.js";
import logAuditEvent, {
  MAJOR_FAILURE,
  SERIOUS_FAILURE,
} from "../logging/auditEvents.js";
import * as Sentry from "../monitoring/sentry.js";
import { resolveOperationDefinition } from "../operation-executors/utilities.js";
import { fitsSearchCriteria } from "../resourceProviders/memory/search.js";
import { createResolverRemoteCanonical } from "../resourceProviders/utilities/canonical.js";
import {
  SearchParameterResource,
  deriveResourceTypeFilter,
  findSearchParameter,
  parametersWithMetaAssociated,
} from "../resourceProviders/utilities/search/parameters.js";
import { LIB_VERSION } from "../version.js";

dotEnv.config();

if (
  process.env.AUTH_LOCAL_SIGNING_KEY &&
  process.env.AUTH_LOCAL_CERTIFICATION_LOCATION &&
  process.env.NODE_ENV === "development"
) {
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

function getVersionSequence(resource: Resource): number {
  const evaluation = evaluate(
    "$this.meta.extension.where(url=%sequenceUrl).value",
    resource,
    {
      variables: {
        sequenceUrl: "https://iguhealth.app/version-sequence",
      },
    },
  )[0];

  if (typeof evaluation !== "number") {
    throw new Error("No version sequence found.");
  }

  return evaluation;
}

async function handleSubscriptionPayload(
  server: AsynchronousClient<unknown, FHIRServerCTX>,
  ctx: FHIRServerCTX,
  subscription: Subscription,
  payload: Resource[],
): Promise<void> {
  const channelType = evaluate(
    "$this.channel.type | $this.channel.type.extension.where(url=%typeUrl).value",
    subscription,
    {
      variables: {
        typeUrl: "https://iguhealth.app/Subscription/channel-type",
      },
    },
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
            headers: { ...headers, "Content-Type": "application/json" },
            body: JSON.stringify(resource),
          }),
        ),
      );
      return;
    }
    case "operation": {
      const OPERATION_URL = "https://iguhealth.app/Subscription/operation-code";
      const operation = evaluate(
        "$this.channel.type.extension.where(url=%operationUrl).value",
        subscription,
        {
          variables: {
            operationUrl: OPERATION_URL,
          },
        },
      )[0];
      if (typeof operation !== "string") {
        logAuditEvent(
          server,
          ctx,
          MAJOR_FAILURE,
          { reference: `Subscription/${subscription.id}` },
          `No Operation was specified, specifiy via extension '${OPERATION_URL}' with valueCode of operation code.`,
        );
        throw new OperationError(
          outcomeError("invalid", "Subscription contained invalid operation"),
        );
      }
      const operationDefinition = await resolveOperationDefinition(
        server,
        ctx,
        operation,
      );

      if (
        !process.env.AUTH_LOCAL_CERTIFICATION_LOCATION ||
        !process.env.AUTH_LOCAL_SIGNING_KEY ||
        !process.env.AUTH_JWT_AUDIENCE
      ) {
        throw new Error("Missing environment variables for JWT creation.");
      }

      const user_access_token = await createToken(
        await getSigningKey(
          process.env.AUTH_LOCAL_CERTIFICATION_LOCATION,
          process.env.AUTH_LOCAL_SIGNING_KEY,
        ),
        {
          header: { audience: process.env.AUTH_JWT_AUDIENCE },
          payload: {
            "https://iguhealth.app/tenants": [
              {
                id: ctx.tenant,
                userRole: "SUPER_ADMIN",
              } as TenantClaim,
            ],
            "https://iguhealth.app/resourceType": "OperationDefinition",
            sub: operationDefinition.id,
            aud: ["https://iguhealth.com/api"],
            scope: "openid profile email offline_access",
          },
        },
      );

      await server.invoke_system(
        new Operation(operationDefinition),
        { ...ctx, user: { ...ctx.user, accessToken: user_access_token } },
        {
          payload,
        },
      );

      return;
    }
    default:
      throw new OperationError(
        outcomeError(
          `not-supported`,
          `'${channelType}' is not supported for subscription.`,
        ),
      );
  }
}

// Returns key for subscription lock.
function subscriptionLockKey(tenant: string, subscriptionId: string) {
  return `${tenant}:${subscriptionId}`;
}

function processSubscription(
  workerID: string,
  ctx: FHIRServerCTX,
  server: AsynchronousClient<unknown, FHIRServerCTX>,

  subscriptionId: id,
) {
  return async () => {
    // Reread here in event that concurrent process has altered the id.
    const subscription = await server.read(ctx, "Subscription", subscriptionId);
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
      const request = httpRequestToFHIRRequest({
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
          getVersionSequence(subscription);

      let historyPoll: BundleEntry[] = [];

      switch (request.level) {
        case "system": {
          historyPoll = await server.historySystem(ctx, [
            {
              name: "_since-version",
              value: [latestVersionIdForSub],
            },
          ]);
          break;
        }
        case "type": {
          historyPoll = await server.historyType(ctx, request.resourceType, [
            {
              name: "_since-version",
              value: [latestVersionIdForSub],
            },
          ]);
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
          await findSearchParameter(server, ctx, resourceTypes, name),
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
        const payload: Resource[] = [];

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
                ...ctx,
                resolveRemoteCanonical: createResolverRemoteCanonical(ctx),
              },
              entry.resource,
              resourceParameters,
            ))
          ) {
            payload.push(entry.resource);
          }
        }
        await handleSubscriptionPayload(server, ctx, subscription, payload);
        await ctx.cache.set(
          ctx,
          `${subscription.id}_latest`,
          getVersionSequence(
            historyPoll[historyPoll.length - 1].resource as Resource,
          ),
        );
      }
    } catch (e) {
      logger.error(e);
      Sentry.logError(e, ctx);
      let errorDescription = "Subscription failed to process";

      if (isOperationError(e)) {
        errorDescription = e.outcome.issue.map((i) => i.details).join(". ");
      }
      await logAuditEvent(
        server,
        ctx,
        SERIOUS_FAILURE,
        { reference: `Subscription/${subscription.id}` },
        errorDescription,
      );

      await server.update(ctx, "Subscription", subscription.id as id, {
        ...subscription,
        status: "error" as code,
      });
    }
  };
}

async function getActiveTenants(pool: pg.Pool): Promise<TenantId[]> {
  const tenants = await db.sql<s.tenants.SQL, s.tenants.Selectable[]>`
    SELECT ${"id"} from ${"tenants"} where ${{ deleted: false }}
  `.run(pool);

  return tenants.map((w) => w.id as TenantId);
}

async function createWorker(workerID = randomUUID(), loopInterval = 500) {
  // Using a pool directly because need to query up tenants.
  const pool = new pg.Pool({
    user: process.env["FHIR_DATABASE_USERNAME"],
    password: process.env["FHIR_DATABASE_PASSWORD"],
    host: process.env["FHIR_DATABASE_HOST"],
    database: process.env["FHIR_DATABASE_NAME"],
    port: parseInt(process.env["FHIR_DATABASE_PORT"] || "5432"),
  });

  const fhirServices = await createFHIRServices(pool);
  const fhirServer = await createFHIRAPI();
  let isRunning = true;

  fhirServices.logger.info(
    { workerID },
    `Worker started with interval '${loopInterval}'`,
  );
  /*eslint no-constant-condition: ["error", { "checkLoops": false }]*/
  while (isRunning) {
    try {
      const activeTenants = await getActiveTenants(pool);
      for (const tenant of activeTenants) {
        const ctx = {
          ...fhirServices,
          tenant: tenant,
          user: {
            role: "SUPER_ADMIN" as SUPER_ADMIN,
            jwt: {
              iss: IGUHEALTH_ISSUER,
              sub: `system-worker-${workerID}`,
              "https://iguhealth.app/resourceType": "User",
            } as JWT,
          },
        };
        const activeSubscriptionIds = (
          await fhirServer.search_type(ctx, "Subscription", [
            { name: "status", value: ["active"] },
          ])
        ).resources.map((r) => r.id);
        for (const subscriptionId of activeSubscriptionIds) {
          // Use lock to avoid duplication on sub processing (could have two concurrent subs running in unison otherwise).
          if (!subscriptionId)
            throw new Error("Subscription ID was undefined.");
          try {
            await fhirServices.lock.withLock(
              subscriptionLockKey(tenant, subscriptionId),
              processSubscription(workerID, ctx, fhirServer, subscriptionId),
            );
          } catch (e) {
            fhirServices.logger.error(e);
          }
        }
      }
    } catch (e) {
      fhirServices.logger.error(e);
    } finally {
      await new Promise((resolve) => setTimeout(resolve, loopInterval));
    }
  }
  return () => {
    isRunning = false;
  };
}

export default createWorker;
