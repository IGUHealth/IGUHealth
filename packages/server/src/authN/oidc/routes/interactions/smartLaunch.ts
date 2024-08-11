import { FHIRGenerativeSearchTable } from "@iguhealth/components";

import { OIDCRouteHandler } from "../../index.js";

/**
 *
 */
export function smartLaunchGET(): OIDCRouteHandler {
  return async (ctx, next) => {
    ctx.body = FHIRGenerativeSearchTable;
  };
}
