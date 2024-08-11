import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { OIDCRouteHandler } from "../../index.js";

/**
 *
 */
export function smartLaunchGET(): OIDCRouteHandler {
  return async (ctx, next) => {
    throw new OperationError(outcomeError("not-supported", "Not implemented"));
  };
}
