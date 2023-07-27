import { Operation } from "@iguhealth/operation-execution";

import { FHIRServerCTX } from "../fhirServer";
import { Executioner } from "./types";

export const LocalExecutioner: Executioner = async (
  ctx: FHIRServerCTX,
  request
) => {};
