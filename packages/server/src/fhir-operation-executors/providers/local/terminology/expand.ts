import { FHIRRequest } from "@iguhealth/client/types";
import { ValueSetExpand } from "@iguhealth/generated-ops/r4";

import { IGUHealthServerCTX } from "../../../../fhir-api/types.js";
import InlineOperation from "../interface.js";

const ValueSetExpandInvoke = InlineOperation(
  ValueSetExpand.Op,
  async (ctx: IGUHealthServerCTX, request: FHIRRequest, input) => {
    const expandedValueSet = await ctx.terminologyProvider.expand(
      ctx,
      request.fhirVersion,
      input,
    );
    return expandedValueSet;
  },
);

export default ValueSetExpandInvoke;
