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

import { resolveOperationDefinition } from "../operation-executors/utilities.js";
import { deriveCTX, logger } from "../ctx/index.js";
import logAuditEvent, {
  MAJOR_FAILURE,
  SERIOUS_FAILURE,
} from "../logging/auditEvents.js";
import { KoaRequestToFHIRRequest } from "../koaParsing/index.js";
import { FHIRServerCTX } from "../fhirServer.js";
import { Operation } from "@iguhealth/operation-execution";
import {
  SearchParameterResource,
  deriveResourceTypeFilter,
  parametersWithMetaAssociated,
  findSearchParameter,
} from "../resourceProviders/utilities/search/parameters.js";
import { fitsSearchCriteria } from "../resourceProviders/memory/search.js";

dotEnv.config();

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

      const output = await ctx.client.invoke_system(
        new Operation(operationDefinition),
        ctx,
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
    const activeWorkspaces = (
      await pool.query("SELECT id from workspaces where deleted = $1", [false])
    ).rows.map((row) => row.id);

    for (const workspace of activeWorkspaces) {
      const client = await pool.connect();
      try {
        const services = getCTX({ pg: client, workspace, author: "system" });
        const ctx = { ...services, workspace, author: "system" };
        const activeSubscriptions = await services.client.search_type(
          ctx,
          "Subscription",
          [{ name: "status", value: ["active"] }]
        );
        for (const subscription of activeSubscriptions.resources) {
          // Use lock to avoid duplication on sub processing (could have two concurrent subs running in unison otherwise).
          await ctx.lock.withLock(
            subscriptionLockKey(workspace, subscription.id as string),
            async () => {
              const logger = services.logger.child({
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

                const sortParameter = request.parameters.find(
                  (p) => p.name === "_sort"
                );

                if (sortParameter) {
                  throw new OperationError(
                    outcomeError(
                      "invalid",
                      `Criteria cannot include _sort. Sorting must be based order resource was updated.`
                    )
                  );
                }

                const cachedSubID = await services.cache.get(
                  ctx,
                  `${subscription.id}_latest`
                );

                const latestVersionIdForSub = cachedSubID
                  ? cachedSubID
                  : // If latest isn't there then use the subscription version when created.
                    getVersionSequence(subscription);

                let historyPoll: BundleEntry[] = [];

                switch (request.level) {
                  case "system": {
                    historyPoll = await services.client.historySystem(ctx, [
                      {
                        name: "_since-version",
                        value: [latestVersionIdForSub],
                      },
                    ]);
                    break;
                  }
                  case "type": {
                    historyPoll = await services.client.historyType(
                      ctx,
                      request.resourceType as ResourceType,
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

                const resourceTypes = deriveResourceTypeFilter(request);
                // Remove _type as using on derived resourceTypeFilter
                request.parameters = request.parameters.filter(
                  (p) => p.name !== "_type"
                );

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
                  logger.info(`PROCESSING Subscription '${subscription.id}'`);
                  if (historyPoll[0].resource === undefined)
                    throw new OperationError(
                      outcomeError(
                        "invalid",
                        "history poll returned entry missing resource."
                      )
                    );
                  for (const entry of historyPoll) {
                    if (entry.resource === undefined)
                      throw new OperationError(
                        outcomeError(
                          "invalid",
                          "history poll returned entry missing resource."
                        )
                      );

                    if (
                      await fitsSearchCriteria(
                        entry.resource,
                        resourceParameters
                      )
                    ) {
                      await handleSubscriptionPayload(ctx, subscription, [
                        entry.resource,
                      ]);
                    }
                  }
                  await services.cache.set(
                    ctx,
                    `${subscription.id}_latest`,
                    getVersionSequence(historyPoll[0].resource)
                  );
                }
              } catch (e) {
                logger.error(e);

                let errorDescription = "Subscription failed to process";

                if (isOperationError(e)) {
                  errorDescription = e.outcome.issue
                    .map((i) => i.details)
                    .join(". ");
                }
                await logAuditEvent(
                  ctx,
                  SERIOUS_FAILURE,
                  { reference: `Subscription/${subscription.id}` },
                  errorDescription
                );

                await services.client.update(ctx, {
                  ...subscription,
                  status: "error",
                });
              }
            }
          );
        }
      } finally {
        client.release();
      }
      await new Promise((resolve) => setTimeout(resolve, loopInterval));
    }
  }

  return () => {
    isRunning = false;
  };
}

export default createWorker;
