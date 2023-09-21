// Backend Processes used for subscriptions and cron jobs.
import dotEnv from "dotenv";
import pg from "pg";
import { randomUUID } from "crypto";

import { Resource, Subscription } from "@iguhealth/fhir-types/r4/types";
import {
  OperationError,
  isOperationError,
  outcomeError,
} from "@iguhealth/operation-outcomes";
import type {
  SystemSearchResponse,
  TypeSearchResponse,
} from "@iguhealth/client/types";
import { evaluate } from "@iguhealth/fhirpath";

import { resolveOperationDefinition } from "../operation-executors/utilities.js";
import createServiceCTX from "../ctx/index.js";
import logAuditEvent, {
  MAJOR_FAILURE,
  SERIOUS_FAILURE,
} from "../logging/auditEvents.js";
import { KoaRequestToFHIRRequest } from "../koaParsing/index.js";
import { FHIRServerCTX } from "../fhirServer.js";
import { Operation } from "@iguhealth/operation-execution";

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

async function subWorker(workerID = randomUUID(), loopInterval = 500) {
  // Using a pool directly because need to query up workspaces.
  const services = await createServiceCTX();

  const pool = new pg.Pool({
    user: process.env["FHIR_DATABASE_USERNAME"],
    password: process.env["FHIR_DATABASE_PASSWORD"],
    host: process.env["FHIR_DATABASE_HOST"],
    database: process.env["FHIR_DATABASE_NAME"],
    port: parseInt(process.env["FHIR_DATABASE_PORT"] || "5432"),
  });
  pool.connect();
  while (true) {
    const activeWorkspaces = (
      await pool.query("SELECT id from workspaces where deleted = $1", [false])
    ).rows.map((row) => row.id);

    for (const workspace of activeWorkspaces) {
      const ctx = { ...services, workspace, author: "system" };
      const activeSubscriptions = await services.client.search_type(
        ctx,
        "Subscription",
        [{ name: "status", value: ["active"] }]
      );
      for (const subscription of activeSubscriptions.resources) {
        await ctx.lock.withLock(
          `${ctx.workspace}:${subscription.id}`,
          async () => {
            ctx.logger.info(
              `worker '${workerID}' has lock '${ctx.workspace}:${subscription.id}'`
            );
            try {
              ctx.logger.info({
                worker: workerID,
                workspace: ctx.workspace,
                criteria: subscription.criteria,
              });
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

              request.parameters = request.parameters.concat([
                { name: "_sort", value: ["_iguhealth-version-seq"] },
              ]);

              let getLatestVersionIdForSub = await services.cache.get(
                ctx,
                `${subscription.id}_latest`
              );

              getLatestVersionIdForSub = getLatestVersionIdForSub
                ? getLatestVersionIdForSub
                : // If latest isn't there then use the subscription version when created.
                  getVersionSequence(subscription);

              request.parameters = request.parameters.concat([
                {
                  name: "_iguhealth-version-seq",
                  value: [`gt${getLatestVersionIdForSub}`],
                },
              ]);

              const result = (await services.client.request(ctx, request)) as
                | TypeSearchResponse
                | SystemSearchResponse;

              if (result.body.length !== 0) {
                await services.cache.set(
                  ctx,
                  `${subscription.id}_latest`,
                  getVersionSequence(result.body[result.body.length - 1])
                );
                await handleSubscriptionPayload(ctx, subscription, result.body);
              }
            } catch (e) {
              ctx.logger.error(e);
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
                "Subscription failed to process"
              );
              await services.client.update(ctx, {
                ...subscription,
                status: "error",
              });
            }
          }
        );
      }
    }
    await new Promise((resolve) => setTimeout(resolve, loopInterval));
  }
}

subWorker();
