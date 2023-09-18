import { Operation } from "@iguhealth/operation-execution";
import { FHIRServerCTX } from "../fhirServer.js";
import { Executioner, InvokeRequest } from "./types.js";

export const LocalExecutioner: Executioner = async (
  ctx: FHIRServerCTX,
  request: InvokeRequest
) => {
  throw new Error();
};
