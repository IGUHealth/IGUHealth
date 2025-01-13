import type Koa from "koa";

import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { KoaExtensions } from "../../../fhir-server/types.js";
import { parseScopes } from "../scopes/parse.js";
import { OIDCError } from "./oauth_error_handling.js";

/**
 * Creates koa middleware that injects the current ClientApplication under ctx.state.oidc.client.
 * Used in subsequent oidc routes.
 * @returns Koa.Middleware
 */
export function parseScopesMiddleware(): Koa.Middleware<
  KoaExtensions.IGUHealth,
  KoaExtensions.KoaIGUHealthContext
> {
  return async (ctx, next) => {
    if (!ctx.state.oidc.client) {
      throw new OperationError(
        outcomeError("invalid", "Request must have client."),
      );
    }
    // Could already be injected by hardcoded middleware.
    const scopeString = ctx.state.oidc.parameters.scope;
    if (!scopeString) {
      throw new OperationError(
        outcomeError("invalid", "Request must have scope."),
      );
    }

    try {
      ctx.state.oidc.scopes = parseScopes(scopeString);
    } catch (e) {
      if (e instanceof OIDCError) {
        throw new OIDCError({
          ...e.asJSON(),
          redirect_uri: ctx.state.oidc.parameters.redirect_uri,
        });
      }
      throw e;
    }

    await next();
  };
}
