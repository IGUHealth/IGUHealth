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
  TENANT_ISSUER,
  TenantId,
  createToken,
} from "@iguhealth/jwt";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { KoaExtensions } from "../../../fhir-api/types.js";
import { FHIRTransaction } from "../../../fhir-storage/transactions.js";
import {
  getCertKey,
  getCertLocation,
  getSigningKey,
} from "../../certifications.js";
import { AuthorizationCode } from "../../db/code/types.js";
import {
  authenticateClientCredentials,
  createClientCredentialToken,
  getClientCredentials,
} from "../client_credentials_verification.js";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function verifyCodeChallenge(code: AuthorizationCode, verifier: string) {
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
      return verifier === code.pkce_code_challenge;
    }
  }
}

/**
 * Returns an access token that can be used to access protected resources.
 */
export function tokenPost<
  State extends KoaExtensions.IGUHealth,
  C extends KoaExtensions.KoaIGUHealthContext,
>(): Koa.Middleware<State, C> {
  return async (ctx) => {
    const body = (ctx.request as unknown as Record<string, unknown>).body;
    if (!isRecord(body)) {
      throw new OperationError(
        outcomeError("invalid", "Body must be a record."),
      );
    }

    if (!ctx.state.oidc.client) {
      throw new OperationError(
        outcomeError("invalid", "Could not find client in context."),
      );
    }

    if (
      !ctx.state.oidc.client?.grantType.includes(
        body.grant_type?.toString() as code,
      )
    ) {
      throw new OperationError(
        outcomeError(
          "invalid",
          `Grant type not supported by client : '${body.grant_type}'`,
        ),
      );
    }

    switch (body.grant_type) {
      // https://www.rfc-editor.org/rfc/rfc6749.html#section-4.1
      case "authorization_code": {
        const body = (ctx.request as unknown as Record<string, unknown>).body;

        const response = await FHIRTransaction(
          ctx.state.iguhealth,
          db.IsolationLevel.Serializable,
          async (fhirContext) => {
            if (!isRecord(body))
              throw new OperationError(
                outcomeError("invalid", "Body must be a record."),
              );
            if (typeof body.code !== "string") {
              throw new OperationError(
                outcomeError("invalid", "Code must be present and a string."),
              );
            }
            if (typeof body.code_verifier !== "string") {
              throw new OperationError(
                outcomeError(
                  "invalid",
                  "Code verifier must be present and a string.",
                ),
              );
            }

            const code = await ctx.state.oidc.codeManagement.search(
              fhirContext,
              {
                code: body.code,
              },
            );

            if (code.length !== 1 || code[0].is_expired)
              throw new OperationError(outcomeError("invalid", "Invalid code"));
            if (code[0].client_id !== ctx.state.oidc.client?.id)
              throw new OperationError(
                outcomeError("invalid", "Invalid client"),
              );

            if (!verifyCodeChallenge(code[0], body.code_verifier)) {
              throw new OperationError(
                outcomeError("forbidden", "Invalid code verifier"),
              );
            }

            const user = await ctx.state.oidc.userManagement.get(
              fhirContext,
              code[0].user_id,
            );

            if (!user)
              throw new OperationError(outcomeError("invalid", "Invalid user"));

            await ctx.state.oidc.codeManagement.delete(fhirContext, {
              id: code[0].id,
            });

            const signingKey = await getSigningKey(
              getCertLocation(),
              getCertKey(),
            );

            const accessTokenPayload: AccessTokenPayload<s.user_role> = {
              iss: TENANT_ISSUER(process.env.API_URL, user.tenant as TenantId),
              aud: ctx.state.oidc.client?.id,
              [CUSTOM_CLAIMS.TENANT]: user.tenant as TenantId,
              [CUSTOM_CLAIMS.ROLE]: user.role as s.user_role,
              [CUSTOM_CLAIMS.RESOURCE_TYPE]: "Membership",
              [CUSTOM_CLAIMS.RESOURCE_ID]:
                (user.fhir_user_id as id) ?? undefined,
              sub: user.id as string as Subject,
            };

            return {
              access_token: await createToken<AccessTokenPayload<s.user_role>>({
                signingKey,
                payload: accessTokenPayload,
                expiresIn: `2h`,
              }),
              id_token: await createToken<IDTokenPayload<s.user_role>>({
                signingKey,
                expiresIn: `2h`,
                payload: {
                  ...accessTokenPayload,
                  email: user.email,
                  email_verified: user.email_verified
                    ? user.email_verified
                    : false,
                  name: [user.first_name, user.last_name]
                    .filter((v) => v !== undefined)
                    .join(" "),
                  given_name: user.first_name ? user.first_name : undefined,
                  family_name: user.last_name ? user.last_name : undefined,
                },
              }),
              token_type: "Bearer",
              // 2 hours in seconds
              expires_in: 7200,
            };
          },
        );

        ctx.body = response;
        ctx.status = 200;
        ctx.set("Content-Type", "application/json; charset=utf-8");
        return;
      }
      // https://www.rfc-editor.org/rfc/rfc6749.html#section-6
      case "refresh_token": {
        throw new Error("Not Implemented");
      }
      // https://www.rfc-editor.org/rfc/rfc6749.html#section-4.4
      case "client_credentials": {
        const credentials = getClientCredentials(ctx.request);

        if (!credentials) {
          throw new OperationError(
            outcomeError("invalid", "Could not find credentials in request."),
          );
        }

        if (
          !authenticateClientCredentials(ctx.state.oidc.client, credentials)
        ) {
          throw new OperationError(
            outcomeError("security", "Invalid credentials for client."),
          );
        }

        ctx.body = {
          access_token: await createClientCredentialToken(
            ctx.state.iguhealth.tenant,
            ctx.state.oidc.client,
          ),
          token_type: "Bearer",
          expires_in: 7200,
        };
        ctx.status = 200;
        ctx.set("Content-Type", "application/json; charset=utf-8");
        break;
      }
      default: {
        throw new OperationError(
          outcomeError("invalid", "Grant type not supported"),
        );
      }
    }
  };
}
