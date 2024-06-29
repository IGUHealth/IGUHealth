import { FHIRRequest } from "@iguhealth/client/types";
import { CodeSystemLookup } from "@iguhealth/generated-ops/r4";

import { IGUHealthServerCTX } from "../../../../fhir-api/types.js";
import InlineOperation from "../interface.js";

const CodeSystemLookupInvoke = InlineOperation(
  CodeSystemLookup.Op,
  async (ctx: IGUHealthServerCTX, request: FHIRRequest, input) => {
    const lookup = await ctx.terminologyProvider.lookup(
      ctx,
      request.fhirVersion,
      input,
    );
    return lookup;
  },
);

export default CodeSystemLookupInvoke;
