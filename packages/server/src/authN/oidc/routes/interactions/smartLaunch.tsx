import React from "react";
import ReactDOM from "react-dom/server";
import { user_role } from "zapatos/schema";

import { id } from "@iguhealth/fhir-types/lib/generated/r4/types";
import {
  AllResourceTypes,
  FHIR_VERSION,
  R4,
  ResourceType,
} from "@iguhealth/fhir-types/versions";
import { getSigningKey } from "@iguhealth/jwt/certifications";
import { createToken } from "@iguhealth/jwt/token";
import {
  AccessTokenPayload,
  CUSTOM_CLAIMS,
  Subject,
} from "@iguhealth/jwt/types";

import { createTenantURL } from "../../../../fhir-api/constants.js";
import { asRoot } from "../../../../fhir-api/types.js";
import resolveStatic from "../../../../resolveStatic.js";
import { OIDC_ROUTES, getIssuer } from "../../constants.js";
import { SYSTEM_APP } from "../../hardcodedClients/system-app.js";
import { OIDCRouteHandler } from "../../index.js";
import { OIDCError } from "../../middleware/oauth_error_handling.js";
import * as parseScopes from "../../scopes/parse.js";
import { isInvalidRedirectUrl } from "../../utilities/checkRedirectUrl.js";

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function getLaunchScopes(
  scopes: parseScopes.Scope[],
): parseScopes.LaunchTypeScope[] {
  return scopes.filter((scope) => scope.type === "launch-type");
}

export type ResolvedLaunchParameters = Partial<Record<AllResourceTypes, id>>;

export function launchContexts(
  ctx: Parameters<OIDCRouteHandler>[0],
  scopes: parseScopes.Scope[],
): {
  resolvedLaunchParameters: ResolvedLaunchParameters;
  unResolvedLaunchParameters: parseScopes.LaunchTypeScope[];
} {
  const launchScopes = getLaunchScopes(scopes);
  return {
    resolvedLaunchParameters: launchScopes
      .filter((scope) => {
        const id = ctx.state.oidc.launch?.[`launch/${scope.launchType}`];
        return id !== undefined;
      })
      .reduce(
        (acc: ResolvedLaunchParameters, scope) => ({
          ...acc,
          [capitalize(scope.launchType) as AllResourceTypes]: ctx.state.oidc
            .launch?.[`launch/${scope.launchType}`] as id,
        }),
        {},
      ),

    unResolvedLaunchParameters: launchScopes.filter((scope) => {
      const id = ctx.state.oidc.launch?.[`launch/${scope.launchType}`];
      return id === undefined;
    }),
  };
}

export async function launchView<Version extends FHIR_VERSION>(
  ctx: Parameters<OIDCRouteHandler>[0],
  fhirVersion: Version,
  resourceType: ResourceType<Version>,
) {
  const accesspolicies = await ctx.state.iguhealth.client.search_type(
    await asRoot(ctx.state.iguhealth),
    R4,
    "AccessPolicy",
    [{ name: "link", value: [ctx.state.oidc.user?.fhir_user_id as id] }],
  );
  const accessToken = await createToken<AccessTokenPayload<user_role>>({
    signingKey: await getSigningKey(
      process.env.AUTH_LOCAL_CERTIFICATION_LOCATION,
      process.env.AUTH_LOCAL_SIGNING_KEY,
    ),
    payload: {
      sub: ctx.state.oidc.user?.id as Subject,
      // So for a user to select a patient, they must have the user/Patient.s scope.
      scope: `${ctx.state.oidc.parameters.scope ?? ""} user/SearchParameter.rs`,
      iss: getIssuer(ctx.state.iguhealth.tenant),
      aud: SYSTEM_APP.id as string,
      [CUSTOM_CLAIMS.ROLE]: ctx.state.oidc.user?.role as user_role,
      [CUSTOM_CLAIMS.TENANT]: ctx.state.iguhealth.tenant,
      [CUSTOM_CLAIMS.RESOURCE_TYPE]: "Membership",
      [CUSTOM_CLAIMS.RESOURCE_ID]: ctx.state.oidc.user?.fhir_user_id as id,
      [CUSTOM_CLAIMS.RESOURCE_VERSION_ID]:
        ctx.state.oidc.user?.fhir_user_versionid.toString() as id,
      [CUSTOM_CLAIMS.ACCESS_POLICY_VERSION_IDS]: accesspolicies.resources
        .map((p) => p.meta?.versionId)
        .filter((v) => v !== undefined),
    },
  });

  const variables = {
    API_URL: createTenantURL(ctx.state.iguhealth.tenant),
    ACCESS_TOKEN: accessToken,
    FHIR_VERSION: fhirVersion,
    RESOURCE_TYPE: resourceType,
  };

  const windowScript = `
  window.API_URL = "${variables.API_URL}"; 
  window.ACCESS_TOKEN = "${variables.ACCESS_TOKEN}"; 
  window.FHIR_VERSION = "${variables.FHIR_VERSION}"; 
  window.RESOURCE_TYPE = "${variables.RESOURCE_TYPE}";`;

  return ReactDOM.renderToString(
    <html lang="en">
      <head>
        <style nonce={ctx.state.corsNonce}>
          {resolveStatic("@iguhealth/smart-launch/dist/css/index.css")}
        </style>
      </head>
      <body>
        <div id="root"></div>
        <script
          nonce={ctx.state.corsNonce}
          dangerouslySetInnerHTML={{
            __html: windowScript,
          }}
        ></script>
        <script
          nonce={ctx.state.corsNonce}
          dangerouslySetInnerHTML={{
            __html: resolveStatic("@iguhealth/smart-launch/dist/launch.js"),
          }}
        ></script>
      </body>
    </html>,
  );
}

async function derivePatientFromMembership(
  ctx: Parameters<OIDCRouteHandler>[0],
  scope: parseScopes.LaunchTypeScope,
): Promise<Record<string, id> | undefined> {
  const userId = ctx.state.oidc.user?.fhir_user_id as id | undefined;

  if (scope.launchType === "patient" && userId) {
    const membership = await ctx.state.iguhealth.client.read(
      await asRoot(ctx.state.iguhealth),
      R4,
      "Membership",
      userId,
    );

    if (membership?.link?.reference?.startsWith("Patient/")) {
      return {
        [scope.launchType]: membership.link.reference?.split("/")[1] as id,
      };
    }
  }

  return undefined;
}

export function smartLaunch(): OIDCRouteHandler {
  return async (ctx) => {
    const client = ctx.state.oidc.client;
    if (!client) {
      throw new OIDCError({
        error: "invalid_request",
        error_description: "Client not found.",
      });
    }

    const { unResolvedLaunchParameters } = launchContexts(
      ctx,
      ctx.state.oidc.scopes ?? [],
    );

    if (unResolvedLaunchParameters.length !== 0) {
      // In the event a user is associated to a Patient
      // Auto derive their patient as one linked via membership.

      const userDerived = await derivePatientFromMembership(
        ctx,
        unResolvedLaunchParameters[0],
      );
      if (userDerived !== undefined) {
        ctx.redirect(
          ctx.router.url(
            OIDC_ROUTES.AUTHORIZE_GET,
            {
              tenant: ctx.state.iguhealth.tenant,
            },
            {
              query: {
                ...ctx.state.oidc.parameters,
                // Include the launch parameters derived from the user.
                ...parseScopes.launchScopesToQuery({
                  ...ctx.state.oidc.launch,
                  ...userDerived,
                }),
              },
            },
          ) as string,
        );
      } else {
        ctx.status = 200;
        ctx.body = await launchView(
          ctx,
          R4,
          capitalize(
            unResolvedLaunchParameters[0].launchType,
          ) as ResourceType<R4>,
        );
      }
    } else {
      const redirectUrl = ctx.state.oidc.parameters.redirect_uri;
      if (isInvalidRedirectUrl(redirectUrl, client)) {
        throw new OIDCError({
          error: "invalid_request",
          error_description: `Redirect URI '${redirectUrl}' not found.`,
        });
      }

      throw new OIDCError({
        error: "invalid_request",
        error_description: "No unresolved launch scopes.",
        redirect_uri: redirectUrl,
      });
    }
  };
}
