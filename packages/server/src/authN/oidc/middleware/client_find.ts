import * as Koa from "koa";

import { id } from "@iguhealth/fhir-types/r4/types";
import { R4 } from "@iguhealth/fhir-types/versions";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import {
  FHIRServerCTX,
  KoaContext,
  asSystemCTX,
} from "../../../fhir-api/types.js";

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

      const client = await (ctx.FHIRContext as FHIRServerCTX).client.read(
        asSystemCTX(ctx.FHIRContext),
        R4,
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
