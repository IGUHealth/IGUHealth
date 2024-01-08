import type { MiddlewareAsync } from "@iguhealth/client/middleware";
import {
  FHIRServerCTX,
  FHIRServerInitCTX,
  FHIRServerState,
} from "../../fhir/types.js";
import { FHIRRequest } from "@iguhealth/client/lib/types";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

function isServerCTX(
  ctx: FHIRServerCTX | FHIRServerInitCTX
): ctx is FHIRServerCTX {
  return "client" in ctx;
}

function canUserMakeRequest(ctx: FHIRServerCTX, request: FHIRRequest): boolean {
  return true;
}

/**
 * Middleware to evaluate access policy access.
 * @param context Current state, server context and request information.
 * @param next Next middleware
 * @returns context with response.
 */
export const authorizationMiddleware: MiddlewareAsync<
  FHIRServerState,
  FHIRServerCTX | FHIRServerInitCTX
> = async (context, next) => {
  if (!isServerCTX(context.ctx)) throw new Error(`Invalid context`);
  if (!next) throw new Error("Next must be present on access policy access");

  const { user, tenant } = context.ctx;

  if (canUserMakeRequest(context.ctx, context.request)) {
    return next(context);
  }

  throw new OperationError(outcomeError("security", "access-denied"));
};
