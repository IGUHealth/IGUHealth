import { MiddlewareAsyncChain } from "@iguhealth/client/middleware";
import { ResourceType } from "@iguhealth/fhir-types/lib/generated/r4/types";
import { R4 } from "@iguhealth/fhir-types/versions";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

export default function validateResourceTypeMiddleware<State, CTX>(
  typesAllowed: ResourceType[],
): MiddlewareAsyncChain<State, CTX> {
  return async (context, next) => {
    if (context.request.level === "system") {
      throw new OperationError(
        outcomeError(
          "not-supported",
          `Operation level '${context.request.level}' is not supported in this middleware.`,
        ),
      );
    }
    if (context.request.fhirVersion !== R4) {
      throw new OperationError(
        outcomeError(
          "not-supported",
          `FHIR version '${context.request.fhirVersion}' is not supported in this middleware.`,
        ),
      );
    }
    if (!typesAllowed.includes(context.request.resourceType)) {
      throw new OperationError(
        outcomeError(
          "not-supported",
          `Resource type '${context.request.resourceType}' is not supported in this middleware.`,
        ),
      );
    }
    return next(context);
  };
}
