import {
  InvokeInstanceRequest,
  InvokeSystemRequest,
  InvokeTypeRequest,
} from "../client/types";
import { FHIRServerCTX } from "../fhirServer";

export type InvokeRequest =
  | InvokeSystemRequest
  | InvokeTypeRequest
  | InvokeInstanceRequest;

export type Executioner = <CTX extends FHIRServerCTX>(
  ctx: CTX,
  request: InvokeRequest
) => Promise<InvokeResponse>;
