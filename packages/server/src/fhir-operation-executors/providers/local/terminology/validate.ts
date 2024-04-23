import { FHIRRequest } from "@iguhealth/client/types";
import { ValueSetValidateCode } from "@iguhealth/generated-ops/r4";

import { FHIRServerCTX } from "../../../../fhir-context/types.js";
import InlineOperation from "../interface.js";

const ValueSetValidateInvoke = InlineOperation(
  ValueSetValidateCode.Op,
  async (ctx: FHIRServerCTX, request: FHIRRequest, input) => {
    const validationResult = await ctx.terminologyProvider.validate(
      ctx,
      request.fhirVersion,
      input,
    );
    return validationResult;
  },
);

export default ValueSetValidateInvoke;
