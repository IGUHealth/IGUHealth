import React from "react";

import { ScopeVerifyForm } from "@iguhealth/components";

import { asRoot } from "../../../fhir-server/types.js";
import * as views from "../../../views/index.js";
import * as scopes from "../../utilities/scopes/index.js";
import { OIDC_ROUTES } from "../constants.js";
import { OIDCRouteHandler } from "../index.js";
import { OIDCError } from "../middleware/oauth_error_handling.js";
import * as parseScopes from "../scopes/parse.js";
import { isInvalidRedirectUrl } from "../utilities/checkRedirectUrl.js";
import { launchContexts } from "./interactions/smartLaunch.js";

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
    const userId = ctx.state.oidc.user?.fhir_user_id;
    if (!userId) {
      throw new OIDCError({
        error: "invalid_request",
        error_description: `User ID not found.`,
        state,
        redirect_uri: redirectUrl,
      });
    }
    const approvedScopes = await scopes.getApprovedScope(
      ctx.state.iguhealth,
      ctx.state.iguhealth.tenant,
      client.id,
      userId,
    );

    // If Scopes are misaligned redirect to scope verify page.
    if (
      parseScopes.toString(approvedScopes) !==
      parseScopes.toString(ctx.state.oidc.scopes ?? [])
    ) {
      const scopePostURL = ctx.router.url(OIDC_ROUTES.SCOPE_POST, {
        tenant: ctx.state.iguhealth.tenant,
      });
      if (scopePostURL instanceof Error) throw scopePostURL;
      ctx.status = 200;
      ctx.body = views.renderString(
        React.createElement(ScopeVerifyForm, {
          logo: "/public/img/logo.svg",
          title: "IGUHealth",
          client: {
            name: client.name,
            logoUri: client.logoUri,
          },
          authorizeParameters: {
            ...ctx.state.oidc.parameters,
            client_id: client.id,
            response_type: ctx.state.oidc.parameters.response_type as string,
            state: ctx.state.oidc.parameters.state as string,
            code_challenge: ctx.state.oidc.parameters.code_challenge as string,
            code_challenge_method: ctx.state.oidc.parameters
              .code_challenge_method as string,
          },
          postURL: scopePostURL,
        }),
      );
      return;
    }

    const { unResolvedLaunchParameters, resolvedLaunchParameters } =
      launchContexts(ctx, ctx.state.oidc.scopes ?? []);

    if (unResolvedLaunchParameters.length > 0) {
      const smartLaunchURL = ctx.router.url(
        OIDC_ROUTES.SMART_LAUNCH_GET,
        {
          tenant: ctx.state.iguhealth.tenant,
        },
        {
          query: { ...ctx.state.oidc.parameters, ...ctx.state.oidc.launch },
        },
      );
      if (smartLaunchURL instanceof Error) throw smartLaunchURL;
      ctx.redirect(smartLaunchURL);
      return;
    }

    const code = await ctx.state.iguhealth.store.auth.authorization_code.create(
      await asRoot(ctx.state.iguhealth),
      ctx.state.iguhealth.tenant,
      {
        type: "oauth2_code_grant",
        client_id: client.id,
        tenant: ctx.state.iguhealth.tenant,
        // Should be safe to use here as is authenticated so user should be populated.
        user_id: ctx.state.oidc.user?.fhir_user_id as string,
        pkce_code_challenge: code_challenge,
        redirect_uri: redirectUrl,
        pkce_code_challenge_method: code_challenge_method as "S256" | "plain",
        expires_in: "15 minutes",
        meta: { launch: resolvedLaunchParameters },
      },
    );

    ctx.redirect(`${redirectUrl}?code=${code.code}&state=${state}`);
  };
}
