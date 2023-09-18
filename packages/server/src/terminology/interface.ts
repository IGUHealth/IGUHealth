import { ValueSet } from "@iguhealth/fhir-types/r4/types";
import {
  ValueSetExpand,
  ValueSetValidateCode,
} from "@iguhealth/generated-ops/r4";

import { FHIRServerCTX } from "../fhirServer.js";

import ValueSetInput = ValueSetExpand.Input;
import ValueSetOutput = ValueSetExpand.Output;

import ValueSetValidateCodeInput = ValueSetValidateCode.Input;
import ValueSetValidateCodeOutput = ValueSetValidateCode.Output;

export interface TerminologyProvider {
  expand(ctx: FHIRServerCTX, input: ValueSetInput): Promise<ValueSetOutput>;
  validate(
    ctx: FHIRServerCTX,
    input: ValueSetValidateCodeInput
  ): Promise<ValueSetValidateCodeOutput>;
}
