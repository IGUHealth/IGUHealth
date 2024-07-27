import * as Koa from "koa";

import { ClientApplication, id } from "@iguhealth/fhir-types/r4/types";
import { R4 } from "@iguhealth/fhir-types/versions";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { KoaExtensions, asRoot } from "../../../fhir-api/types.js";
import { ADMIN_APP } from "../hardcodedClients/admin-app.js";

async function findClient(
  ctx: Koa.ParameterizedContext<
    KoaExtensions.IGUHealth,
    KoaExtensions.KoaIGUHealthContext
  >,
  clientId: string,
): Promise<ClientApplication | undefined> {
  switch (clientId) {
    case ADMIN_APP()?.id: {
      return ADMIN_APP();
    }
    default: {
      try {
        const clientApp = await ctx.state.iguhealth.client.read(
          asRoot(ctx.state.iguhealth),
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
export function clientInjectFHIRMiddleware(): Koa.Middleware<
  KoaExtensions.IGUHealth,
  KoaExtensions.KoaIGUHealthContext
> {
  return async (ctx, next) => {
    // Could already be injected by hardcoded middleware.
    const clientId = ctx.state.oidc.parameters.client_id;
    if (!clientId) {
      throw new OperationError(
        outcomeError("invalid", "Request must have client_id."),
      );
    }

    const client = await findClient(ctx, clientId);
    if (!client) {
      throw new OperationError(
        outcomeError("login", "ClientApplication not found."),
      );
    }

    ctx.state.oidc = { ...ctx.state.oidc, client };
    await next();
  };
}
