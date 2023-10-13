import { ValueSetValidateCode } from "@iguhealth/generated-ops/r4";

import { FHIRServerCTX } from "../../fhirServer.js";
import { InvokeRequest } from "../types.js";

import InlineOperation from "./interface.js";
import { ValueSet } from "@iguhealth/fhir-types/r4/types";
import { TerminologyProviderMemory } from "../../terminology/index.js";

const termProvider = new TerminologyProviderMemory();

export const ValueSetValidate = InlineOperation(
  ValueSetValidateCode.Op,
  async (ctx: FHIRServerCTX, input) => {
    const expandedValueSet = await termProvider.validate(ctx, input);
    return expandedValueSet;
  }
);
