import { FHIRRequest } from "@iguhealth/client/lib/types";
import { MiddlewareAsyncChain } from "@iguhealth/client/middleware";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

export default function validateOperationsAllowed<State, CTX>(
  operationsAllowed: FHIRRequest["type"][],
): MiddlewareAsyncChain<State, CTX> {
  return async (context, next) => {
    if (!operationsAllowed.includes(context.request.type)) {
      throw new OperationError(
        outcomeError(
          "not-supported",
          `Operation '${context.request.type}' is not supported in this middleware.`,
        ),
      );
    }
    return next(context);
  };
}
