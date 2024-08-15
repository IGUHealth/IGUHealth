import { FHIRRequest } from "@iguhealth/client/lib/types";
import { MiddlewareAsyncChain } from "@iguhealth/client/middleware";
import {
  OperationError,
  outcomeError,
  outcomeFatal,
} from "@iguhealth/operation-outcomes";

import * as parseScopes from "../../authN/oidc/scopes/parse.js";
import { IGUHealthServerCTX } from "../../fhir-api/types.js";

/**
 * Note that request types like patch and update-request will be treated as update. Same with read vread and history + search.
 * This function converts those fhir request types to smart resource scope permissions.
 * @param request Request type to scope type permission.
 * @returns https://build.fhir.org/ig/HL7/smart-app-launch/scopes-and-launch-context.html resource scope type from request type.
 */
function requestTypeToScope(
  request: FHIRRequest,
): keyof parseScopes.SMARTResourceScope["permissions"] {
  switch (request.type) {
    case "create-request": {
      return "create";
    }
    case "vread-request":
    case "read-request": {
      return "read";
    }
    case "patch-request":
    case "update-request": {
      return "update";
    }
    case "delete-request": {
      return "delete";
    }
    case "history-request":
    case "search-request": {
      return "search";
    }
    default: {
      throw new Error("Not implemented");
    }
  }
}

function fitsResourceType(
  scope: parseScopes.SMARTResourceScope,
  request: FHIRRequest,
): boolean {
  if (scope.scope === "all") return true;
  if (request.level === "type" || request.level === "instance") {
    return scope.resourceType === request.resourceType;
  }
  return false;
}

const smartScopeLevelWeight: Record<
  parseScopes.SMARTResourceScope["level"],
  number
> = {
  system: 3,
  user: 2,
  patient: 1,
};

function getHighestValueScopeForRequest(
  scopes: parseScopes.Scope[],
  request: FHIRRequest,
): parseScopes.SMARTResourceScope | undefined {
  const smartScopes = scopes
    .filter(
      (scope): scope is parseScopes.SMARTResourceScope =>
        scope.type === "smart-resource" &&
        scope.permissions[requestTypeToScope(request)] &&
        fitsResourceType(scope, request),
    )
    .sort(
      (a, b) => smartScopeLevelWeight[b.level] - smartScopeLevelWeight[a.level],
    );

  return smartScopes[0];
}

export function createValidateScopesMiddleware<T>(): MiddlewareAsyncChain<
  T,
  IGUHealthServerCTX
> {
  return async (context, next) => {
    switch (context.request.type) {
      case "create-request":
      case "read-request":
      case "update-request":
      case "delete-request":
      case "vread-request":
      case "patch-request":
      case "history-request":
      case "search-request": {
        const scopes = context.ctx.user.scope;
        const smartScope = getHighestValueScopeForRequest(
          scopes ?? [],
          context.request,
        );

        if (!smartScope) {
          throw new OperationError(
            outcomeError("forbidden", "No approved scopes found"),
          );
        }

        switch (smartScope.level) {
          case "patient": {
            switch (context.request.type) {
              case "create-request":
              case "read-request":
              case "update-request":
              case "delete-request":
              case "search-request":
              default: {
                throw new OperationError(
                  outcomeError("forbidden", "Forbidden"),
                );
              }
            }
          }
          // Already established that the user has access to the resource type.
          // because of existant of the smartScope so pass allong to authorization.
          case "user": {
            return next(context);
          }
          case "system": {
            return next(context);
          }
          default: {
            throw new OperationError(outcomeFatal("invalid", "invalid scope"));
          }
        }
      }
      case "capabilities-request":
      case "transaction-request":
      case "batch-request":
      case "invoke-request": {
        // Note for invoke-request will need to implement custom scopes (SMART does not have a scope for invocation of operations).
        // Batch and transaction hit authorization again per request in Bundle.
        // Capabilities should always be allowed as public.
        return next(context);
      }
      default: {
        throw new OperationError(
          outcomeFatal("invalid", "Invalid request.type"),
        );
      }
    }
  };
}

export function createInjectScopesMiddleware<T>(): MiddlewareAsyncChain<
  T,
  IGUHealthServerCTX
> {
  return async (context, next) => {
    context.ctx.user.scope = parseScopes.parseScopes(
      context.ctx.user.payload.scope,
    );

    return next(context);
  };
}
