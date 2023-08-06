// Backend Processes used for subscriptions and cron jobs.

import { FHIRServerCTX } from "../fhirServer";

export default async function worker(
  ctx: Pick<FHIRServerCTX, "client" | "lock" | "capabilities" | "resolveSD">
) {}
