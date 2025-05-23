import Ajv from "ajv";
import type * as Koa from "koa";
import crypto from "node:crypto";
import * as s from "zapatos/schema";

import {
  ClientApplication,
  Membership,
  canonical,
  code,
  id,
} from "@iguhealth/fhir-types/r4/types";
import { R4 } from "@iguhealth/fhir-types/versions";
import { getSigningKey } from "@iguhealth/jwt/certifications";
import { createToken } from "@iguhealth/jwt/token";
import {
  AccessTokenPayload,
  CUSTOM_CLAIMS,
  IDTokenPayload,
  JWT,
  Subject,
  TenantId,
} from "@iguhealth/jwt/types";

import { getCertConfig } from "../../../certification.js";
import {
  IGUHealthServerCTX,
  KoaExtensions,
  asRoot,
} from "../../../fhir-server/types.js";
import { AuthorizationCode } from "../../../storage/postgres/authAdmin/codes.js";
import * as scopes from "../../utilities/scopes/index.js";
import {
  authenticateClientCredentials,
  createClientCredentialToken,
} from "../client_credentials_verification.js";
import { getIssuer } from "../constants.js";
import { findClient } from "../middleware/client_find.js";
import { OIDCError } from "../middleware/oauth_error_handling.js";
import type { OAuth2TokenBody } from "../schemas/oauth2_token_body.schema.js";
import OAuth2TokenBodySchema from "../schemas/oauth2_token_body.schema.json" with { type: "json" };
import * as parseScopes from "../scopes/parse.js";
import { ResolvedLaunchParameters } from "./interactions/smartLaunch.js";

export function convertChallenge(
  challenge_method: "S256" | "plain",
  verifier: string,
): string {
  switch (challenge_method) {
    case "S256": {
      const code_challenge_hashed = crypto
        .createHash("sha256")
        .update(verifier ?? "")
        .digest("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

      return code_challenge_hashed;
    }
    case "plain": {
      return verifier;
    }
    default: {
      throw new OIDCError({
        error: "invalid_request",
        error_description: "Plain code challenge is not supported",
      });
    }
  }
}

function verifyCodeChallenge(code: AuthorizationCode, verifier: string) {
  switch (code.pkce_code_challenge_method) {
    case "S256": {
      const code_challenge_hashed = convertChallenge(
        code.pkce_code_challenge_method,
        verifier,
      );

      return code.pkce_code_challenge === code_challenge_hashed;
    }
    case "plain":
    default: {
      throw new OIDCError({
        error: "invalid_request",
        error_description: "Plain code challenge is not supported",
      });
    }
  }
}

/**
 * Verify client is compatible with grants and credentials from token body request.
 * @param tokenBodyRequest Token request body
 * @param client Client Application verifying.
 * @returns throws if client is invalid with optional credentials and grants otherwise returns client.
 */
function verifyClient(
  tokenBodyRequest: OAuth2TokenBody,
  client: ClientApplication | undefined,
): ClientApplication {
  // Verify client exists.
  if (!client?.id) {
    throw new OIDCError({
      error: "invalid_request",
      error_description: `Client not found.`,
    });
  }
  // Check grant types
  if (
    !client.grantType.includes(tokenBodyRequest.grant_type?.toString() as code)
  ) {
    throw new OIDCError({
      error: "unsupported_grant_type",
      error_description: `Grant type not supported by client : '${tokenBodyRequest.grant_type}'`,
    });
  }
  // Verify Client credentials.
  if (
    tokenBodyRequest.client_id &&
    tokenBodyRequest.client_secret &&
    !authenticateClientCredentials(client, {
      client_id: tokenBodyRequest.client_id,
      client_secret: tokenBodyRequest.client_secret,
    })
  ) {
    throw new OIDCError({
      error: "invalid_client",
      error_description: "Invalid credentials for client.",
    });
  }

  return client;
}

function getLaunchParameters(
  code: AuthorizationCode,
): ResolvedLaunchParameters | undefined {
  return (
    code.meta as unknown as undefined | { launch: ResolvedLaunchParameters }
  )?.["launch"];
}

function verifyTokenParameters(body: unknown): body is OAuth2TokenBody {
  const ajv = new Ajv.default({});
  const tokenBodyValidator = ajv.compile(OAuth2TokenBodySchema);
  const bodyValid = tokenBodyValidator(body);
  if (!bodyValid) {
    throw new OIDCError({
      error: "invalid_request",
      error_description: ajv.errorsText(tokenBodyValidator.errors),
    });
  }

  return true;
}

async function getIDTokenPayload(
  member: Membership,
  approvedScopes: parseScopes.Scope[],
): Promise<
  | Pick<
      IDTokenPayload<s.user_role>,
      | "email"
      | "email_verified"
      | "name"
      | "given_name"
      | "family_name"
      | "fhirUser"
    >
  | undefined
> {
  if (!approvedScopes.find((v) => v.type === "openid")) {
    return undefined;
  }

  const idTokenPayload: Partial<IDTokenPayload<s.user_role>> = {};
  if (approvedScopes.find((v) => v.type === "email")) {
    idTokenPayload.email = member.email;
    idTokenPayload.email_verified = member.emailVerified
      ? member.emailVerified
      : false;
  }
  if (approvedScopes.find((v) => v.type === "profile")) {
    idTokenPayload.name = [...(member.name?.given ?? []), member.name?.family]
      .filter((v) => v !== null && v !== undefined)
      .join(" ");
    idTokenPayload.given_name = member.name?.given?.join(" ") ?? undefined;
    idTokenPayload.family_name = member.name?.family ?? undefined;
  }
  if (approvedScopes.find((v) => v.type === "fhirUser")) {
    if (member?.link) {
      idTokenPayload.fhirUser = member.link.reference as canonical;
    }
  }

  return idTokenPayload;
}

/**
 * Creates a refresh token used in refresh_token grant.
 * @param pg Postgres connection
 * @param tenant Current tenant
 * @param client ClientApplication
 * @param user User associated with refresh token
 * @param expires_in when refresh token rexpires
 * @returns
 */
async function createRefreshToken(
  ctx: IGUHealthServerCTX,
  tenant: TenantId,
  client: ClientApplication,
  member: Membership,
  launchParameters?: ResolvedLaunchParameters,
  expires_in: string = "12 hours",
): Promise<AuthorizationCode> {
  const refresh_token = await ctx.store.auth.authorization_code.create(
    ctx,
    tenant,
    {
      type: "refresh_token",
      client_id: client.id,
      tenant: tenant,
      // Should be safe to use here as is authenticated so user should be populated.
      user_id: member.id as id,
      expires_in,
      meta: launchParameters ? { launch: launchParameters } : undefined,
    },
  );

  return refresh_token;
}

/**
 * https://datatracker.ietf.org/doc/html/rfc6749#section-5.1
 */
type Oauth2TokenBodyResponse = {
  access_token: JWT<AccessTokenPayload<s.user_role>>;
  id_token: JWT<IDTokenPayload<s.user_role>>;
  token_type: "Bearer";
  expires_in: number;
  refresh_token?: string;
  scope?: string;
};

async function createTokenResponse({
  member,
  ctx,
  clientApplication,
  launchParameters,
}: {
  member: Membership;
  ctx: IGUHealthServerCTX;
  clientApplication: ClientApplication;
  launchParameters?: ResolvedLaunchParameters;
}): Promise<Oauth2TokenBodyResponse> {
  const signingKey = await getSigningKey(await getCertConfig(ctx.config));
  const approvedScopes = await scopes.getApprovedScope(
    ctx,
    ctx.tenant,
    clientApplication.id as id,
    member.id as id,
  );

  const accesspolicies = await ctx.client.search_type(
    await asRoot(ctx),
    R4,
    "AccessPolicyV2",
    [{ name: "link", value: [member.id as id] }],
  );

  const accessTokenPayload: AccessTokenPayload<s.user_role> = {
    iss: await getIssuer(ctx.config, ctx.tenant),

    // Smart claims.
    patient: launchParameters?.Patient,
    encounter: launchParameters?.Encounter,

    sub: member.id as string as Subject,
    aud: clientApplication.id as id,
    scope: parseScopes.toString(approvedScopes),

    [CUSTOM_CLAIMS.TENANT]: ctx.tenant,
    [CUSTOM_CLAIMS.ROLE]: member.role as s.user_role,
    [CUSTOM_CLAIMS.RESOURCE_TYPE]: "Membership",
    [CUSTOM_CLAIMS.RESOURCE_ID]: member.id as id,
    [CUSTOM_CLAIMS.ACCESS_POLICY_VERSION_IDS]: accesspolicies.resources
      .map((r) => r.meta?.versionId)
      .filter((v) => v !== undefined),
  };
  const idTokenPayload = await getIDTokenPayload(member, approvedScopes);
  const tokenExiration = "1h";

  const body = {
    scope: parseScopes.toString(approvedScopes),
    patient: launchParameters?.Patient,
    encounter: launchParameters?.Encounter,
    access_token: await createToken<AccessTokenPayload<s.user_role>>({
      signingKey,
      payload: accessTokenPayload,
      expiresIn: tokenExiration,
    }),
    id_token: idTokenPayload
      ? await createToken<IDTokenPayload<s.user_role>>({
          signingKey,
          payload: { ...accessTokenPayload, ...idTokenPayload },
          expiresIn: tokenExiration,
        })
      : undefined,
    token_type: "Bearer",
    // 2 hours in seconds
    expires_in: 3600,
  } as Oauth2TokenBodyResponse;

  if (approvedScopes.find((v) => v.type === "offline_access")) {
    body.refresh_token = (
      await createRefreshToken(
        ctx,
        ctx.tenant,
        clientApplication,
        member,
        launchParameters,
      )
    ).code;
  }

  return body;
}

/**
 * Returns an access token that can be used to access protected resources.
 */
export function tokenPost<
  State extends KoaExtensions.IGUHealth,
  C extends KoaExtensions.KoaIGUHealthContext,
>(): Koa.Middleware<State, C> {
  return async (ctx) => {
    const tokenParameters = {
      ...ctx.request.body,
      client_id: ctx.state.oidc.parameters.client_id,
      client_secret: ctx.state.oidc.parameters.client_secret,
    };

    if (!verifyTokenParameters(tokenParameters)) {
      throw new OIDCError({
        error: "invalid_request",
        error_description: "Invalid token body",
      });
    }

    switch (tokenParameters.grant_type) {
      case "refresh_token": {
        const code =
          await ctx.state.iguhealth.store.auth.authorization_code.where(
            await asRoot(ctx.state.iguhealth),
            ctx.state.iguhealth.tenant,
            {
              type: "refresh_token",
              code: tokenParameters.refresh_token,
            },
          );

        if (code.length !== 1 || code[0].is_expired)
          throw new OIDCError({
            error: "invalid_grant",
            error_description: "Invalid code",
          });

        if (!code[0].client_id) {
          throw new OIDCError({
            error: "invalid_request",
            error_description: "Invalid refresh token.",
          });
        }

        const clientApplication = verifyClient(
          tokenParameters,
          await findClient(ctx, code[0].client_id),
        );

        const member = await ctx.state.iguhealth.client.read(
          await asRoot(ctx.state.iguhealth),
          R4,
          "Membership",
          code[0].user_id as id,
        );

        if (!member)
          throw new OIDCError({
            error: "invalid_grant",
            error_description: "Invalid user",
          });

        // Removes the old refresh token and issues a new one in tokenResponse.
        await ctx.state.iguhealth.store.auth.authorization_code.delete(
          await asRoot(ctx.state.iguhealth),
          ctx.state.iguhealth.tenant,
          {
            id: code[0].id,
          },
        );

        const launchParameters = getLaunchParameters(code[0]);

        const tokenBody = await createTokenResponse({
          member,
          ctx: await asRoot(ctx.state.iguhealth),
          clientApplication,
          launchParameters,
        });

        ctx.body = tokenBody;
        ctx.status = 200;
        ctx.set("pragma", "no-cache");
        ctx.set("cache-control", "no-store");
        ctx.set("Content-Type", "application/json; charset=utf-8");
        return;
      }
      // https://www.rfc-editor.org/rfc/rfc6749.html#section-4.1
      case "authorization_code": {
        const clientApplication = verifyClient(
          tokenParameters,
          await findClient(ctx, tokenParameters.client_id),
        );

        const code =
          await ctx.state.iguhealth.store.auth.authorization_code.where(
            await asRoot(ctx.state.iguhealth),
            ctx.state.iguhealth.tenant,
            {
              type: "oauth2_code_grant",
              code: tokenParameters.code,
            },
          );

        if (code.length !== 1 || code[0].is_expired)
          throw new OIDCError({
            error: "invalid_grant",
            error_description: "Invalid code",
          });

        // Ensure the code is bound to the same client
        if (code[0].client_id !== clientApplication?.id)
          throw new OIDCError({
            error: "invalid_client",
            error_description: "Client mismatch",
          });

        if (!verifyCodeChallenge(code[0], tokenParameters.code_verifier)) {
          throw new OIDCError({
            error: "invalid_request",
            error_description: "Invalid code verifier",
          });
        }

        if (code[0].redirect_uri !== tokenParameters.redirect_uri) {
          throw new OIDCError({
            error: "invalid_request",
            error_description: "Invalid redirect uri",
          });
        }

        const member = await ctx.state.iguhealth.client.read(
          await asRoot(ctx.state.iguhealth),
          R4,
          "Membership",
          code[0].user_id as id,
        );

        if (!member)
          throw new OIDCError({
            error: "invalid_grant",
            error_description: "Invalid user",
          });

        await ctx.state.iguhealth.store.auth.authorization_code.delete(
          await asRoot(ctx.state.iguhealth),
          ctx.state.iguhealth.tenant,
          {
            id: code[0].id,
          },
        );

        const launchParameters = getLaunchParameters(code[0]);

        const tokenBody = await createTokenResponse({
          member,
          ctx: await asRoot(ctx.state.iguhealth),
          clientApplication,
          launchParameters,
        });

        ctx.body = tokenBody;
        ctx.status = 200;
        ctx.set("pragma", "no-cache");
        ctx.set("cache-control", "no-store");
        ctx.set("Content-Type", "application/json; charset=utf-8");
        return;
      }
      // https://www.rfc-editor.org/rfc/rfc6749.html#section-4.4
      case "client_credentials": {
        const clientApplication = verifyClient(
          tokenParameters,
          await findClient(ctx, tokenParameters.client_id),
        );

        ctx.body = {
          access_token: await createClientCredentialToken(
            ctx.state.iguhealth,
            clientApplication,
          ),
          token_type: "Bearer",
          expires_in: 3600,
        } as Oauth2TokenBodyResponse;
        ctx.status = 200;
        ctx.set("pragma", "no-cache");
        ctx.set("cache-control", "no-store");
        ctx.set("Content-Type", "application/json; charset=utf-8");
        break;
      }
      default: {
        throw new OIDCError({
          error: "unsupported_grant_type",
          error_description: "Grant type not supported",
        });
      }
    }
  };
}
