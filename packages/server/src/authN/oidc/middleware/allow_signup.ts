import * as Koa from "koa";

import { KoaExtensions } from "../../../fhir-api/types.js";

/**
 * Inject Tenant management into the context.
 * @returns Koa.Middleware
 */
export function setAllowSignup(
  allowSignup: boolean,
): Koa.Middleware<
  KoaExtensions.IGUHealthServices,
  KoaExtensions.KoaIGUHealthContext
> {
  return async (ctx, next) => {
    ctx.state = {
      ...ctx.state,
      allowSignup,
    };

    await next();
  };
}
