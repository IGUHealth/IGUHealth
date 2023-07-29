import { Operation } from "@iguhealth/operation-execution";
import { FHIRServerCTX } from "../fhirServer";
import { Executioner, InvokeRequest } from "./types";

export const LocalExecutioner: Executioner = async (
  ctx: FHIRServerCTX,
  request: InvokeRequest
) => {
  throw new Error();
};
