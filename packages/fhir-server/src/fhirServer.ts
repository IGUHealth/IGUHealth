import chain from "./chain";
import { FHIRDataBase } from "@genfhi/fhir-database/src/types";
import { CapabilityStatement } from "@genfhi/fhir-types/r4/types";
import { FHIRRequest, FHIRResponse } from "./types";

type FHIRServerParameter = {
  capabilities: CapabilityStatement;
  database: FHIRDataBase;
};

const createFhirServer =
  ({ database, capabilities }: FHIRServerParameter) =>
  (fhirRequest: FHIRRequest) =>
    chain(
      fhirRequest,
      (v: FHIRRequest) => "testing",
      (z: number) => `${z}`,
      (z: string) => z
    );

export default createFhirServer;
