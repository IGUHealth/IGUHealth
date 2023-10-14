import { CodeSystemLookup } from "@iguhealth/generated-ops/r4";

import { FHIRServerCTX } from "../../fhirServer.js";
import InlineOperation from "./interface.js";
import { TerminologyProviderMemory } from "../../terminology/index.js";

const termProvider = new TerminologyProviderMemory();

export const CodeSystemLookupInvoke = InlineOperation(
  CodeSystemLookup.Op,
  async (ctx: FHIRServerCTX, input) => {
    const lookup = await termProvider.lookup(ctx, input);
    return lookup;
  }
);
