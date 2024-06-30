import * as Koa from "koa";

import { KoaContext } from "../../../fhir-api/types.js";

/**
 * Inject Tenant management into the context.
 * @returns Koa.Middleware
 */
export function setAllowSignup<State, C>(
  allowSignup: boolean,
): Koa.Middleware<State, KoaContext.IGUHealth<C>> {
  return async (ctx, next) => {
    ctx.oidc = {
      ...ctx.oidc,
      allowSignup,
    };

    await next();
  };
}
