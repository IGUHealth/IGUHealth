import { FHIRRequest } from "@iguhealth/client/types";
import { FHIR_VERSION } from "@iguhealth/fhir-types/versions";
import { CodeSystemLookup } from "@iguhealth/generated-ops/r4";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { IGUHealthServerCTX } from "../../../../../fhir-server/types.js";
import InlineOperation from "../../interface.js";

export const CodeSystemLookupInvoke = InlineOperation(
  CodeSystemLookup.Op,
  async (
    ctx: IGUHealthServerCTX,
    request: FHIRRequest<FHIR_VERSION>,
    input,
  ) => {
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
