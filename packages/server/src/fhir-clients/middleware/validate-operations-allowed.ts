import { AllInteractions, RequestType } from "@iguhealth/client/lib/types";
import { MiddlewareAsyncChain } from "@iguhealth/client/middleware";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

export default function validateOperationsAllowed<State, CTX>(
  operationsAllowed: RequestType[AllInteractions][],
): MiddlewareAsyncChain<State, CTX> {
  return async (state, context, next) => {
    if (!operationsAllowed.includes(context.request.type)) {
      throw new OperationError(
        outcomeError(
          "not-supported",
          `Operation '${context.request.type}' is not supported in this middleware.`,
        ),
      );
    }
    return next(state, context);
  };
}
