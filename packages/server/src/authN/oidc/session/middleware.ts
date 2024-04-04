import { ManagementRouteHandler } from "../index.js";
import {
  deserializeUser,
  isAuthenticated,
  sessionLogin,
  sessionLogout,
} from "./index.js";

export function sessionAuthorizationMiddleware(): ManagementRouteHandler {
  return async (ctx, next) => {
    ctx.oidc.isAuthenticated = isAuthenticated;

    ctx.oidc.sessionLogin = sessionLogin;
    ctx.oidc.sessionLogout = sessionLogout;
    ctx.oidc.user = await deserializeUser(ctx);

    await next();
  };
}
