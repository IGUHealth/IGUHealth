import { R4BTypeInteraction, R4TypeInteraction } from "@iguhealth/client/types";
import * as r4 from "@iguhealth/fhir-types/r4/types";
import * as r4b from "@iguhealth/fhir-types/r4b/types";
import { FHIR_VERSION } from "@iguhealth/fhir-types/versions";
import validate from "@iguhealth/fhir-validation";
import { ResourceValidate } from "@iguhealth/generated-ops/r4";
import {
  OperationError,
  outcome,
  outcomeError,
} from "@iguhealth/operation-outcomes";

import { IGUHealthServerCTX } from "../../../fhir-api/types.js";
import InlineOperation from "./interface.js";

export const validateResource = async (
  ctx: IGUHealthServerCTX,
  fhirVersion: FHIR_VERSION,
  resourceType: r4.ResourceType | r4b.ResourceType,
  input: {
    resource?: r4.ConcreteType | r4b.ConcreteType;
    mode?: r4.code;
    profile?: r4.uri;
  },
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
          "No resource provided during validation",
        );
      const issues = await validate(
        {
          fhirVersion,
          validateCode: async (url: r4.uri, code: r4.code) => {
            const result = await ctx.terminologyProvider.validate(
              ctx,
              fhirVersion,
              {
                code,
                url,
              },
            );
            return result.result;
          },
          resolveCanonical: ctx.resolveCanonical,
          resolveTypeToCanonical: ctx.resolveTypeToCanonical,
        },
        resourceType as r4.uri,
        input.resource,
      );

      if (issues.length > 0) {
        return outcome(issues);
      }

      return outcome([
        {
          severity: "information" as r4.code,
          code: "informational" as r4.code,
          diagnostics: "Validation successful",
        },
      ]);
    }
    default:
      throw new OperationError(
        outcomeError(
          "invalid",
          "Invalid mode '${mode}' was passed to validation operation",
        ),
      );
  }
};

export default InlineOperation(ResourceValidate.Op, (ctx, request, input) => {
  return validateResource(
    ctx,
    request.fhirVersion,
    (request as R4TypeInteraction | R4BTypeInteraction).resourceType,
    input,
  );
});
