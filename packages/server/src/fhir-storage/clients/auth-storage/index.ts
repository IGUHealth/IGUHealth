import validator from "validator";

import { AsynchronousClient } from "@iguhealth/client";
import { FHIRClientAsync } from "@iguhealth/client/lib/interface";
import { FHIRRequest } from "@iguhealth/client/lib/types";
import {
  MiddlewareAsync,
  MiddlewareAsyncChain,
  createMiddlewareAsync,
} from "@iguhealth/client/middleware";
import { Membership, ResourceType } from "@iguhealth/fhir-types/r4/types";
import {
  OperationError,
  outcomeError,
  outcomeFatal,
} from "@iguhealth/operation-outcomes";

import { IGUHealthServerCTX } from "../../../fhir-api/types.js";
import validateOperationsAllowed from "../../middleware/validate-operations-allowed.js";
import validateResourceTypesAllowedMiddleware from "../../middleware/validate-resourcetype.js";
import { createRemoteStorage } from "../remote-storage/index.js";

export const MEMBERSHIP_RESOURCE_TYPES: ResourceType[] = ["Membership"];
export const MEMBERSHIP_METHODS_ALLOWED: FHIRRequest["type"][] = [
  "create-request",
  "delete-request",
  "read-request",
  "search-request",
  "update-request",
  "history-request",
];

async function customValidationMembership(
  membership: Membership,
): Promise<void> {
  if (!validator.isEmail(membership.email)) {
    throw new OperationError(
      outcomeError(
        "invalid",
        `Invalid email '${membership.email}' is not valid.`,
      ),
    );
  }
}

/**
 * Creates middleware to limit ownership edits to just owners.
 * @returns MiddlewareAsyncChain
 */
function limitOwnershipEdits<
  State extends {
    fhirDB: ReturnType<typeof createRemoteStorage>;
  },
  CTX extends IGUHealthServerCTX,
>(): MiddlewareAsyncChain<State, CTX> {
  return async (context, next) => {
    const res = await next(context);
    const response = res.response;
    switch (response?.type) {
      case "create-response":
      case "update-response":
      case "patch-response": {
        if (
          response.body.resourceType === "Membership" &&
          response.body.role === "owner"
        ) {
          if (
            context.ctx.user.payload["https://iguhealth.app/role"] !== "owner"
          ) {
            throw new OperationError(
              outcomeError(
                "forbidden",
                "Only owners can create or update owners.",
              ),
            );
          }
        }
        return res;
      }
      case "delete-response":
      case "error-response":
      case "vread-response":
      case "history-response":
      case "read-response":
      case "search-response": {
        return res;
      }
      default: {
        throw new OperationError(
          outcomeFatal("invariant", "Invalid response type."),
        );
      }
    }
  };
}

function customValidationMembershipMiddleware<
  State extends {
    fhirDB: ReturnType<typeof createRemoteStorage>;
  },
  CTX extends IGUHealthServerCTX,
>(): MiddlewareAsyncChain<State, CTX> {
  return async (context, next) => {
    switch (context.request.type) {
      case "update-request":
      case "create-request": {
        await customValidationMembership(context.request.body as Membership);
        return next(context);
      }
      default: {
        return next(context);
      }
    }
  };
}

function createAuthMiddleware<
  State extends {
    fhirDB: ReturnType<typeof createRemoteStorage>;
  },
  CTX extends IGUHealthServerCTX,
>(): MiddlewareAsync<State, CTX> {
  return createMiddlewareAsync<State, CTX>([
    validateResourceTypesAllowedMiddleware(MEMBERSHIP_RESOURCE_TYPES),
    validateOperationsAllowed(MEMBERSHIP_METHODS_ALLOWED),
    customValidationMembershipMiddleware(),
    limitOwnershipEdits(),
    async (context) => {
      const response = await context.state.fhirDB.request(
        context.ctx,
        context.request,
      );

      return {
        ...context,
        response,
      };
    },
  ]);
}

export function createMembershipClient<CTX extends IGUHealthServerCTX>(
  fhirDB: ReturnType<typeof createRemoteStorage>,
): FHIRClientAsync<CTX> {
  return new AsynchronousClient<
    { fhirDB: ReturnType<typeof createRemoteStorage> },
    CTX
  >({ fhirDB }, createAuthMiddleware());
}
