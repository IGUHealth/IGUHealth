import type * as Koa from "koa";
import * as db from "zapatos/db";
import * as s from "zapatos/schema";

import { code, id } from "@iguhealth/fhir-types/r4/types";
import {
  AccessTokenPayload,
  CUSTOM_CLAIMS,
  IDTokenPayload,
  IGUHEALTH_ISSUER,
  Subject,
  createToken,
} from "@iguhealth/jwt";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { KoaContext } from "../../../fhir-api/types.js";
import { FHIRTransaction } from "../../../fhir-storage/transactions.js";
import {
  getCertKey,
  getCertLocation,
  getSigningKey,
} from "../../certifications.js";
import {
  authenticateClientCredentials,
  createClientCredentialToken,
  getClientCredentials,
} from "../client_credentials_verification.js";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/**
 * Returns an access token that can be used to access protected resources.
 */
export function tokenPost<
  State,
  C extends Koa.DefaultContext,
>(): Koa.Middleware<State, KoaContext.FHIR<C>> {
  return async (ctx) => {
    const body = (ctx.request as unknown as Record<string, unknown>).body;
    if (!isRecord(body)) {
      throw new OperationError(
        outcomeError("invalid", "Body must be a record."),
      );
    }

    if (!ctx.oidc.client) {
      throw new OperationError(
        outcomeError("invalid", "Could not find client in context."),
      );
    }

    if (
      !ctx.oidc.client?.grantType.includes(body.grant_type?.toString() as code)
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
          ctx.FHIRContext,
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

            const code = await ctx.oidc.codeManagement.search(fhirContext, {
              code: body.code,
            });

            if (code.length !== 1 || code[0].is_expired)
              throw new OperationError(outcomeError("invalid", "Invalid code"));
            if (code[0].client_id !== ctx.oidc.client?.id)
              throw new OperationError(
                outcomeError("invalid", "Invalid client"),
              );

            const user = await ctx.oidc.userManagement.get(
              fhirContext,
              code[0].user_id,
            );

            if (!user)
              throw new OperationError(outcomeError("invalid", "Invalid user"));

            await ctx.oidc.codeManagement.delete(fhirContext, {
              id: code[0].id,
            });

            const signingKey = await getSigningKey(
              getCertLocation(),
              getCertKey(),
            );

            const accessTokenPayload: AccessTokenPayload<s.user_role> = {
              iss: IGUHEALTH_ISSUER,
              [CUSTOM_CLAIMS.TENANTS]:
                await ctx.oidc.userManagement.getTenantClaims(
                  fhirContext,
                  user.id,
                ),
              [CUSTOM_CLAIMS.RESOURCE_TYPE]: "Membership",
              [CUSTOM_CLAIMS.RESOURCE_ID]:
                (user.fhir_user_id as id) ?? undefined,
              sub: user.id as string as Subject,
              scope: "openid profile email offline_access",
            };

            return {
              access_token: await createToken<AccessTokenPayload<s.user_role>>(
                signingKey,
                accessTokenPayload,
                "2h",
              ),
              id_token: await createToken<IDTokenPayload<s.user_role>>(
                signingKey,
                {
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
                "2h",
              ),
              token_type: "Bearer",
              // 2 hours in seconds
              expires_in: 7200,
            };
          },
        );

        ctx.body = response;
        ctx.status = 200;
        ctx.set("Content-Type", "application/json");
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

        if (!authenticateClientCredentials(ctx.oidc.client, credentials)) {
          throw new OperationError(
            outcomeError("security", "Invalid credentials for client."),
          );
        }

        ctx.body = {
          access_token: await createClientCredentialToken(
            ctx.FHIRContext.tenant,
            ctx.oidc.client,
          ),
          token_type: "Bearer",
          expires_in: 7200,
        };
        ctx.status = 200;
        ctx.set("Content-Type", "application/json");
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
