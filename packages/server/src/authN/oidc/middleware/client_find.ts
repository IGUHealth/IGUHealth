import * as Koa from "koa";

import { id } from "@iguhealth/fhir-types/r4/types";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { asSystemCTX } from "../../../fhir/context.js";
import { KoaFHIRContext } from "../../../fhir/koa.js";
import { getClientId } from "../../utilities.js";

/**
 * Creates koa middleware that injects the current ClientApplication under ctx.oidc.client.
 * Used in subsequent oidc routes.
 * @returns Koa.Middleware
 */
export function createClientInjectMiddleware<
  State,
  C extends Koa.DefaultContext,
>(): Koa.Middleware<State, KoaFHIRContext<C>> {
  return async (ctx, next) => {
    const clientId = getClientId(ctx.request);

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
    await next();
  };
}
