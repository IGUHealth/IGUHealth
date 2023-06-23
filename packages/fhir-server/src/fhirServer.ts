import CreateChain from "./chain";
import { FHIRRequest } from "./types";

const fhirServer: (v: FHIRRequest) => Promise<number> = CreateChain([
  (request: FHIRRequest): Promise<number> => {
    return new Promise((resolve) => resolve(5));
  },
  (v: Promise<number>) => {
    return v;
  },
]);

export default fhirServer;
