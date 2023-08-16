// Backend Processes used for subscriptions and cron jobs.
import dotEnv from "dotenv";
import pg from "pg";
import { FHIRServerCTX } from "../fhirServer";

dotEnv.config();

function executeTick() {
    
}

export default async function createWorker(loopInterval = 100) {
  const client = new pg.Pool({
    user: process.env["FHIR_DATABASE_USERNAME"],
    password: process.env["FHIR_DATABASE_PASSWORD"],
    host: process.env["FHIR_DATABASE_HOST"],
    database: process.env["FHIR_DATABASE_NAME"],
    port: parseInt(process.env["FHIR_DATABASE_PORT"] || "5432"),
  });

  await client.connect();

  while (true) {
    await executeTick();
    await new Promise((resolve) => setTimeout(resolve, loopInterval));
  }
}
