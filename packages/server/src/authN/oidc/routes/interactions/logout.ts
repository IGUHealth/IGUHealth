import { user_scope } from "zapatos/schema";

import { OIDC_ROUTES } from "../../constants.js";
import { ManagementRouteHandler } from "../../index.js";

/**
 * Logs out user from passport session and redirects to login page.
 * Used in both GET and POST requests.
 * @param ctx FHIR Server Context
 */
export const logout =
  (scope: user_scope): ManagementRouteHandler =>
  async (ctx) => {
    await ctx.logout();
    ctx.redirect(
      ctx.router.url(OIDC_ROUTES(scope).LOGIN_GET, {
        tenant: ctx.oidc.tenant,
      }) as string,
    );
  };
