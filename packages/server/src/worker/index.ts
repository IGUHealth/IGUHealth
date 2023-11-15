// Backend Processes used for subscriptions and cron jobs.
import dotEnv from "dotenv";
import pg from "pg";
import { randomUUID } from "crypto";

import {
  ResourceType,
  Resource,
  Subscription,
  BundleEntry,
} from "@iguhealth/fhir-types/r4/types";
import {
  OperationError,
  isOperationError,
  outcomeError,
} from "@iguhealth/operation-outcomes";
import { evaluate } from "@iguhealth/fhirpath";
import { Operation } from "@iguhealth/operation-execution";

import * as Sentry from "../monitoring/sentry.js";
import { LIB_VERSION } from "../version.js";
import { resolveOperationDefinition } from "../operation-executors/utilities.js";
import { deriveCTX, logger } from "../ctx/index.js";
import logAuditEvent, {
  MAJOR_FAILURE,
  SERIOUS_FAILURE,
} from "../logging/auditEvents.js";
import { KoaRequestToFHIRRequest } from "../koaParsing/index.js";
import { FHIRServerCTX } from "../ctx/types.js";
import {
  SearchParameterResource,
  deriveResourceTypeFilter,
  parametersWithMetaAssociated,
  findSearchParameter,
} from "../resourceProviders/utilities/search/parameters.js";
import { fitsSearchCriteria } from "../resourceProviders/memory/search.js";
import { createToken } from "../auth/token.js";
import {
  createCertsIfNoneExists,
  getSigningKey,
} from "../auth/certifications.js";

dotEnv.config();

if (
  process.env.AUTH_SIGNING_KEY &&
  process.env.AUTH_CERTIFICATION_LOCATION &&
  process.env.NODE_ENV === "development"
) {
  await createCertsIfNoneExists(
    process.env.AUTH_CERTIFICATION_LOCATION,
    process.env.AUTH_SIGNING_KEY
  );
}

if (process.env.SENTRY_WORKER_DSN)
  Sentry.enableSentry(process.env.SENTRY_WORKER_DSN, LIB_VERSION, {
    tracesSampleRate: parseFloat(
      process.env.SENTRY_TRACES_SAMPLE_RATE || "0.1"
    ),
    profilesSampleRate: parseFloat(
      process.env.SENTRY_PROFILES_SAMPLE_RATE || "0.1"
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
    }
  )[0];

  if (typeof evaluation !== "number") {
    throw new Error("No version sequence found.");
  }

  return evaluation;
}

async function handleSubscriptionPayload(
  ctx: FHIRServerCTX,
  subscription: Subscription,
  payload: Resource[]
): Promise<void> {
  const channelType = evaluate(
    "$this.channel.type | $this.channel.type.extension.where(url=%typeUrl).value",
    subscription,
    {
      variables: {
        typeUrl: "https://iguhealth.app/Subscription/channel-type",
      },
    }
  )[0];

  switch (channelType) {
    case "rest-hook": {
      if (!subscription.channel.endpoint) {
        throw new OperationError(
          outcomeError("invalid", `Subscription channel is missing endpoint.`)
        );
      }

      await Promise.all(
        payload.map((resource) =>
          fetch(subscription.channel.endpoint as string, {
            method: "POST",
            // headers: subscription.channel.header,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(resource),
          })
        )
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
        }
      )[0];
      if (typeof operation !== "string") {
        logAuditEvent(
          ctx,
          MAJOR_FAILURE,
          { reference: `Subscription/${subscription.id}` },
          `No Operation was specified, specifiy via extension '${OPERATION_URL}' with valueCode of operation code.`
        );
        throw new OperationError(
          outcomeError("invalid", "Subscription contained invalid operation")
        );
      }
      const operationDefinition = await resolveOperationDefinition(
        ctx,
        operation
      );

      const user_access_token =
        process.env.AUTH_CERTIFICATION_LOCATION &&
        process.env.AUTH_SIGNING_KEY &&
        process.env.AUTH_JWT_AUDIENCE
          ? await createToken(
              await getSigningKey(
                process.env.AUTH_CERTIFICATION_LOCATION,
                process.env.AUTH_SIGNING_KEY
              ),
              {
                header: { audience: process.env.AUTH_JWT_AUDIENCE },
                payload: {
                  "https://iguhealth.app/workspaces": [ctx.workspace],
                  sub: `OperationDefinition/${operationDefinition.id}`,
                  aud: ["https://iguhealth.com/api"],
                  scope: "openid profile email offline_access",
                },
              }
            )
          : undefined;

      const output = await ctx.client.invoke_system(
        new Operation(operationDefinition),
        { ...ctx, user_access_token },
        {
          payload,
        }
      );
      return;
    }
    default:
      throw new OperationError(
        outcomeError(
          `not-supported`,
          `'${channelType}' is not supported for subscription.`
        )
      );
  }
}

// Returns key for subscription lock.
function subscriptionLockKey(workspace: string, subscriptionId: string) {
  return `${workspace}:${subscriptionId}`;
}

function processSubscription(
  workerID: string,
  ctx: FHIRServerCTX,
  subscription: Subscription
) {
  return async () => {
    const logger = ctx.logger.child({
      worker: workerID,
      workspace: ctx.workspace,
      criteria: subscription.criteria,
    });

    try {
      const request = KoaRequestToFHIRRequest(subscription.criteria, {
        method: "GET",
      });
      if (request.type !== "search-request") {
        throw new OperationError(
          outcomeError(
            "invalid",
            `Criteria must be a search request but found ${request.type}`
          )
        );
      }

      const sortParameter = request.parameters.find((p) => p.name === "_sort");

      if (sortParameter) {
        throw new OperationError(
          outcomeError(
            "invalid",
            `Criteria cannot include _sort. Sorting must be based order resource was updated.`
          )
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
          historyPoll = await ctx.client.historySystem(ctx, [
            {
              name: "_since-version",
              value: [latestVersionIdForSub],
            },
          ]);
          break;
        }
        case "type": {
          historyPoll = await ctx.client.historyType(
            ctx,
            request.resourceType,
            [
              {
                name: "_since-version",
                value: [latestVersionIdForSub],
              },
            ]
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
        resourceTypes,
        request.parameters,
        async (resourceTypes, name) =>
          (
            await findSearchParameter(ctx, resourceTypes, name)
          ).resources
      );

      // Standard parameters
      const resourceParameters = parameters.filter(
        (v): v is SearchParameterResource => v.type === "resource"
      );

      if (historyPoll.length > 0) {
        await Sentry.sentryTransaction(
          process.env.SENTRY_WORKER_DSN,
          {
            name: `${ctx.workspace}-processing-sub`,
            op: "iguhealth.worker",
          },
          async (transaction) => {
            logger.info(`PROCESSING Subscription '${subscription.id}'`);
            if (historyPoll[0].resource === undefined)
              throw new OperationError(
                outcomeError(
                  "invalid",
                  "history poll returned entry missing resource."
                )
              );

            // Do reverse as ordering is the latest update first.
            const payload: Resource[] = [];

            for (const entry of historyPoll) {
              if (entry.resource === undefined)
                throw new OperationError(
                  outcomeError(
                    "invalid",
                    "history poll returned entry missing resource."
                  )
                );
              await Sentry.sentrySpan(
                transaction,
                {
                  op: `iguhealth.worker.checkingCriteria`,
                  name: `${ctx.workspace}-processing-sub-checking-criteria`,
                  description:
                    "Checking if history poll fits subscription criteria",
                },
                async (_span) => {
                  if (
                    entry.resource &&
                    (await fitsSearchCriteria(
                      ctx,
                      entry.resource,
                      resourceParameters
                    ))
                  ) {
                    payload.push(entry.resource);
                  }
                }
              );
            }

            await Sentry.sentrySpan(
              transaction,
              {
                op: `iguhealth.worker.handlingPayload`,
                name: `${ctx.workspace}-processing-sub-handling-payload`,
                description:
                  "Checking if history poll fits subscription criteria",
              },
              async (_span) => {
                await handleSubscriptionPayload(ctx, subscription, payload);
              }
            );

            await ctx.cache.set(
              ctx,
              `${subscription.id}_latest`,
              getVersionSequence(
                historyPoll[historyPoll.length - 1].resource as Resource
              )
            );
          }
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
        ctx,
        SERIOUS_FAILURE,
        { reference: `Subscription/${subscription.id}` },
        errorDescription
      );

      await ctx.client.update(ctx, {
        ...subscription,
        status: "error",
      });
    }
  };
}

async function createWorker(workerID = randomUUID(), loopInterval = 500) {
  logger.info({ workerID }, `Worker started with interval '${loopInterval}'`);

  // Using a pool directly because need to query up workspaces.
  const getCTX = await deriveCTX();

  const pool = new pg.Pool({
    user: process.env["FHIR_DATABASE_USERNAME"],
    password: process.env["FHIR_DATABASE_PASSWORD"],
    host: process.env["FHIR_DATABASE_HOST"],
    database: process.env["FHIR_DATABASE_NAME"],
    port: parseInt(process.env["FHIR_DATABASE_PORT"] || "5432"),
  });

  pool.connect();

  let isRunning = true;

  /*eslint no-constant-condition: ["error", { "checkLoops": false }]*/
  while (isRunning) {
    try {
      const activeWorkspaces = (
        await pool.query("SELECT id from workspaces where deleted = $1", [
          false,
        ])
      ).rows.map((row) => row.id);

      for (const workspace of activeWorkspaces) {
        const client = await pool.connect();
        try {
          const services = getCTX({
            pg: client,
            workspace,
            author: "system",
          });
          const ctx = { ...services, workspace, author: "system" };
          const activeSubscriptions = await services.client.search_type(
            ctx,
            "Subscription",
            [{ name: "status", value: ["active"] }]
          );
          for (const subscription of activeSubscriptions.resources) {
            // Use lock to avoid duplication on sub processing (could have two concurrent subs running in unison otherwise).
            try {
              await ctx.lock.withLock(
                subscriptionLockKey(workspace, subscription.id as string),
                processSubscription(workerID, ctx, subscription)
              );
            } catch (e) {
              ctx.logger.error(e);
            }
          }
        } finally {
          client.release();
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
