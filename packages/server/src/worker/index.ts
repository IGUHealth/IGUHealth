// Backend Processes used for subscriptions and cron jobs.
import dotEnv from "dotenv";
import pg from "pg";

import createServiceCTX from "../ctx/index.js";
import logAuditEvent, { SERIOUS_FAILURE } from "../logging/auditEvents.js";
import { KoaRequestToFHIRRequest } from "../fhirRequest/index.js";

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
      console.log(`Processing '${workspace}' subscriptions`);
      const activeSubscriptions = await services.client.search_type(
        { ...services, workspace, author: "system" },
        "Subscription",
        [{ name: "status", value: ["active"] }]
      );
      for (const subscription of activeSubscriptions.resources) {
        try {
          console.log("process:", subscription.criteria);
          const request = KoaRequestToFHIRRequest(subscription.criteria, {
            method: "GET",
          });
          const result = await services.client.request(
            { ...services, workspace, author: "system" },
            request
          );
          console.log(result);
        } catch (e) {
          await logAuditEvent(
            { ...services, workspace, author: "system" },
            SERIOUS_FAILURE,
            { reference: `Subscription/${subscription.id}` },
            "error processing subscription"
          );
          await services.client.update(
            { ...services, workspace, author: "system" },
            { ...subscription, status: "error" }
          );
        }
      }
    }
    await new Promise((resolve) => setTimeout(resolve, loopInterval));
  }
}

subWorker(500);
