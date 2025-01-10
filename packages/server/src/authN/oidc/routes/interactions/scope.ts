import * as db from "zapatos/db";

import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { OIDC_ROUTES } from "../../constants.js";
import { OIDCRouteHandler } from "../../index.js";
import { OIDCError } from "../../middleware/oauth_error_handling.js";
import * as parseScopes from "../../scopes/parse.js";
import { isInvalidRedirectUrl } from "../../utilities/checkRedirectUrl.js";

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
    (scope) => scope.type === "launch-type" && scope.launchType === "patient",
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

    const body = ctx.request.body;

    if (body?.accept === "on") {
      const scopes = ctx.state.oidc.scopes ?? [];
      checkPatientScopesForLaunch(scopes);

      await db
        .upsert(
          "authorization_scopes",
          [
            {
              tenant: ctx.state.iguhealth.tenant,
              client_id: ctx.state.oidc.client?.id as string,
              user_id: ctx.state.oidc.user?.id as string,
              scope: parseScopes.toString(scopes),
            },
          ],
          db.constraint("authorization_scopes_pkey"),
          {
            updateColumns: ["scope"],
          },
        )
        .run(ctx.state.iguhealth.store.getClient());

      // Redirect back to get request which generates the code etc... as next step.
      const authorizeRoute = ctx.router.url(OIDC_ROUTES.AUTHORIZE_GET, {
        tenant: ctx.state.iguhealth.tenant,
      });
      if (authorizeRoute instanceof Error) throw authorizeRoute;
      // Setting as 308 to allow POST with Scope body.
      ctx.status = 308;
      ctx.redirect(authorizeRoute);
    } else {
      throw new OIDCError({
        error: "access_denied",
        error_description: "User did not accept scopes",
        state: ctx.state.oidc.parameters.state,
        redirect_uri: redirectUrl,
      });
    }
  };
}
