import * as Koa from "koa";

import { ClientApplication, id } from "@iguhealth/fhir-types/r4/types";
import { R4 } from "@iguhealth/fhir-types/versions";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { KoaExtensions, asRoot } from "../../../fhir-server/types.js";
import getHardCodedClients from "../hardcodedClients/index.js";

export async function findClient(
  ctx: Koa.ParameterizedContext<
    KoaExtensions.IGUHealth,
    KoaExtensions.KoaIGUHealthContext
  >,
  clientId: string,
): Promise<ClientApplication | undefined> {
  const hardcodedClients = await getHardCodedClients(
    ctx.state.iguhealth.config,
  );
  switch (true) {
    case hardcodedClients.find((client) => client.id === clientId) !==
      undefined: {
      return hardcodedClients.find((client) => client.id === clientId);
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
