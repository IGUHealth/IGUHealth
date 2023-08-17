// Backend Processes used for subscriptions and cron jobs.
import dotEnv from "dotenv";
import pg from "pg";

import createServiceCTX from "../ctx/index.js";
import logAuditEvent, { SERIOUS_FAILURE } from "../logging/auditEvents.js";
import { KoaRequestToFHIRRequest } from "../fhirRequest/index.js";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";
import {
  SystemSearchResponse,
  TypeSearchResponse,
} from "@iguhealth/client/lib/types.js";

dotEnv.config();

async function subWorker(loopInterval = 100) {
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
      console.log(`Processing '${workspace}' subscriptions`);
      const activeSubscriptions = await services.client.search_type(
        ctx,
        "Subscription",
        [{ name: "status", value: ["active"] }]
      );
      for (const subscription of activeSubscriptions.resources) {
        try {
          console.log("process:", subscription.criteria);
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

          const getLatestVersionIdForSub = await services.cache.get(
            ctx,
            `${subscription.id}_latest`
          );

          if (getLatestVersionIdForSub) {
            const result = (await services.client.request(ctx, request)) as
              | TypeSearchResponse
              | SystemSearchResponse;

            for (const resource of result.body) {
            }
          }
        } catch (e) {
          console.error(e);
          await logAuditEvent(
            ctx,
            SERIOUS_FAILURE,
            { reference: `Subscription/${subscription.id}` },
            "error processing subscription"
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

subWorker(500);
