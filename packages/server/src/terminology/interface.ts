import {
  ValueSetExpand,
  ValueSetValidateCode,
  CodeSystemLookup,
} from "@iguhealth/generated-ops/r4";

import { FHIRServerCTX } from "../fhir/context.js";

export interface TerminologyProvider {
  expand(
    ctx: FHIRServerCTX,
    input: ValueSetExpand.Input
  ): Promise<ValueSetExpand.Output>;
  validate(
    ctx: FHIRServerCTX,
    input: ValueSetValidateCode.Input
  ): Promise<ValueSetValidateCode.Output>;
  lookup(
    ctx: FHIRServerCTX,
    input: CodeSystemLookup.Input
  ): Promise<CodeSystemLookup.Output>;
}
