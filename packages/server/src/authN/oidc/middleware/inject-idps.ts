import * as Koa from "koa";

import { ClientApplication, id } from "@iguhealth/fhir-types/r4/types";
import { R4 } from "@iguhealth/fhir-types/versions";

import { KoaExtensions, asRoot } from "../../../fhir-api/types.js";
import getHardCodedClients from "../hardcodedClients/index.js";

export async function findClient(
  ctx: Koa.ParameterizedContext<
    KoaExtensions.IGUHealth,
    KoaExtensions.KoaIGUHealthContext
  >,
  clientId: string,
): Promise<ClientApplication | undefined> {
  switch (true) {
    case getHardCodedClients().find((client) => client.id === clientId) !==
      undefined: {
      return getHardCodedClients().find((client) => client.id === clientId);
    }
    default: {
      try {
        const clientApp = await ctx.state.iguhealth.client.read(
          await asRoot(ctx.state.iguhealth),
          R4,
          "ClientApplication",
          clientId as id,
        );
        return clientApp;
      } catch (err) {
        return undefined;
      }
    }
  }
}

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
