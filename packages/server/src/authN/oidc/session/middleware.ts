import { OIDCRouteHandler } from "../index.js";
import {
  deserializeUser,
  isAuthenticated,
  sessionLogin,
  sessionLogout,
} from "./index.js";

export function sessionAuthorizationMiddleware(): OIDCRouteHandler {
  return async (ctx, next) => {
    ctx.oidc.isAuthenticated = isAuthenticated;

    ctx.oidc.sessionLogin = sessionLogin;
    ctx.oidc.sessionLogout = sessionLogout;

    ctx.oidc.user = await deserializeUser(ctx);

    await next();
  };
}
