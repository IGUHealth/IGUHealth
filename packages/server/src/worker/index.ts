// Backend Processes used for subscriptions and cron jobs.
import dotEnv from "dotenv";
import pg from "pg";
import { FHIRServerCTX } from "../fhirServer";

dotEnv.config();

// export default async function worker(
//   ctx: Pick<FHIRServerCTX, "client" | "lock" | "capabilities" | "resolveSD">
// ) {
//   const client = new pg.Pool({
//     user: process.env["FHIR_DATABASE_USERNAME"],
//     password: process.env["FHIR_DATABASE_PASSWORD"],
//     host: process.env["FHIR_DATABASE_HOST"],
//     database: process.env["FHIR_DATABASE_NAME"],
//     port: parseInt(process.env["FHIR_DATABASE_PORT"] || "5432"),
//   });
//   await client.connect();

//   const result = await executeSearchQuery(client, request, args.ctx);
// }
