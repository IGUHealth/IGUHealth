import { OIDCRouteHandler } from "../index.js";
import {
  deserializeUser,
  isAuthenticated,
  sessionLogin,
  sessionLogout,
} from "./index.js";

export function sessionAuthorizationMiddleware(): OIDCRouteHandler {
  return async (ctx, next) => {
    ctx.state.oidc.isAuthenticated = isAuthenticated;

    ctx.state.oidc.sessionLogin = sessionLogin;
    ctx.state.oidc.sessionLogout = sessionLogout;

    ctx.state.oidc.user = await deserializeUser(ctx);

    await next();
  };
}
