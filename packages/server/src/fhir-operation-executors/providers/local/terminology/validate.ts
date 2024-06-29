import { FHIRRequest } from "@iguhealth/client/types";
import { ValueSetValidateCode } from "@iguhealth/generated-ops/r4";

import { IGUHealthServerCTX } from "../../../../fhir-api/types.js";
import InlineOperation from "../interface.js";

const ValueSetValidateInvoke = InlineOperation(
  ValueSetValidateCode.Op,
  async (ctx: IGUHealthServerCTX, request: FHIRRequest, input) => {
    const validationResult = await ctx.terminologyProvider.validate(
      ctx,
      request.fhirVersion,
      input,
    );
    return validationResult;
  },
);

export default ValueSetValidateInvoke;
