import type Koa from "koa";

import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { KoaExtensions } from "../../../fhir-server/types.js";
import * as scopes from "../scopes/parse.js";
import { OIDCError } from "./oauth_error_handling.js";

/**
 * Creates koa middleware that injects the current ClientApplication under ctx.state.oidc.client.
 * Used in subsequent oidc routes.
 * @returns Koa.Middleware
 */
export function verifyUserScopes(): Koa.Middleware<
  KoaExtensions.IGUHealth,
  KoaExtensions.KoaIGUHealthContext
> {
  return async (ctx, next) => {
    if (!ctx.state.oidc.client) {
      throw new OperationError(
        outcomeError("invalid", "Request must have client."),
      );
    }

    const userRequestedScopes = scopes
      .toString(ctx.state.oidc.scopes ?? [])
      .split(" ");

    const clientScopes = scopes
      .toString(scopes.parseScopes(ctx.state.oidc.client.scope ?? ""))
      .split(" ");

    for (const userRequestedScope of userRequestedScopes) {
      // Only allow scopes defined on the client.
      if (!clientScopes.includes(userRequestedScope))
        throw new OIDCError({
          error: "invalid_scope",
          error_description: `Scope '${userRequestedScope}' not found on ClientApplication resource.`,
          redirect_uri: ctx.state.oidc.parameters.redirect_uri,
        });
    }

    await next();
  };
}
