import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { OIDC_ROUTES } from "../../constants.js";
import { OIDCRouteHandler } from "../../index.js";
import { isInvalidRedirectUrl } from "../../utilities/checkRedirectUrl.js";

/**
 * Logs out user from passport session and redirects to login page.
 * Used in both GET and POST requests.
 * @param ctx FHIR Server Context
 */
export const logout = (): OIDCRouteHandler => async (ctx) => {
  await ctx.state.oidc.sessionLogout(ctx);

  const client = ctx.state.oidc.client;
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
    ctx.router.url(OIDC_ROUTES.LOGIN_VIEW_GET, {
      tenant: ctx.state.iguhealth.tenant,
    }) as string,
  );
};
