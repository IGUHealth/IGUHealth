import { FHIRRequest } from "@iguhealth/client/types";
import { ValueSetExpand } from "@iguhealth/generated-ops/r4";

import { FHIRServerCTX } from "../../../../fhir-api/types.js";
import InlineOperation from "../interface.js";

const ValueSetExpandInvoke = InlineOperation(
  ValueSetExpand.Op,
  async (ctx: FHIRServerCTX, request: FHIRRequest, input) => {
    const expandedValueSet = await ctx.terminologyProvider.expand(
      ctx,
      request.fhirVersion,
      input,
    );
    return expandedValueSet;
  },
);

export default ValueSetExpandInvoke;
