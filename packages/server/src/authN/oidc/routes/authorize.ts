import React from "react";

import { ScopeVerifyForm } from "@iguhealth/components";

import * as views from "../../../views/index.js";
import * as codes from "../../db/code/index.js";
import * as scopes from "../../db/scopes/index.js";
import * as oidcConst from "../constants.js";
import { OIDC_ROUTES } from "../constants.js";
import { OIDCRouteHandler } from "../index.js";
import { OIDCError } from "../middleware/oauth_error_handling.js";
import * as parseScopes from "../scopes/parse.js";
import { isInvalidRedirectUrl } from "../utilities/checkRedirectUrl.js";

const SUPPORTED_CODE_CHALLENGE_METHODS = ["S256"];

/**
 * Note can be POST or GET. With Post parameters are extracted from body. 
 * See https://openid.net/specs/openid-connect-core-1_0.html#AuthRequest.
 * 
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
export function authorize(): OIDCRouteHandler {
  return async (ctx) => {
    const redirectUrl = ctx.state.oidc.parameters.redirect_uri;
    const client = ctx.state.oidc.client;
    if (!client) {
      throw new OIDCError({
        error: "invalid_request",
        error_description: "Client not found.",
      });
    }
    if (isInvalidRedirectUrl(redirectUrl, client)) {
      throw new OIDCError({
        error: "invalid_request",
        error_description: `Redirect URI '${redirectUrl}' not found.`,
      });
    }

    if (await ctx.state.oidc.isAuthenticated(ctx)) {
      const state = ctx.state.oidc.parameters.state;
      const code_challenge = ctx.state.oidc.parameters.code_challenge;
      const code_challenge_method =
        ctx.state.oidc.parameters.code_challenge_method ?? "plain";

      if (
        SUPPORTED_CODE_CHALLENGE_METHODS.indexOf(code_challenge_method) === -1
      ) {
        throw new OIDCError({
          error: "invalid_request",
          error_description: `Code challenge method '${code_challenge_method}' not supported.`,
          state,
          redirect_uri: redirectUrl,
        });
      }
      if (!client.id) {
        throw new OIDCError({
          error: "invalid_request",
          error_description: `Client ID not found.`,
          state,
          redirect_uri: redirectUrl,
        });
      }
      const userId = ctx.state.oidc.user?.id;
      if (!userId) {
        throw new OIDCError({
          error: "invalid_request",
          error_description: `User ID not found.`,
          state,
          redirect_uri: redirectUrl,
        });
      }
      const approvedScopes = await scopes.getApprovedScope(
        ctx.state.iguhealth.db,
        ctx.state.iguhealth.tenant,
        client.id,
        userId,
      );

      // If Scopes are misaligned redirect to scope verify page.
      if (
        parseScopes.toString(approvedScopes) !==
        parseScopes.toString(ctx.state.oidc.scopes ?? [])
      ) {
        const scopeRoute = ctx.router.url(
          OIDC_ROUTES.SCOPE_GET,
          { tenant: ctx.state.iguhealth.tenant },
          { query: ctx.state.oidc.parameters },
        );
        if (scopeRoute instanceof Error) throw scopeRoute;
        ctx.redirect(scopeRoute);
        return;
      }

      const code = await codes.create(
        ctx.state.iguhealth.db,
        ctx.state.iguhealth.tenant,
        {
          type: "oauth2_code_grant",
          client_id: client.id,
          tenant: ctx.state.iguhealth.tenant,
          // Should be safe to use here as is authenticated so user should be populated.
          user_id: ctx.state.oidc.user?.id as string,
          pkce_code_challenge: code_challenge,
          redirect_uri: redirectUrl,
          pkce_code_challenge_method: code_challenge_method as "S256" | "plain",
          expires_in: "15 minutes",
        },
      );

      ctx.redirect(`${redirectUrl}?code=${code.code}&state=${state}`);
    } else {
      ctx.redirect(
        ctx.router.url(
          OIDC_ROUTES.LOGIN_GET,
          {
            tenant: ctx.state.iguhealth.tenant,
          },
          { query: ctx.state.oidc.parameters },
        ) as string,
      );
    }
  };
}
