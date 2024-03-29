import * as Koa from "koa";

import { id } from "@iguhealth/fhir-types/r4/types";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { KoaContext, asSystemCTX } from "../../../fhir-context/types.js";

/**
 * Creates koa middleware that injects the current ClientApplication under ctx.oidc.client.
 * Used in subsequent oidc routes.
 * @returns Koa.Middleware
 */
export function clientInjectFHIRMiddleware<State>(): Koa.Middleware<
  State,
  Koa.DefaultContext & KoaContext.OIDC
> {
  return async (ctx, next) => {
    if (!ctx.oidc.client) {
      const clientId = ctx.oidc.parameters.client_id;

      if (!clientId) {
        throw new OperationError(
          outcomeError("invalid", "Request must have client_id."),
        );
      }

      const client = await ctx.FHIRContext.client.read(
        asSystemCTX(ctx.FHIRContext),
        "ClientApplication",
        clientId as id,
      );

      if (!client) {
        throw new OperationError(
          outcomeError("not-found", "No client was registered with given id."),
        );
      }
      ctx.oidc = { ...ctx.oidc, client };
    }
    await next();
  };
}
