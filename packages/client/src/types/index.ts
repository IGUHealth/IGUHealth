import * as r4 from "./r4.js";
import * as r4b from "./r4b.js";

export * from "./r4.js";
export * from "./r4b.js";

export type FHIRRequest = r4.R4FHIRRequest | r4b.R4BFHIRRequest;
export type FHIRResponse = r4.R4FHIRResponse | r4b.R4BFHIRResponse;
