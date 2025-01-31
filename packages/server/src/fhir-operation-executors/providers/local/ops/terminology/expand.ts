import { FHIRRequest } from "@iguhealth/client/types";
import { FHIR_VERSION } from "@iguhealth/fhir-types/versions";
import { ValueSetExpand } from "@iguhealth/generated-ops/r4";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { IGUHealthServerCTX } from "../../../../../fhir-server/types.js";
import InlineOperation from "../../interface.js";

export const ValueSetExpandInvoke = InlineOperation(
  ValueSetExpand.Op,
  async (
    ctx: IGUHealthServerCTX,
    request: FHIRRequest<FHIR_VERSION>,
    input,
  ) => {
    if (!ctx.terminologyProvider)
      throw new OperationError(
        outcomeError("not-supported", "Terminology provider is not configured"),
      );
    const expandedValueSet = await ctx.terminologyProvider.expand(
      ctx,
      request.fhirVersion,
      input,
    );
    return expandedValueSet;
  },
);
