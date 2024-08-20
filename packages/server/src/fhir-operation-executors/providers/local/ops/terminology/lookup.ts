import { FHIRRequest } from "@iguhealth/client/types";
import { CodeSystemLookup } from "@iguhealth/generated-ops/r4";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { IGUHealthServerCTX } from "../../../../../fhir-api/types.js";
import InlineOperation from "../../interface.js";

const CodeSystemLookupInvoke = InlineOperation(
  CodeSystemLookup.Op,
  async (ctx: IGUHealthServerCTX, request: FHIRRequest, input) => {
    if (!ctx.terminologyProvider)
      throw new OperationError(
        outcomeError("not-supported", "Terminology provider is not configured"),
      );
    const lookup = await ctx.terminologyProvider.lookup(
      ctx,
      request.fhirVersion,
      input,
    );
    return lookup;
  },
);

export default CodeSystemLookupInvoke;
