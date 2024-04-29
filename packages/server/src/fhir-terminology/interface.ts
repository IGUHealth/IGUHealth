import { FHIR_VERSION } from "@iguhealth/fhir-types/versions";
import {
  CodeSystemLookup,
  ValueSetExpand,
  ValueSetValidateCode,
} from "@iguhealth/generated-ops/r4";

import { FHIRServerCTX } from "../fhir-api/types.js";

export interface TerminologyProvider {
  expand(
    ctx: FHIRServerCTX,
    fhirVersion: FHIR_VERSION,
    input: ValueSetExpand.Input,
  ): Promise<ValueSetExpand.Output>;
  validate(
    ctx: FHIRServerCTX,
    fhirVersion: FHIR_VERSION,
    input: ValueSetValidateCode.Input,
  ): Promise<ValueSetValidateCode.Output>;
  lookup(
    ctx: FHIRServerCTX,
    fhirVersion: FHIR_VERSION,
    input: CodeSystemLookup.Input,
  ): Promise<CodeSystemLookup.Output>;
}
