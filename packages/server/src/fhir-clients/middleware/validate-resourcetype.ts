import { MiddlewareAsyncChain } from "@iguhealth/client/middleware";
import { FHIR_VERSION, R4, ResourceType } from "@iguhealth/fhir-types/versions";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

export default function validateResourceTypesAllowedMiddleware<State, CTX>(
  typesAllowed: ResourceType<FHIR_VERSION>[],
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
    if (!typesAllowed.includes(context.request.resource)) {
      throw new OperationError(
        outcomeError(
          "not-supported",
          `Resource type '${context.request.resource}' is not supported in this middleware.`,
        ),
      );
    }
    return next(context);
  };
}
