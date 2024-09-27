import * as Koa from "koa";

import { R4 } from "@iguhealth/fhir-types/versions";

import { KoaExtensions, asRoot } from "../../../fhir-api/types.js";

/**
 * Creates koa middleware that injects the current ClientApplication under ctx.state.oidc.client.
 * Used in subsequent oidc routes.
 * @returns Koa.Middleware
 */
export function identityProvidersInject(): Koa.Middleware<
  KoaExtensions.IGUHealth,
  KoaExtensions.KoaIGUHealthContext
> {
  return async (ctx, next) => {
    const identityProviders = await ctx.state.iguhealth.client.search_type(
      await asRoot(ctx.state.iguhealth),
      R4,
      "IdentityProvider",
      [{ name: "status", value: ["active"] }],
    );

    ctx.state.oidc = {
      ...ctx.state.oidc,
      identityProviders: identityProviders.resources,
    };
    await next();
  };
}
