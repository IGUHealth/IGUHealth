import { ValueSetValidateCode } from "@iguhealth/generated-ops/r4";

import { FHIRServerCTX } from "../../../ctx/types.js";
import InlineOperation from "../interface.js";
import { TerminologyProviderMemory } from "../../../terminology/index.js";

const ValueSetValidateInvoke = InlineOperation(
  ValueSetValidateCode.Op,
  async (ctx: FHIRServerCTX, input) => {
    const validationResult = await ctx.terminologyProvider.validate(ctx, input);
    return validationResult;
  }
);

export default ValueSetValidateInvoke;
