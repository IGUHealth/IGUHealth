import v2AccessControl from "@iguhealth/access-control/v2";
import { FHIRRequest } from "@iguhealth/client/lib/types";
import { MiddlewareAsyncChain } from "@iguhealth/client/middleware";
import {
  OperationError,
  outcomeError,
  outcomeFatal,
} from "@iguhealth/operation-outcomes";

import * as parseScopes from "../../authN/oidc/scopes/parse.js";
import { IGUHealthServerCTX, asRoot } from "../../fhir-server/types.js";
import { generatePatientScopePolicy } from "./patient-scopes.js";
import { FHIR_VERSION } from "@iguhealth/fhir-types/versions";

/**
 * Note that request types like patch and update-request will be treated as update. Same with read vread and history + search.
 * This function converts those fhir request types to smart resource scope permissions.
 * @param request Request type to scope type permission.
 * @returns https://build.fhir.org/ig/HL7/smart-app-launch/scopes-and-launch-context.html resource scope type from request type.
 */
function requestTypeToScope(
  request: FHIRRequest<FHIR_VERSION>,
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
      throw new OperationError(
        outcomeFatal(
          "exception",
          `Invalid request type '${request.type}' for smart scopes.`,
        ),
      );
    }
  }
}

function fitsResourceType(
  scope: parseScopes.SMARTResourceScope,
  request: FHIRRequest<FHIR_VERSION>,
): boolean {
  if (scope.scope === "all") return true;
  if (request.level === "type" || request.level === "instance") {
    return scope.resourceType === request.resource;
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
  request: FHIRRequest<FHIR_VERSION>,
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
  return async function validateScopesMiddleware(context, next) {
    switch (context.request.type) {
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
        const smartScope = getHighestValueScopeForRequest(
          context.ctx.user.scope ?? [],
          context.request,
        );

        if (!smartScope) {
          throw new OperationError(
            outcomeError(
              "forbidden",
              `No approved scopes found for request ${context.request.type}`,
            ),
          );
        }

        switch (smartScope.level) {
          // Already established that the user has access to the resource type.
          // because of existant of the smartScope so pass allong to authorization.
          case "patient": {
            switch (context.request.type) {
              case "create-request":
              case "update-request":
              case "delete-request":
              case "search-request":
              case "read-request": {
                const patientPolicy = await generatePatientScopePolicy(
                  context.ctx,
                  smartScope,
                  context.request,
                );

                const evaluation = await v2AccessControl(
                  {
                    clientCTX: asRoot(context.ctx),
                    client: context.ctx.client,
                    environment: {
                      request: context.request,
                      user: context.ctx.user,
                    },
                    attributes: {},
                  },
                  [patientPolicy],
                );

                // context.ctx.logger.info({
                //   policy: patientPolicy,
                //   request: context.request,
                // });

                // If operationoutcome returns either an error or fatal issue, throw an error.
                // It means authorization was not successful.
                if (
                  evaluation.issue?.find(
                    (issue) =>
                      issue.severity === "error" || issue.severity === "fatal",
                  )
                ) {
                  throw new OperationError(evaluation);
                }

                return next(context);
              }
              default: {
                throw new OperationError(
                  outcomeError("forbidden", "Forbidden"),
                );
              }
            }
          }
          case "user":
          case "system": {
            switch (context.request.type) {
              case "create-request":
              case "read-request":
              case "update-request":
              case "delete-request":
              case "vread-request":
              case "patch-request":
              case "history-request":
              case "search-request": {
                return next(context);
              }
              default: {
                throw new OperationError(
                  outcomeFatal("invalid", "Invalid request.type"),
                );
              }
            }
          }
          default: {
            throw new OperationError(outcomeFatal("invalid", "invalid scope"));
          }
        }
      }
    }
  };
}

export function createInjectScopesMiddleware<T>(): MiddlewareAsyncChain<
  T,
  IGUHealthServerCTX
> {
  return async function scopesMiddleware(context, next) {
    context.ctx.user.scope = parseScopes.parseScopes(
      context.ctx.user.payload.scope,
    );

    return next(context);
  };
}
