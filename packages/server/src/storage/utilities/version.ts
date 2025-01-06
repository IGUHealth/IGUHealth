import * as s from "zapatos/schema";

import { FHIR_VERSION, R4, R4B } from "@iguhealth/fhir-types/versions";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

export function toDBFHIRVersion(fhirVersion: FHIR_VERSION): s.fhir_version {
  switch (fhirVersion) {
    case R4: {
      return "r4";
    }
    case R4B: {
      return "r4b";
    }
    default: {
      throw new OperationError(
        outcomeError(
          "not-supported",
          `FHIR version ${fhirVersion} is not supported.`,
        ),
      );
    }
  }
}

export function toFHIRVersion(fhirVersion: s.fhir_version): FHIR_VERSION {
  switch (fhirVersion) {
    case "r4": {
      return R4;
    }
    case "r4b": {
      return R4B;
    }
    default: {
      throw new OperationError(
        outcomeError(
          "not-supported",
          `FHIR version ${fhirVersion} is not supported.`,
        ),
      );
    }
  }
}
