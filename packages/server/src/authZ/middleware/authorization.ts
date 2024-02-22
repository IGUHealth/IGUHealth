import { FHIRRequest } from "@iguhealth/client/lib/types";
import type { MiddlewareAsync } from "@iguhealth/client/middleware";
import { AccessPolicyAccess, code } from "@iguhealth/fhir-types/r4/types";
import {
  OperationError,
  outcomeError,
  outcomeFatal,
} from "@iguhealth/operation-outcomes";

import { FHIRServerCTX } from "../../fhir-context/types.js";

/**
 * Determine whether or not the policy access has access to the resource type.
 * @param policyAccess Policy access to evaluate
 * @param request The FHIR Request.
 * @returns Whether or not the policy has access to the resource type.
 */
function validateFHIRResourceTypeAccess(
  policyAccess: AccessPolicyAccess,
  request: FHIRRequest,
): boolean {
  switch (request.level) {
    case "system": {
      switch (request.type) {
        case "invoke-request":
        case "history-request": {
          return (
            policyAccess.fhir?.resourceType?.includes("Any" as code) || false
          );
        }
        case "search-request": {
          if (policyAccess.fhir?.resourceType?.includes("Any" as code)) {
            return true;
          }
          const _type = request.parameters
            .filter((v) => v.name === "_type")
            .flatMap((p) => p.value);

          if (_type.length === 0) return false;
          for (const type of _type) {
            if (
              !policyAccess.fhir?.resourceType?.includes(
                type.toString() as code,
              )
            ) {
              return false;
            }
          }
          return true;
        }

        // Capabilities does not require a resource type.
        case "capabilities-request": {
          return true;
        }

        // Batch and transaction hit authorization again per request.
        case "transaction-request":
        case "batch-request": {
          return true;
        }
        default:
          throw new OperationError(
            outcomeFatal(
              "invalid",
              "Invalid request.type on system access policy evaluation",
            ),
          );
      }
    }

    case "instance":
    case "type": {
      // Special code "Any" means access to all resource types.
      if (policyAccess.fhir?.resourceType?.includes("Any" as code)) return true;

      return (policyAccess.fhir?.resourceType ?? []).includes(
        request.resourceType as code,
      );
    }
  }
}

/**
 * Converts the Accesspolicy API Method into the internal FHIR.type
 * @param method Code pulled from https://iguhealth.app/fhir/ValueSet/AccessPolicyFHIRAPIMethod|4.0.1.
 * @returns FHIRRequest type.
 */
function accessPolicyMethodToRequestType(
  method: code | undefined,
): FHIRRequest["type"] | undefined {
  switch (method) {
    case "vread":
      return "vread-request";
    case "update":
      return "update-request";
    case "patch":
      return "patch-request";
    case "delete":
      return "delete-request";
    case "history":
      return "history-request";
    case "create":
      return "create-request";
    case "capabilities":
      return "capabilities-request";
    case "batch":
      return "batch-request";
    case "transaction":
      return "transaction-request";
    case "read":
      return "read-request";
    case "search":
      return "search-request";
    default:
      return undefined;
  }
}

/**
 * Determines whether or not a policy access applies to a given request fhir method.
 * @param policyAccess Policy access to evaluate
 * @param request The FHIR Request.
 * @returns Whether or not access is granted to the method.
 */
function validateFHIRMethodAccess(
  policyAccess: AccessPolicyAccess,
  request: FHIRRequest,
): boolean {
  return (
    accessPolicyMethodToRequestType(policyAccess.fhir?.method) === request.type
  );
}

/**
 * Evaluates a users access to request. Bases this around ctx.user.accessPolicies
 * Note that for multiple access policies the logic is OR.
 * @param ctx Server context.
 * @param request  The FHIR request being made.
 * @returns boolean as to whether or not a user is being granted access.
 */
function evaluateAccessPolicy(
  ctx: FHIRServerCTX,
  request: FHIRRequest,
): boolean {
  for (const accessPolicy of ctx.user.accessPolicies ?? []) {
    switch (accessPolicy.type) {
      case "fhir-rest": {
        const access = accessPolicy.access?.find((access) => {
          return (
            validateFHIRMethodAccess(access, request) &&
            validateFHIRResourceTypeAccess(access, request)
          );
        });
        // [TODO] should probably add this to context to state in the request why access was granted.
        if (access) return true;
        break;
      }
      case "full-access": {
        return true;
      }
      default: {
        throw new OperationError(
          outcomeError(
            "invalid",
            "Could not evaluate access policy with given accessType.",
          ),
        );
      }
    }
  }

  return false;
}

/**
 * Evaluates a users access to request. If super admin bypasses accesspolicy evaluation.
 * Else access based on policies associated to a user.
 * @param ctx Server context.
 * @param request  The FHIR request being made.
 * @returns boolean as to whether or not a user is being granted access.
 */
function canUserMakeRequest(ctx: FHIRServerCTX, request: FHIRRequest): boolean {
  if (ctx.user.role === "admin" || ctx.user.role === "owner") return true;
  return evaluateAccessPolicy(ctx, request);
}

/**
 * Middleware to evaluate access policy access.
 * @param context Current state, server context and request information.
 * @param next Next middleware
 * @returns context with response.
 */
export function createAuthorizationMiddleWare<T>(): MiddlewareAsync<
  T,
  FHIRServerCTX
> {
  return async (context, next) => {
    if (!next) throw new Error("Next must be present on access policy access");

    if (canUserMakeRequest(context.ctx, context.request)) {
      return next(context);
    }

    throw new OperationError(outcomeError("security", "access-denied"));
  };
}
