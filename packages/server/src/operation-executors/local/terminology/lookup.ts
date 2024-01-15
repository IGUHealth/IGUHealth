import { FHIRRequest } from "@iguhealth/client/types";
import { CodeSystemLookup } from "@iguhealth/generated-ops/r4";

import { FHIRServerCTX } from "../../../fhir/context.js";
import InlineOperation from "../interface.js";

const CodeSystemLookupInvoke = InlineOperation(
  CodeSystemLookup.Op,
  async (ctx: FHIRServerCTX, request: FHIRRequest, input) => {
    const lookup = await ctx.terminologyProvider.lookup(ctx, input);
    return lookup;
  },
);

export default CodeSystemLookupInvoke;
