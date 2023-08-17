// Backend Processes used for subscriptions and cron jobs.
import dotEnv from "dotenv";
import pg from "pg";

import { Resource } from "@iguhealth/fhir-types";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";
import {
  SystemSearchResponse,
  TypeSearchResponse,
} from "@iguhealth/client/lib/types.js";
import { evaluate } from "@iguhealth/fhirpath";

import createServiceCTX from "../ctx/index.js";
import logAuditEvent, { SERIOUS_FAILURE } from "../logging/auditEvents.js";
import { KoaRequestToFHIRRequest } from "../fhirRequest/index.js";
import { strictEqual } from "assert";
import { randomUUID } from "crypto";

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

async function subWorker(workerID = randomUUID(), loopInterval = 500) {
  // Using a pool directly because need to query up workspaces.
  const services = createServiceCTX();

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
        try {
          console.log(
            `'${workerID}' workspace: '${ctx.workspace}' checking criteria: '${subscription.criteria}'`
          );
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

          if (result.body[0]) {
            await services.cache.set(
              ctx,
              `${subscription.id}_latest`,
              getVersionSequence(result.body[0])
            );
          }

          for (const resource of result.body.reverse()) {
            console.log(
              `'${workerID}' workspace: '${ctx.workspace}' subscription: '${subscription.id}', versionID: '${resource.meta?.versionId}'`
            );
          }
        } catch (e) {
          console.error(e);
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
    }
    await new Promise((resolve) => setTimeout(resolve, loopInterval));
  }
}

subWorker();
