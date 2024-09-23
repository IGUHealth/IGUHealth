import evaluateV2AccessPolicy, {
  isPermitted,
} from "@iguhealth/access-control/v2";
import type { MiddlewareAsyncChain } from "@iguhealth/client/middleware";
import { OperationError } from "@iguhealth/operation-outcomes";

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
    const result = await evaluateV2AccessPolicy(
      {
        clientCTX: context.ctx,
        client: context.ctx.client,
        environment: {
          request: context.request,
          user: {
            payload: context.ctx.user.payload,
            resource: context.ctx.user.resource,
          },
        },
        attributes: {},
      },
      context.ctx.user.accessPolicies ?? [],
    );

    if (isPermitted(result)) {
      return next(context);
    }

    throw new OperationError(result);
  };
}

export default createAuthorizationMiddleware;
