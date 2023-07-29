import {
  InvokeInstanceRequest,
  InvokeInstanceResponse,
  InvokeSystemRequest,
  InvokeSystemResponse,
  InvokeTypeRequest,
  InvokeTypeResponse,
} from "../client/types";
import { FHIRServerCTX } from "../fhirServer";

export type InvokeRequest =
  | InvokeSystemRequest
  | InvokeTypeRequest
  | InvokeInstanceRequest;

export type InvokeResponse =
  | InvokeSystemResponse
  | InvokeTypeResponse
  | InvokeInstanceResponse;

export type Executioner = <CTX extends FHIRServerCTX>(
  ctx: CTX,
  request: InvokeRequest
) => Promise<InvokeResponse>;
