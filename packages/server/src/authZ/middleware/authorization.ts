import evaluateAccessPolicy from "@iguhealth/access-control";
import type { MiddlewareAsyncChain } from "@iguhealth/client/middleware";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { IGUHealthServerCTX } from "../../fhir-api/types.js";

/**
 * Middleware to evaluate access policy access.
 * @param context Current state, server context and request information.
 * @param next Next middleware
 * @returns context with response.
 */
function createAuthorizationMiddleware<T>(): MiddlewareAsyncChain<
  T,
  IGUHealthServerCTX
> {
  return async (context, next) => {
    if (
      evaluateAccessPolicy(
        context.ctx.user.payload,
        context.ctx.user.accessPolicies ?? [],
        context.request,
      )
    ) {
      return next(context);
    }

    throw new OperationError(outcomeError("forbidden", "access-denied"));
  };
}

export default createAuthorizationMiddleware;
