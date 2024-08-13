import { OIDC_ROUTES } from "../constants.js";
import { OIDCRouteHandler } from "../index.js";
import {
  deserializeUser,
  isAuthenticated,
  sessionLogin,
  sessionLogout,
} from "./index.js";

export function createSessionInjectMethodsMiddleware(): OIDCRouteHandler {
  return async (ctx, next) => {
    ctx.state.oidc = {
      ...ctx.state.oidc,
      isAuthenticated,
      sessionLogin,
      sessionLogout,
      user: await deserializeUser(ctx),
    };

    await next();
  };
}

export function createSessionValidateAuthentication(): OIDCRouteHandler {
  return async (ctx, next) => {
    if (await isAuthenticated(ctx)) {
      await next();
    } else {
      const loginURl = ctx.router.url(
        OIDC_ROUTES.LOGIN_VIEW,
        {
          tenant: ctx.state.iguhealth.tenant,
        },
        // In event of post request we should avoid setting on query
        // As url may be too large to set on query.
        // Authorize post can be used to avoid url character limit.
        ctx.request.method === "GET"
          ? { query: ctx.state.oidc.parameters }
          : undefined,
      );
      if (loginURl instanceof Error) throw loginURl;

      ctx.status = 308;
      ctx.redirect(loginURl);
    }
  };
}
