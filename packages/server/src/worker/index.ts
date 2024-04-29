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
import * as r4b from "@iguhealth/fhir-types/r4b/types";
import { FHIR_VERSION, R4 } from "@iguhealth/fhir-types/versions";
import { evaluate } from "@iguhealth/fhirpath";
import {
  AccessTokenPayload,
  CUSTOM_CLAIMS,
  IGUHEALTH_ISSUER,
  Subject,
  TenantId,
  createToken,
} from "@iguhealth/jwt";
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
import { createFHIRAPI, createFHIRServices } from "../fhir-api/index.js";
import { FHIRServerCTX } from "../fhir-api/types.js";
import { httpRequestToFHIRRequest } from "../fhir-http/index.js";
import logAuditEvent, {
  MAJOR_FAILURE,
  SERIOUS_FAILURE,
} from "../fhir-logging/auditEvents.js";
import { resolveOperationDefinition } from "../fhir-operation-executors/utilities.js";
import { fitsSearchCriteria } from "../fhir-storage/providers/memory/search.js";
import { createResolverRemoteCanonical } from "../fhir-storage/utilities/canonical.js";
import {
  SearchParameterResource,
  deriveResourceTypeFilter,
  findSearchParameter,
  parametersWithMetaAssociated,
} from "../fhir-storage/utilities/search/parameters.js";
import * as Sentry from "../monitoring/sentry.js";
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
  fhirVersion: R4,
  subscription: Subscription,
  payload: (Resource | r4b.Resource)[],
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
          fhirVersion,
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
        fhirVersion,
        operation,
      );

      if (
        !process.env.AUTH_LOCAL_CERTIFICATION_LOCATION ||
        !process.env.AUTH_LOCAL_SIGNING_KEY
      ) {
        throw new Error("Missing environment variables for JWT creation.");
      }
      const signingKey = await getSigningKey(
        process.env.AUTH_LOCAL_CERTIFICATION_LOCATION,
        process.env.AUTH_LOCAL_SIGNING_KEY,
      );

      const user_access_token = await createToken<
        AccessTokenPayload<s.user_role>
      >(signingKey, {
        iss: IGUHEALTH_ISSUER,
        [CUSTOM_CLAIMS.TENANTS]: [
          {
            id: ctx.tenant,
            userRole: "admin",
          },
        ],
        [CUSTOM_CLAIMS.RESOURCE_TYPE]: "OperationDefinition",
        sub: operationDefinition.id as unknown as Subject,
        scope: "openid profile email offline_access",
      });

      await server.invoke_system(
        new Operation(operationDefinition),
        { ...ctx, user: { ...ctx.user, accessToken: user_access_token } },
        fhirVersion,
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
  fhirVersion: FHIR_VERSION,
  server: AsynchronousClient<unknown, FHIRServerCTX>,

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
    const subscription = await server.read(
      ctx,
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
          getVersionSequence(subscription);

      let historyPoll: (BundleEntry | r4b.BundleEntry)[] = [];

      switch (request.level) {
        case "system": {
          historyPoll = await server.historySystem(ctx, fhirVersion, [
            {
              name: "_since-version",
              value: [latestVersionIdForSub],
            },
          ]);
          break;
        }
        case "type": {
          historyPoll = await server.historyType(
            ctx,
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
            server,
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
        const payload: (Resource | r4b.Resource)[] = [];

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
              R4,
              entry.resource as Resource,
              resourceParameters,
            ))
          ) {
            payload.push(entry.resource);
          }
        }
        await handleSubscriptionPayload(
          server,
          ctx,
          fhirVersion,
          subscription,
          payload,
        );
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
        fhirVersion,
        SERIOUS_FAILURE,
        { reference: `Subscription/${subscription.id}` },
        errorDescription,
      );

      await server.update(
        ctx,
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

async function createWorker(
  workerID = randomUUID(),
  fhirVersion: FHIR_VERSION = R4,
  loopInterval = 500,
) {
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
            role: "admin" as s.user_role,
            jwt: {
              iss: IGUHEALTH_ISSUER,
              sub: `system-worker-${workerID}`,
              [CUSTOM_CLAIMS.RESOURCE_TYPE]: "Membership",
            } as AccessTokenPayload<s.user_role>,
          },
        };
        const activeSubscriptionIds = (
          await fhirServer.search_type(ctx, fhirVersion, "Subscription", [
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
              processSubscription(
                workerID,
                ctx,
                fhirVersion,
                fhirServer,
                subscriptionId,
              ),
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
