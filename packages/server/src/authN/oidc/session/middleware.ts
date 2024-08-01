import { OIDCRouteHandler } from "../index.js";
import {
  deserializeUser,
  isAuthenticated,
  sessionLogin,
  sessionLogout,
} from "./index.js";

export function sessionAuthorizationMiddleware(): OIDCRouteHandler {
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
