import {
  ValueSetExpand,
  ValueSetValidateCode,
} from "@iguhealth/generated-ops/r4";
import { Operation } from "@iguhealth/operation-execution";

import { FHIRServerCTX } from "../fhirServer.js";

import ExpandInput = ValueSetExpand.Input;
import ExpandOutput = ValueSetExpand.Output;

import ValidateInput = ValueSetValidateCode.Input;
import ValidateOutput = ValueSetValidateCode.Output;

export interface TerminologyProvider {
  expand(ctx: FHIRServerCTX, input: ExpandInput): Promise<ExpandOutput>;
  validate(ctx: FHIRServerCTX, input: ValidateInput): Promise<ValidateOutput>;
}
