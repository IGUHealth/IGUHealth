import { CodeSystemLookup } from "@iguhealth/generated-ops/r4";

import { FHIRServerCTX } from "../../../ctx/types.js";
import InlineOperation from "../interface.js";
import { TerminologyProviderMemory } from "../../../terminology/index.js";

const CodeSystemLookupInvoke = InlineOperation(
  CodeSystemLookup.Op,
  async (ctx: FHIRServerCTX, input) => {
    const lookup = await ctx.terminologyProvider.lookup(ctx, input);
    return lookup;
  }
);

export default CodeSystemLookupInvoke;
