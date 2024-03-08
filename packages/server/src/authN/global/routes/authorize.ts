import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { AuthorizationCodeManagement } from "../../db/code/interface.js";
import { ROUTES } from "../constants.js";
import { ManagementRouteHandler } from "../index.js";
import { setLoginRedirectSession } from "./interactions/login.js";

function getRegexForRedirect(urlPattern: string): RegExp {
  const regex = new RegExp(urlPattern.replaceAll("*", "(.+)"));
  return regex;
}

/**
 * See https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.1.
 * response_type
         REQUIRED.  Value MUST be set to "code".

   client_id
         REQUIRED.  The client identifier as described in Section 2.2.

   redirect_uri
         OPTIONAL.  As described in Section 3.1.2.

   scope
         OPTIONAL.  The scope of the access request as described by
         Section 3.3.

   state
         RECOMMENDED.  An opaque value used by the client to maintain
         state between the request and callback.  The authorization
         server includes this value when redirecting the user-agent back
         to the client.  The parameter SHOULD be used for preventing
         cross-site request forgery as described in Section 10.12.
 */
export function authorizeGET({
  codeManagement,
}: {
  codeManagement: AuthorizationCodeManagement;
}): ManagementRouteHandler {
  return async (ctx, next) => {
    if (ctx.isAuthenticated()) {
      const redirectUrl = ctx.request.query.redirect_uri?.toString();
      // const scope = ctx.request.query.scope;
      const state = ctx.request.query.state;
      const client = ctx.oidc.client;

      if (!client)
        throw new OperationError(outcomeError("invalid", "Client not found."));
      if (
        !redirectUrl ||
        !client.redirectUri?.find((v) =>
          getRegexForRedirect(v).test(redirectUrl),
        )
      )
        throw new OperationError(
          outcomeError("invalid", `Redirect URI '${redirectUrl}' not found.`),
        );

      const code = await codeManagement.create(ctx.postgres, {
        type: "oauth2_code_grant",
        client_id: client.id,
        user_id: ctx.state.user.id,
        expires_in: "15 minutes",
      });

      ctx.redirect(`${redirectUrl}?code=${code.code}&state=${state}`);
    } else {
      setLoginRedirectSession(ctx.session, ctx.url);
      ctx.redirect(ctx.router.url(ROUTES.LOGIN_GET) as string);
    }
    await next();
  };
}
