import { ROUTES } from "../constants.js";
import { ManagementRouteHandler } from "../index.js";

/**
 * Logs out user from passport session and redirects to login page.
 * Used in both GET and POST requests.
 * @param ctx FHIR Server Context
 */
export const logout: ManagementRouteHandler = async (ctx) => {
  await ctx.logout();
  ctx.redirect(ctx.router.url(ROUTES.LOGIN_GET) as string);
};
