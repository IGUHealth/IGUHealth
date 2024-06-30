import * as Koa from "koa";

import { KoaState } from "../../../fhir-api/types.js";

/**
 * Inject Tenant management into the context.
 * @returns Koa.Middleware
 */
export function setAllowSignup(
  allowSignup: boolean,
): Koa.Middleware<KoaState.IGUHealth, Koa.DefaultContext> {
  return async (ctx, next) => {
    ctx.state.oidc = {
      ...ctx.state.oidc,
      allowSignup,
    };

    await next();
  };
}
