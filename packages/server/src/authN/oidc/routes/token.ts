import type * as Koa from "koa";
import * as db from "zapatos/db";
import * as s from "zapatos/schema";

import {
  AccessTokenPayload,
  CUSTOM_CLAIMS,
  IDTokenPayload,
  IGUHEALTH_ISSUER,
  Subject,
  createToken,
} from "@iguhealth/jwt";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { KoaContext } from "../../../fhir-context/types.js";
import { getSigningKey } from "../../certifications.js";
import { getCredentialsBasicHeader } from "../../utilities.js";

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

    if (body.grant_type !== ctx.oidc.client?.grantType) {
      throw new OperationError(
        outcomeError(
          "invalid",
          `Only grant type: '${ctx.oidc.client?.grantType}' is supported for registered client.`,
        ),
      );
    }

    switch (body.grant_type) {
      // https://www.rfc-editor.org/rfc/rfc6749.html#section-4.1
      case "authorization_code": {
        const body = (ctx.request as unknown as Record<string, unknown>).body;

        const response = await db.serializable(
          ctx.postgres,
          async (txnClient) => {
            if (!isRecord(body))
              throw new OperationError(
                outcomeError("invalid", "Body must be a record."),
              );
            if (typeof body.code !== "string") {
              throw new OperationError(
                outcomeError("invalid", "Code must be present and a string."),
              );
            }

            const code = await ctx.oidc.codeManagement.search(txnClient, {
              code: body.code,
            });

            if (code.length !== 1 || code[0].is_expired)
              throw new OperationError(outcomeError("invalid", "Invalid code"));
            if (code[0].client_id !== ctx.oidc.client?.id)
              throw new OperationError(
                outcomeError("invalid", "Invalid client"),
              );

            const user = await ctx.oidc.userManagement.get(
              txnClient,
              code[0].user_id,
            );

            if (!user)
              throw new OperationError(outcomeError("invalid", "Invalid user"));

            await ctx.oidc.codeManagement.delete(txnClient, { id: code[0].id });

            const signingKey = await getSigningKey(
              process.env.AUTH_LOCAL_CERTIFICATION_LOCATION as string,
              process.env.AUTH_LOCAL_SIGNING_KEY as string,
            );

            const accessTokenPayload: AccessTokenPayload<s.user_role> = {
              iss: IGUHEALTH_ISSUER,
              [CUSTOM_CLAIMS.TENANTS]:
                await ctx.oidc.userManagement.getTenantClaims(
                  txnClient,
                  user.id,
                ),
              [CUSTOM_CLAIMS.RESOURCE_TYPE]: "Membership",
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
        const credentials = getCredentialsBasicHeader(ctx.request);

        if (ctx.oidc.client.grantType !== "client_credentials") {
          throw new OperationError(
            outcomeError(
              "invalid",
              "Grant type must be client_credentials for registered client.",
            ),
          );
        }

        if (!credentials) {
          throw new OperationError(
            outcomeError("invalid", "Could not find credentials in request."),
          );
        }

        if (credentials?.client_id !== ctx.oidc.client?.id) {
          throw new OperationError(
            outcomeError("security", "Invalid credentials for client."),
          );
        }

        if (credentials?.client_secret !== ctx.oidc.client.secret) {
          throw new OperationError(
            outcomeError("security", "Invalid credentials for client."),
          );
        }

        const signingKey = await getSigningKey(
          process.env.AUTH_LOCAL_CERTIFICATION_LOCATION as string,
          process.env.AUTH_LOCAL_SIGNING_KEY as string,
        );

        const accessTokenPayload: AccessTokenPayload<s.user_role> = {
          iss: IGUHEALTH_ISSUER,
          [CUSTOM_CLAIMS.TENANTS]: [
            {
              id: ctx.FHIRContext.tenant,
              userRole: "member",
            },
          ],
          [CUSTOM_CLAIMS.RESOURCE_TYPE]: "ClientApplication",
          sub: ctx.oidc.client.id as string as Subject,
          scope: "openid profile email offline_access",
        };

        ctx.body = {
          access_token: await createToken<AccessTokenPayload<s.user_role>>(
            signingKey,
            accessTokenPayload,
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
