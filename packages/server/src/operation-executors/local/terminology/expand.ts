import { ValueSetExpand } from "@iguhealth/generated-ops/r4";

import { FHIRServerCTX } from "../../../fhir/types.js";
import InlineOperation from "../interface.js";
import { FHIRRequest } from "@iguhealth/client/types";

const ValueSetExpandInvoke = InlineOperation(
  ValueSetExpand.Op,
  async (ctx: FHIRServerCTX, request: FHIRRequest, input) => {
    const expandedValueSet = await ctx.terminologyProvider.expand(ctx, input);
    return expandedValueSet;
  }
);

export default ValueSetExpandInvoke;
