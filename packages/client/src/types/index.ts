import { R4FHIRRequest, R4FHIRResponse } from "./r4.js";
import { R4BFHIRRequest, R4BFHIRResponse } from "./r4b.js";

export * from "./r4.js";
export * from "./r4b.js";

export type FHIRRequest = R4FHIRRequest | R4BFHIRRequest;
export type FHIRResponse = R4FHIRResponse | R4BFHIRResponse;
