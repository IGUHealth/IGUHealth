import { ResourceValidate } from "@iguhealth/generated-ops/r4";
import validate from "@iguhealth/fhir-validation";
import {
  OperationError,
  outcomeError,
  outcome,
} from "@iguhealth/operation-outcomes";

import { FHIRServerCTX } from "../../ctx/types.js";
import InlineOperation from "./interface.js";

const ValueSetValidateInvoke = InlineOperation(
  ResourceValidate.Op,
  async (ctx: FHIRServerCTX, input) => {
    switch (input.mode) {
      case "create":
      case "update":
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
            resolveSD: (type) => {
              const sd = ctx.resolveSD(type);
              if (!sd)
                throw new OperationError(
                  outcomeError("invalid", `Could not validate type of ${type}`)
                );
              return sd;
            },
          },
          input.resource?.resourceType,
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
  }
);

export default ValueSetValidateInvoke;
