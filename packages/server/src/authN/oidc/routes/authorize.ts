import Ajv from "ajv";
import React from "react";
import * as db from "zapatos/db";

import { ScopeVerifyForm } from "@iguhealth/components";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import * as views from "../../../views/index.js";
import { OIDC_ROUTES } from "../constants.js";
import { OIDCRouteHandler } from "../index.js";
import { OIDCError } from "../middleware/oauth_error_handling.js";
import type { ScopeVerificationBody } from "../schemas/authorize_scope_body.schema.js";
import ScopeVerificationBodySchema from "../schemas/authorize_scope_body.schema.json" with { type: "json" };
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
  return async (ctx) => {
    const redirectUrl = ctx.state.oidc.parameters.redirect_uri;
    const client = ctx.state.oidc.client;
    if (!client)
      throw new OperationError(outcomeError("invalid", "Client not found."));
    if (isInvalidRedirectUrl(redirectUrl, client)) {
      throw new OperationError(
        outcomeError("invalid", `Redirect URI '${redirectUrl}' not found.`),
      );
    }

    if (await ctx.state.oidc.isAuthenticated(ctx)) {
      // const scope = ctx.request.query.scope;
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

      const approvedScopes = await db
        .selectOne("authorization_scopes", {
          tenant: ctx.state.iguhealth.tenant,
          client_id: client.id,
          user_id: ctx.state.oidc.user?.id,
        })
        .run(ctx.state.iguhealth.db);

      // If Scopes are misaligned.
      if (approvedScopes?.scope !== ctx.state.oidc.parameters.scope) {
        ctx.status = 200;
        ctx.body = views.renderString(
          React.createElement(ScopeVerifyForm, {
            logo: "/public/img/logo.svg",
            title: "IGUHealth",
            scopes: ctx.state.oidc.parameters.scope?.split(" "),
            header: "Scope Verification",
            actionURL: ctx.url,
          }),
        );
        return;
      }

      const code = await ctx.state.oidc.codeManagement.create(
        ctx.state.iguhealth,
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
  };
}

function verifyScopeBody(body: unknown): body is ScopeVerificationBody {
  const ajv = new Ajv.default({});
  const tokenBodyValidator = ajv.compile(ScopeVerificationBodySchema);
  const bodyValid = tokenBodyValidator(body);
  if (!bodyValid) {
    throw new OperationError(
      outcomeError("invalid", ajv.errorsText(tokenBodyValidator.errors)),
    );
  }

  return true;
}

/**
 * Used for verifying the scopes.
 */
export function authorizePOST(): OIDCRouteHandler {
  return async (ctx) => {
    const redirectUrl = ctx.state.oidc.parameters.redirect_uri;
    const client = ctx.state.oidc.client;
    if (!client)
      throw new OperationError(outcomeError("invalid", "Client not found."));
    if (isInvalidRedirectUrl(redirectUrl, client)) {
      throw new OperationError(
        outcomeError("invalid", `Redirect URI '${redirectUrl}' not found.`),
      );
    }

    if (await ctx.state.oidc.isAuthenticated(ctx)) {
      const body = ctx.request.body;
      if (!verifyScopeBody(body)) {
        throw new OperationError(outcomeError("invalid", "Invalid token body"));
      }

      if (body.accept === "on") {
        await db
          .upsert(
            "authorization_scopes",
            [
              {
                tenant: ctx.state.iguhealth.tenant,
                client_id: ctx.state.oidc.client?.id as string,
                user_id: ctx.state.oidc.user?.id as string,
                scope: body.scopes.join(" "),
              },
            ],
            db.constraint("authorization_scopes_pkey"),
            {
              updateColumns: ["scope"],
            },
          )
          .run(ctx.state.iguhealth.db);
        // Redirect back to get request which generates the code etc... as next step.
        ctx.redirect(ctx.url);
      } else {
        throw new OIDCError({
          error: "access_denied",
          error_description: "User did not accept scopes",
          state: ctx.state.oidc.parameters.state,
          redirect_uri: redirectUrl,
        });
      }
    } else {
      throw new OIDCError({
        error: "unauthorized_client",
        error_description: "User is not authorized.",
        state: ctx.state.oidc.parameters.state,
        redirect_uri: redirectUrl,
      });
    }
  };
}
