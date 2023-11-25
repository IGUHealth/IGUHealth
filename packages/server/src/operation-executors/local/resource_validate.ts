import { ResourceValidate } from "@iguhealth/generated-ops/r4";
import { ResourceType } from "@iguhealth/fhir-types/r4/types";
import validate from "@iguhealth/fhir-validation";
import {
  OperationError,
  outcomeError,
  outcome,
} from "@iguhealth/operation-outcomes";
import { FHIRServerCTX } from "../../ctx/types.js";
import InlineOperation from "./interface.js";
import { TypeInteraction } from "@iguhealth/client/types";

export const validateResource = async (
  ctx: FHIRServerCTX,
  resourceType: ResourceType,
  input: ResourceValidate.Input
) => {
  const mode = input.mode ? input.mode : "no-action";
  switch (mode) {
    case "create":
    case "update":
    case "no-action":
    case "delete": {
      if (!input.resource)
        return outcomeError(
          "invalid",
          "No resource provided during validation"
        );
      const issues = await validate(
        {
          validateCode: async (url: string, code: string) => {
            const result = await ctx.terminologyProvider.validate(ctx, {
              code,
              url,
            });
            return result.result;
          },
          resolveCanonical: ctx.resolveCanonical,
        },
        resourceType,
        input.resource
      );

      if (issues.length > 0) {
        return outcome(issues);
      }

      return outcome([
        {
          severity: "information",
          code: "informational",
          diagnostics: "Validation successful",
        },
      ]);
    }
    default:
      throw new OperationError(
        outcomeError(
          "invalid",
          "Invalid mode '${mode}' was passed to validation operation"
        )
      );
  }
};

export default InlineOperation(ResourceValidate.Op, (ctx, request, input) => {
  return validateResource(
    ctx,
    (request as TypeInteraction).resourceType,
    input
  );
});
