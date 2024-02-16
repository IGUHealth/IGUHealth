import { ROUTES } from "../constants.js";
import { ManagementRouteHandler } from "../index.js";
import { setLoginRedirectSession } from "./login.js";

export const authorizeGET: ManagementRouteHandler = async (ctx) => {
  if (ctx.isAuthenticated()) {
    ctx.body = { success: true };
  } else {
    setLoginRedirectSession(ctx.session, ctx.url);
    ctx.redirect(ctx.router.url(ROUTES.LOGIN_GET) as string);
  }
};
