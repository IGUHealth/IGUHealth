import type * as Koa from "koa";
import * as db from "zapatos/db";

import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";
import { id } from "@iguhealth/fhir-types/r4/types";

import { KoaContext, TenantId } from "../../../fhir-context/types.js";
import { getSigningKey } from "../../certifications.js";
import { createToken } from "../../token.js";
import GlobalAuthorizationCodeManagement from "../../db/code/global.js";
import GlobalUserManagement from "../../db/users/global.js";
import { user_role } from "zapatos/schema";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/**
 * Returns an access token that can be used to access protected resources.
 */
export function tokenEndpoint<
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
        const codeManagement = new GlobalAuthorizationCodeManagement();
        const userManagement = new GlobalUserManagement();
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

            const code = await codeManagement.search(txnClient, {
              code: body.code,
            });

            if (code.length !== 1 || code[0].is_expired)
              throw new OperationError(outcomeError("invalid", "Invalid code"));
            if (code[0].client_id !== ctx.oidc.client?.id)
              throw new OperationError(
                outcomeError("invalid", "Invalid client"),
              );

            const user = await userManagement.get(txnClient, code[0].user_id);
            if (!user)
              throw new OperationError(outcomeError("invalid", "Invalid user"));

            await codeManagement.delete(txnClient, { id: code[0].id });

            const signingKey = await getSigningKey(
              process.env.AUTH_LOCAL_CERTIFICATION_LOCATION as string,
              process.env.AUTH_LOCAL_SIGNING_KEY as string,
            );

            const tenantUsers = await userManagement.getTenantUsers(
              txnClient,
              user.id,
            );

            if (tenantUsers.length === 0) {
              throw new OperationError(
                outcomeError("invalid", "User not a member of any tenants."),
              );
            }

            return {
              access_token: await createToken(signingKey, {
                tenant: tenantUsers[0].tenant as TenantId,
                role: tenantUsers[0].role as user_role,
                resourceType: "Membership",
                sub: tenantUsers[0].id as id,
                scope: "openid profile email offline_access",
              }),
              token_type: "Bearer",
              expires_in: 7200,
            };
          },
        );
        ctx.body = response;
        ctx.status = 200;
        ctx.set("Content-Type", "application/json");
      }
      // https://www.rfc-editor.org/rfc/rfc6749.html#section-6
      case "refresh_token": {
        throw new Error("Not Implemented");
      }
      // https://www.rfc-editor.org/rfc/rfc6749.html#section-4.4
      case "client_credentials": {
        throw new Error("Not Implemented");
      }
      default: {
        throw new OperationError(
          outcomeError("invalid", "Grant type not supported"),
        );
      }
    }
  };
}
