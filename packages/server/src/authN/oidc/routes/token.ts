import Ajv from "ajv";
import type * as Koa from "koa";
import crypto from "node:crypto";
import * as db from "zapatos/db";
import * as s from "zapatos/schema";

import { code, id } from "@iguhealth/fhir-types/r4/types";
import {
  AccessTokenPayload,
  CUSTOM_CLAIMS,
  IDTokenPayload,
  Subject,
  TenantId,
  createToken,
} from "@iguhealth/jwt";

import { KoaExtensions } from "../../../fhir-api/types.js";
import { FHIRTransaction } from "../../../fhir-storage/transactions.js";
import {
  getCertKey,
  getCertLocation,
  getSigningKey,
} from "../../certifications.js";
import * as codes from "../../db/code/index.js";
import * as scopes from "../../db/scopes/index.js";
import * as users from "../../db/users/index.js";
import {
  authenticateClientCredentials,
  createClientCredentialToken,
} from "../client_credentials_verification.js";
import { getIssuer } from "../constants.js";
import { OIDCError } from "../middleware/oauth_error_handling.js";
import type { OAuth2TokenBody } from "../schemas/oauth2_token_body.schema.js";
import OAuth2TokenBodySchema from "../schemas/oauth2_token_body.schema.json" with { type: "json" };
import * as parseScopes from "../scopes/parse.js";

function verifyCodeChallenge(code: codes.AuthorizationCode, verifier: string) {
  switch (code.pkce_code_challenge_method) {
    case "S256": {
      const code_challenge_hashed = crypto
        .createHash("sha256")
        .update(verifier ?? "")
        .digest("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

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

function getIDTokenPayload(
  user: users.User,
  approvedScopes: parseScopes.Scope[],
):
  | Pick<
      IDTokenPayload<s.user_role>,
      "email" | "email_verified" | "name" | "given_name" | "family_name"
    >
  | undefined {
  if (!approvedScopes.find((v) => v.type === "openid")) {
    return undefined;
  }
  const idTokenPayload: Partial<IDTokenPayload<s.user_role>> = {};
  if (approvedScopes.find((v) => v.type === "email")) {
    idTokenPayload.email = user.email;
    idTokenPayload.email_verified = user.email_verified
      ? user.email_verified
      : false;
  }
  if (approvedScopes.find((v) => v.type === "profile")) {
    idTokenPayload.name = [user.first_name, user.last_name]
      .filter((v) => v !== null && v !== undefined)
      .join(" ");
    idTokenPayload.given_name = user.first_name ?? undefined;
    idTokenPayload.family_name = user.last_name ?? undefined;
  }

  return idTokenPayload;
}

/**
 * Returns an access token that can be used to access protected resources.
 */
export function tokenPost<
  State extends KoaExtensions.IGUHealth,
  C extends KoaExtensions.KoaIGUHealthContext,
>(): Koa.Middleware<State, C> {
  return async (ctx) => {
    const clientApplication = ctx.state.oidc.client;
    if (!clientApplication?.id) {
      throw new OIDCError({
        error: "invalid_client",
        error_description: "Could not find client.",
      });
    }
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

    /**
     * Validate grant type aligns with the client.
     */
    if (
      !clientApplication.grantType.includes(
        tokenParameters.grant_type?.toString() as code,
      )
    ) {
      throw new OIDCError({
        error: "unsupported_grant_type",
        error_description: `Grant type not supported by client : '${tokenParameters.grant_type}'`,
      });
    }

    switch (tokenParameters.grant_type) {
      // https://www.rfc-editor.org/rfc/rfc6749.html#section-4.1
      case "authorization_code": {
        const response = await FHIRTransaction(
          ctx.state.iguhealth,
          db.IsolationLevel.Serializable,
          async (fhirContext) => {
            const code = await codes.search(
              fhirContext.db,
              fhirContext.tenant,
              {
                code: tokenParameters.code,
              },
            );

            if (
              tokenParameters.client_id &&
              tokenParameters.client_secret &&
              !authenticateClientCredentials(clientApplication, {
                client_id: tokenParameters.client_id,
                client_secret: tokenParameters.client_secret,
              })
            ) {
              throw new OIDCError({
                error: "invalid_client",
                error_description: "Invalid credentials for client.",
              });
            }

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

            const user = await users.get(
              fhirContext.db,
              fhirContext.tenant,
              code[0].user_id,
            );

            if (!user)
              throw new OIDCError({
                error: "invalid_grant",
                error_description: "Invalid user",
              });

            await codes.remove(fhirContext.db, fhirContext.tenant, {
              id: code[0].id,
            });

            const signingKey = await getSigningKey(
              getCertLocation(),
              getCertKey(),
            );

            const accessTokenPayload: AccessTokenPayload<s.user_role> = {
              iss: getIssuer(ctx.state.iguhealth.tenant),
              aud: clientApplication?.id,
              [CUSTOM_CLAIMS.TENANT]: user.tenant as TenantId,
              [CUSTOM_CLAIMS.ROLE]: user.role,
              [CUSTOM_CLAIMS.RESOURCE_TYPE]: "Membership",
              [CUSTOM_CLAIMS.RESOURCE_ID]:
                (user.fhir_user_id as id) ?? undefined,
              sub: user.id as Subject,
            };

            const approvedScopes = await scopes.getApprovedScope(
              fhirContext.db,
              ctx.state.iguhealth.tenant,
              clientApplication.id,
              code[0].user_id,
            );

            const idTokenPayload = getIDTokenPayload(user, approvedScopes);

            const body = {
              scope: parseScopes.toString(approvedScopes),
              access_token: await createToken<AccessTokenPayload<s.user_role>>({
                signingKey,
                payload: accessTokenPayload,
                expiresIn: `2h`,
              }),
              id_token: idTokenPayload
                ? await createToken<IDTokenPayload<s.user_role>>({
                    signingKey: signingKey,
                    payload: { ...accessTokenPayload, ...idTokenPayload },
                    expiresIn: `2h`,
                  })
                : undefined,
              token_type: "Bearer",
              // 2 hours in seconds
              expires_in: 7200,
            };

            return body;
          },
        );

        ctx.body = response;
        ctx.status = 200;
        ctx.set("pragma", "no-cache");
        ctx.set("cache-control", "no-store");
        ctx.set("Content-Type", "application/json; charset=utf-8");
        return;
      }
      // https://www.rfc-editor.org/rfc/rfc6749.html#section-6
      case "refresh_token": {
        throw new Error("Not Implemented");
      }
      // https://www.rfc-editor.org/rfc/rfc6749.html#section-4.4
      case "client_credentials": {
        if (!tokenParameters.client_secret || !tokenParameters.client_id) {
          throw new OIDCError({
            error: "invalid_request",
            error_description: "Could not find credentials in request.",
          });
        }

        if (
          !authenticateClientCredentials(clientApplication, {
            client_id: tokenParameters.client_id,
            client_secret: tokenParameters.client_secret,
          })
        ) {
          throw new OIDCError({
            error: "invalid_client",
            error_description: "Invalid credentials for client.",
          });
        }

        ctx.body = {
          access_token: await createClientCredentialToken(
            ctx.state.iguhealth.tenant,
            clientApplication,
          ),
          token_type: "Bearer",
          expires_in: 7200,
        };
        ctx.status = 200;
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
