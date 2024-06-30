import * as Koa from "koa";

import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { KoaState } from "../../../fhir-api/types.js";
import { ADMIN_APP } from "../hardcodedClients/admin-app.js";

export function injectHardcodedClients<
  State,
  C extends Koa.DefaultContext,
>(): Koa.Middleware<State, C & KoaState.OIDC> {
  return async (ctx, next) => {
    const clientId = ctx.oidc.parameters.client_id;

    if (!clientId || clientId === "") {
      throw new OperationError(
        outcomeError("invalid", "Request must have client_id."),
      );
    }

    switch (clientId) {
      case ADMIN_APP()?.id: {
        ctx.oidc.client = ADMIN_APP();
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
