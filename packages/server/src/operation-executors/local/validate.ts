import { ValueSetValidateCode } from "@iguhealth/generated-ops/r4";

import { FHIRServerCTX } from "../../fhirServer.js";

import InlineOperation from "./interface.js";
import { TerminologyProviderMemory } from "../../terminology/index.js";

const termProvider = new TerminologyProviderMemory();

export const ValueSetValidate = InlineOperation(
  ValueSetValidateCode.Op,
  async (ctx: FHIRServerCTX, input) => {
    const validationResult = await termProvider.validate(ctx, input);
    return validationResult;
  }
);
