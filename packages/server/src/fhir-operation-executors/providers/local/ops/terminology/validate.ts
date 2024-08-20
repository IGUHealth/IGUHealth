import { FHIRRequest } from "@iguhealth/client/types";
import { ValueSetValidateCode } from "@iguhealth/generated-ops/r4";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { IGUHealthServerCTX } from "../../../../../fhir-api/types.js";
import InlineOperation from "../../interface.js";

export const ValueSetValidateInvoke = InlineOperation(
  ValueSetValidateCode.Op,
  async (ctx: IGUHealthServerCTX, request: FHIRRequest, input) => {
    if (!ctx.terminologyProvider)
      throw new OperationError(
        outcomeError("not-supported", "Terminology provider is not configured"),
      );
    const validationResult = await ctx.terminologyProvider.validate(
      ctx,
      request.fhirVersion,
      input,
    );
    return validationResult;
  },
);
