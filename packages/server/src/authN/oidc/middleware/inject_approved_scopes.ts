import * as Koa from "koa";

import { id } from "@iguhealth/fhir-types/r4/types";

import { KoaExtensions } from "../../../fhir-api/types.js";
import * as scopes from "../../db/scopes/index.js";
import { OIDCError } from "./oauth_error_handling.js";

/**
 * Inject Tenant management into the context.
 * @returns Koa.Middleware
 */
export function injectApprovedScopesMiddleware(): Koa.Middleware<
  KoaExtensions.IGUHealth,
  KoaExtensions.KoaIGUHealthContext
> {
  return async (ctx, next) => {
    if (!ctx.state.oidc.client?.id) {
      throw new OIDCError({
        error: "invalid_client",
        error_description: "Request must have client.",
      });
    }

    if (!ctx.state.oidc.user) {
      throw new OIDCError({
        error: "invalid_request",
        error_description: "Request must have user.",
      });
    }

    scopes.getApprovedScope(
      ctx.state.iguhealth.db,
      ctx.state.iguhealth.tenant,
      ctx.state.oidc.client.id,
      ctx.state.oidc.user.id,
    );
    await next();
  };
}
