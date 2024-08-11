import Ajv from "ajv";
import React from "react";
import * as db from "zapatos/db";

import { ScopeVerifyForm } from "@iguhealth/components";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import * as views from "../../../../views/index.js";
import { OIDC_ROUTES } from "../../constants.js";
import { OIDCRouteHandler } from "../../index.js";
import { OIDCError } from "../../middleware/oauth_error_handling.js";
import type { ScopeVerificationBody } from "../../schemas/authorize_scope_body.schema.js";
import ScopeVerificationBodySchema from "../../schemas/authorize_scope_body.schema.json" with { type: "json" };
import * as parseScopes from "../../scopes/parse.js";
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

function findLaunch(scopes: parseScopes.Scope[]): parseScopes.Scope[] {
  return scopes.filter((scope) => scope.type === "launch");
}

/**
 * https://hl7.org/fhir/smart-app-launch/scopes-and-launch-context.html#standalone-apps
 * Per spec:
 * If an application requests a scope which is restricted to a single patient (e.g., patient/*.rs),
 * and the authorization results in the EHR granting that scope, the EHR SHALL establish a patient in context.
 * The EHR MAY refuse authorization requests including patient/ that do not also include a valid launch/patient scope,
 * or it MAY infer the launch/patient scope.
 *
 * In our case we refuse authorization and throw an error.
 * @param scopes
 * @returns
 */
function checkPatientScopesForLaunch(scopes: parseScopes.Scope[]): boolean {
  const patientLaunch = scopes.find(
    (scope) => scope.type === "launch" && scope.scope === "patient",
  );

  const patientPermissions = scopes.filter(
    (scope) => scope.type === "smart-resource" && scope.level === "patient",
  );

  if (patientPermissions.length > 0 && !patientLaunch) {
    throw new OIDCError({
      error: "invalid_scope",
      error_description: "Patient scopes require a launch/patient scope.",
    });
  }

  return true;
}

export function scopePOST(): OIDCRouteHandler {
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
        const scopes = parseScopes.parseScopes(body.scopes.join(" "));
        const parsedScopes = parseScopes.toString(scopes);
        checkPatientScopesForLaunch(scopes);

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
        const authorizeRoute = ctx.router.url(
          OIDC_ROUTES.AUTHORIZE_GET,
          { tenant: ctx.state.iguhealth.tenant },
          { query: ctx.state.oidc.parameters },
        );
        if (authorizeRoute instanceof Error) throw authorizeRoute;
        ctx.redirect(authorizeRoute);
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

export function scopeGET(): OIDCRouteHandler {
  return async (ctx) => {
    const client = ctx.state.oidc.client;
    if (!client) {
      throw new OIDCError({
        error: "invalid_request",
        error_description: "Client not found.",
      });
    }
    ctx.status = 200;
    ctx.body = views.renderString(
      React.createElement(ScopeVerifyForm, {
        logo: "/public/img/logo.svg",
        title: "IGUHealth",
        client: {
          name: client.name,
          logoUri: client.logoUri,
        },
        scopes: parseScopes.toString(ctx.state.oidc.scopes ?? []).split(" "),
        header: "Scope Verification",
        actionURL: ctx.url,
      }),
    );
  };
}
