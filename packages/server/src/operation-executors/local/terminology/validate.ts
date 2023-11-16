import { ValueSetValidateCode } from "@iguhealth/generated-ops/r4";

import { FHIRServerCTX } from "../../../ctx/types.js";
import InlineOperation from "../interface.js";
import { FHIRRequest } from "@iguhealth/client/types";

const ValueSetValidateInvoke = InlineOperation(
  ValueSetValidateCode.Op,
  async (ctx: FHIRServerCTX, request: FHIRRequest, input) => {
    const validationResult = await ctx.terminologyProvider.validate(ctx, input);
    return validationResult;
  }
);

export default ValueSetValidateInvoke;
