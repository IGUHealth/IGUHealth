import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { OIDC_ROUTES } from "../constants.js";
import { OIDCRouteHandler } from "../index.js";
import { isInvalidRedirectUrl } from "../utilities/checkRedirectUrl.js";
import { encodeState } from "./interactions/login.js";

const SUPPORTED_CODE_CHALLENGE_METHODS = ["S256", "plain"];

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

   ---------------------------------------------------
   PKCE SUPPORT https://datatracker.ietf.org/doc/html/rfc7636#section-4.3
   ---------------------------------------------------
   Our implementation makes PKCE a requirement for security.
   
   code_challenge
      Required. Code challenge.

   code_challenge_method
      OPTIONAL, defaults to "plain" if not present in the request.  Code
      verifier transformation method is "S256" or "plain".
 */
export function authorizeGET(): OIDCRouteHandler {
  return async (ctx, next) => {
    if (await ctx.state.oidc.isAuthenticated(ctx)) {
      const redirectUrl = ctx.request.query.redirect_uri?.toString();
      // const scope = ctx.request.query.scope;
      const state = ctx.state.oidc.parameters.state;
      const client = ctx.state.oidc.client;
      const code_challenge = ctx.state.oidc.parameters.code_challenge;
      const code_challenge_method =
        ctx.state.oidc.parameters.code_challenge_method ?? "plain";

      if (
        SUPPORTED_CODE_CHALLENGE_METHODS.indexOf(code_challenge_method) === -1
      ) {
        throw new OperationError(
          outcomeError(
            "invalid",
            `Code challenge method '${code_challenge_method}' not supported.`,
          ),
        );
      }

      if (!client)
        throw new OperationError(outcomeError("invalid", "Client not found."));

      if (isInvalidRedirectUrl(redirectUrl, client)) {
        throw new OperationError(
          outcomeError("invalid", `Redirect URI '${redirectUrl}' not found.`),
        );
      }

      const code = await ctx.state.oidc.codeManagement.create(
        ctx.state.iguhealth,
        {
          type: "oauth2_code_grant",
          client_id: client.id,
          // Should be safe to use here as is authenticated so user should be populated.
          user_id: ctx.state.oidc.user?.id as string,
          pkce_code_challenge: code_challenge,
          pkce_code_challenge_method: code_challenge_method as "S256" | "plain",
          expires_in: "15 minutes",
        },
      );

      ctx.redirect(`${redirectUrl}?code=${code.code}&state=${state}`);
    } else {
      // use a state parameter
      const state = encodeState({ redirectUrl: ctx.url });

      ctx.redirect(
        ctx.router.url(
          OIDC_ROUTES.LOGIN_GET,
          {
            tenant: ctx.state.iguhealth.tenant,
          },
          { query: { state } },
        ) as string,
      );
    }
    await next();
  };
}
