import { MiddlewareAsyncChain } from "@iguhealth/client/middleware";
import { id } from "@iguhealth/fhir-types/r4/types";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import * as scopes from "../../authN/db/scopes/index.js";
import * as parseScopes from "../../authN/oidc/scopes/parse.js";
import { IGUHealthServerCTX } from "../../fhir-api/types.js";

export function createValidateScopesMiddleware(): MiddlewareAsyncChain<
  unknown,
  IGUHealthServerCTX
> {
  return async (_context, _next) => {
    throw new Error("Not implemented");
  };
}

export function createInjectScopesMiddleware<T>(): MiddlewareAsyncChain<
  T,
  IGUHealthServerCTX
> {
  return async (context, next) => {
    switch (context.ctx.user.resource?.resourceType) {
      case "Membership": {
        const approvedScopes = await scopes.getApprovedScope(
          context.ctx.db,
          context.ctx.tenant,
          context.ctx.user.payload.aud as id,
          context.ctx.user.payload.sub,
        );
        if (approvedScopes.length === 0) {
          throw new OperationError(
            outcomeError("forbidden", "No approved scopes found"),
          );
        }
        context.ctx.user.scope = approvedScopes;
        return next(context);
      }
      // For non user types just automically set to full access.
      case "OperationDefinition":
      case "ClientApplication": {
        const approvedScopes = parseScopes.parseScopes("user/*.*");
        context.ctx.user.scope = approvedScopes;
        return next(context);
      }
      default: {
        throw new OperationError(outcomeError("forbidden", "Forbidden"));
      }
    }
  };
}
