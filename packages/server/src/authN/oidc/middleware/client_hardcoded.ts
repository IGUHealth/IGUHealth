import * as Koa from "koa";

import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { KoaExtensions } from "../../../fhir-api/types.js";
import { ADMIN_APP } from "../hardcodedClients/admin-app.js";

export function injectHardcodedClients<
  State extends KoaExtensions.OIDC,
  C extends KoaExtensions.DefaultContext,
>(): Koa.Middleware<State, C> {
  return async (ctx, next) => {
    const clientId = ctx.state.oidc.parameters.client_id;

    if (!clientId || clientId === "") {
      throw new OperationError(
        outcomeError("invalid", "Request must have client_id."),
      );
    }

    switch (clientId) {
      case ADMIN_APP()?.id: {
        ctx.state.oidc.client = ADMIN_APP();
        await next();
        return;
      }
      default: {
        await next();
        return;
      }
    }
  };
}
