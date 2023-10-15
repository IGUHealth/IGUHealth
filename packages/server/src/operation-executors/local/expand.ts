import { ValueSetExpand } from "@iguhealth/generated-ops/r4";

import { FHIRServerCTX } from "../../fhirServer.js";
import InlineOperation from "./interface.js";
import { TerminologyProviderMemory } from "../../terminology/index.js";

const termProvider = new TerminologyProviderMemory();

const ValueSetExpandInvoke = InlineOperation(
  ValueSetExpand.Op,
  async (ctx: FHIRServerCTX, input) => {
    const expandedValueSet = await termProvider.expand(ctx, input);
    return expandedValueSet;
  }
);

export default ValueSetExpandInvoke;
