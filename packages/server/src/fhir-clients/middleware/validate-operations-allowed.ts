import { FHIRRequest } from "@iguhealth/client/lib/types";
import { MiddlewareAsyncChain } from "@iguhealth/client/middleware";
import { FHIR_VERSION } from "@iguhealth/fhir-types/versions";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

export default function validateOperationsAllowed<State, CTX>(
  operationsAllowed: FHIRRequest<FHIR_VERSION>["type"][],
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
