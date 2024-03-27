import { user_scope } from "zapatos/schema";

import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { OIDC_ROUTES } from "../../constants.js";
import { ManagementRouteHandler } from "../../index.js";
import { isInvalidRedirectUrl } from "../../utilities/checkRedirectUrl.js";

/**
 * Logs out user from passport session and redirects to login page.
 * Used in both GET and POST requests.
 * @param ctx FHIR Server Context
 */
export const logout =
  (scope: user_scope): ManagementRouteHandler =>
  async (ctx) => {
    await ctx.logout();

    const client = ctx.oidc.client;
    const redirectUrl = ctx.request.query.redirect_uri?.toString();

    if (client) {
      if (!redirectUrl) {
        throw new OperationError(
          outcomeError("invalid", "Redirect URI not found."),
        );
      }
      if (isInvalidRedirectUrl(redirectUrl, client))
        throw new OperationError(
          outcomeError("invalid", `Redirect URI '${redirectUrl}' not found.`),
        );
      ctx.redirect(redirectUrl);
      return;
    }

    ctx.redirect(
      ctx.router.url(OIDC_ROUTES(scope).LOGIN_GET, {
        tenant: ctx.oidc.tenant,
      }) as string,
    );
  };
