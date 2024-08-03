import Ajv from "ajv";
import * as db from "zapatos/db";

import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { OIDCRouteHandler } from "../../index.js";
import { OIDCError } from "../../middleware/oauth_error_handling.js";
import type { ScopeVerificationBody } from "../../schemas/authorize_scope_body.schema.js";
import ScopeVerificationBodySchema from "../../schemas/authorize_scope_body.schema.json" with { type: "json" };
import * as scopeParse from "../../scopes/parse.js";
import { isInvalidRedirectUrl } from "../../utilities/checkRedirectUrl.js";

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

export function scopeVerifyPost(): OIDCRouteHandler {
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
        const parsedScopes = scopeParse.toString(
          scopeParse.parseScopes(body.scopes.join(" ")),
        );

        await db
          .upsert(
            "authorization_scopes",
            [
              {
                tenant: ctx.state.iguhealth.tenant,
                client_id: ctx.state.oidc.client?.id as string,
                user_id: ctx.state.oidc.user?.id as string,
                scope: parsedScopes,
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
