import { MiddlewareAsyncChain } from "@iguhealth/client/middleware";
import { ResourceType } from "@iguhealth/fhir-types/lib/r4/types";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

export default function validateResourceTypeMiddleware<State, CTX>(
  typesAllowed: ResourceType[],
): MiddlewareAsyncChain<State, CTX> {
  return async (context, next) => {
    if (context.request.level === "system") {
      throw new OperationError(
        outcomeError(
          "not-supported",
          `Operation level '${context.request.level}' is not supported in auth.`,
        ),
      );
    }
    if (!typesAllowed.includes(context.request.resourceType)) {
      throw new OperationError(
        outcomeError(
          "not-supported",
          `Resource type '${context.request.resourceType}' is not supported in auth.`,
        ),
      );
    }
    return next(context);
  };
}
