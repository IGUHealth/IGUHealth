import validator from "validator";
import * as db from "zapatos/db";
import * as s from "zapatos/schema";

import { AsynchronousClient } from "@iguhealth/client";
import { FHIRClientAsync } from "@iguhealth/client/interface";
import {
  MiddlewareAsync,
  MiddlewareAsyncChain,
  createMiddlewareAsync,
} from "@iguhealth/client/middleware";
import {
  AllInteractions,
  CreateResponse,
  RequestType,
  UpdateResponse,
} from "@iguhealth/client/types";
import { Membership, ResourceType, id } from "@iguhealth/fhir-types/r4/types";
import { R4 } from "@iguhealth/fhir-types/versions";
import { TenantId } from "@iguhealth/jwt";
import {
  OperationError,
  outcomeError,
  outcomeFatal,
} from "@iguhealth/operation-outcomes";

import { IGUHealthServerCTX } from "../../../fhir-server/types.js";
import { QueueBatch } from "../../../transactions.js";
import validateOperationsAllowed from "../../middleware/validate-operations-allowed.js";
import validateResourceTypesAllowedMiddleware from "../../middleware/validate-resourcetype.js";

export const MEMBERSHIP_RESOURCE_TYPES: ResourceType[] = ["Membership"];
export const MEMBERSHIP_METHODS_ALLOWED: RequestType[AllInteractions][] = [
  "create-request",
  "delete-request",
  "read-request",
  "search-request",
  "update-request",
  "history-request",
];

function membershipToUser(
  tenant: TenantId,
  membership: Membership,
): Omit<s.users.Insertable, "password"> {
  const fhir_user_id = membership.id;
  const fhir_user_versionid = membership.meta?.versionId;

  if (!fhir_user_id) {
    throw new OperationError(outcomeFatal("exception", "User id not found"));
  }

  if (!fhir_user_versionid) {
    throw new OperationError(
      outcomeFatal("exception", "User versionId not found"),
    );
  }

  return {
    tenant: tenant,
    email: membership.email,
    method: membership.federated?.reference?.split("/")[1]
      ? "oidc-provider"
      : "email-password",
    role: membership.role as s.user_role,
    fhir_user_id,
    fhir_provider_id: membership.federated?.reference?.split("/")[1] ?? null,
    email_verified: membership.emailVerified,
  };
}

/**
 * Return false if email changed (even if update specifies the email is verified)
 * Return value of update for email_verified if present in update.
 * Else default to current email_verified value.
 * @param update Update to user table
 * @param current Current value in user table
 * @returns whether email is verified.
 */
function determineEmailUpdate(
  update: Pick<s.users.Insertable, "email" | "email_verified">,
  current: s.users.JSONSelectable | undefined,
): s.users.Insertable["email_verified"] {
  // If email has changed.
  if (!current) return false;
  if (update.email !== current.email) return false;
  if ("email_verified" in update) return update.email_verified;

  return current.email_verified;
}

type AuthState = {
  fhirDB: IGUHealthServerCTX["client"];
};

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

function setInTransactionMiddleware<
  State extends AuthState,
  CTX extends IGUHealthServerCTX,
>(): MiddlewareAsyncChain<State, CTX> {
  return async (state, context, next) => {
    return QueueBatch(context.ctx, async (ctx) => {
      return next(state, {
        ...context,
        ctx,
      });
    });
  };
}

/**
 * Creates middleware to limit ownership edits to just owners.
 * @returns MiddlewareAsyncChain
 */
function limitOwnershipEdits<
  State extends AuthState,
  CTX extends IGUHealthServerCTX,
>(): MiddlewareAsyncChain<State, CTX> {
  return async (state, context, next) => {
    const res = await next(state, context);
    const response = res[1].response;
    switch (response?.type) {
      case "create-response":
      case "update-response":
      case "patch-response": {
        if (
          response.body.resourceType === "Membership" &&
          response.body.role === "owner"
        ) {
          if (
            res[1].ctx.user.payload["https://iguhealth.app/role"] !== "owner"
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
      case "delete-response": {
        switch (context.request.level) {
          case "instance": {
            const id = context.request.id;

            const membership = await state.fhirDB.read(
              context.ctx,
              R4,
              "Membership",
              id,
            );

            if (!membership) {
              throw new OperationError(
                outcomeError("not-found", "Membership not found."),
              );
            }

            if (
              membership.role === "owner" &&
              context.ctx.user.payload["https://iguhealth.app/role"] !== "owner"
            ) {
              throw new OperationError(
                outcomeError("forbidden", "Only owners can delete owners."),
              );
            }

            return res;
          }
          default: {
            throw new OperationError(
              outcomeError(
                "not-supported",
                "Only instance level delete is supported for auth types.",
              ),
            );
          }
        }
      }
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
    fhirDB: IGUHealthServerCTX["client"];
  },
  CTX extends IGUHealthServerCTX,
>(): MiddlewareAsyncChain<State, CTX> {
  return async (state, context, next) => {
    switch (context.request.type) {
      case "update-request":
      case "create-request": {
        await customValidationMembership(context.request.body as Membership);
        return next(state, context);
      }
      default: {
        return next(state, context);
      }
    }
  };
}

function setEmailVerified<
  State extends AuthState,
  CTX extends IGUHealthServerCTX,
>(): MiddlewareAsyncChain<State, CTX> {
  return async (state, context, next) => {
    switch (context.request.type) {
      case "create-request": {
        if (context.request.body.resourceType === "Membership") {
          context.request.body.emailVerified = false;
        }
        return next(state, context);
      }
      case "update-request": {
        const membership = context.request.body;
        if (membership.resourceType === "Membership") {
          const existingUser = await db
            .selectOne("users", {
              fhir_user_id: membership.id as string,
            })
            .run(context.ctx.store.getClient());

          context.request.body = {
            ...membership,
            emailVerified: determineEmailUpdate(
              { email: membership.email },
              existingUser,
            ),
          } as Membership;
        }
        return next(state, context);
      }
      case "patch-request": {
        throw new OperationError(
          outcomeError("not-supported", "Patch not supported."),
        );
      }
      default: {
        return next(state, context);
      }
    }
  };
}

function updateUserTableMiddleware<
  State extends AuthState,
  CTX extends IGUHealthServerCTX,
>(): MiddlewareAsyncChain<State, CTX> {
  return async (state, context, next) => {
    // Skip and run other middleware if not membership.
    if (
      !("resource" in context.request) ||
      "Membership" !== context.request.resource
    ) {
      return next(state, context);
    }

    switch (context.request.type) {
      case "create-request": {
        const res = await next(state, context);
        const membership = (res[1].response as CreateResponse<R4>)?.body;
        if (membership.resourceType !== "Membership") {
          throw new OperationError(
            outcomeError("invariant", "Invalid resource type."),
          );
        }

        const userTableUpdate = {
          ...membershipToUser(res[1].ctx.tenant, membership),
        };

        try {
          await res[1].ctx.store.auth.user.create(
            res[1].ctx,
            res[1].ctx.tenant,
            userTableUpdate,
          );
        } catch (e) {
          context.ctx.logger.error(e);
          throw new OperationError(
            outcomeError("invariant", "Failed to create user."),
          );
        }

        return res;
      }
      case "delete-request": {
        switch (context.request.level) {
          case "instance": {
            const id = context.request.id;

            const membership = await state.fhirDB.read(
              context.ctx,
              R4,
              "Membership",
              id,
            );

            if (!membership) {
              throw new OperationError(
                outcomeError("not-found", "Membership not found."),
              );
            }

            const res = await next(state, context);

            await res[1].ctx.store.auth.user.delete(
              res[1].ctx,
              res[1].ctx.tenant,
              {
                tenant: res[1].ctx.tenant,
                fhir_user_id: membership.id,
              },
            );

            return res;
          }
          default: {
            throw new OperationError(
              outcomeError(
                "not-supported",
                "Only instance level delete is supported for auth types.",
              ),
            );
          }
        }
      }
      case "update-request": {
        const res = await next(state, context);
        const membership = (res[1].response as UpdateResponse<R4>)
          .body as Membership;

        const user = membershipToUser(res[1].ctx.tenant, membership);
        await res[1].ctx.store.auth.user.update(
          res[1].ctx,
          res[1].ctx.tenant,
          user.fhir_user_id as id,
          user,
        );

        return res;
      }

      case "read-request":
      case "search-request":
      case "history-request": {
        return next(state, context);
      }
      default: {
        throw new OperationError(
          outcomeFatal("invariant", "Invalid request type."),
        );
      }
    }
  };
}

function createAuthMiddleware<CTX extends IGUHealthServerCTX>(
  state: AuthState,
): MiddlewareAsync<CTX> {
  return createMiddlewareAsync<AuthState, CTX>(state, [
    validateResourceTypesAllowedMiddleware(MEMBERSHIP_RESOURCE_TYPES),
    validateOperationsAllowed(MEMBERSHIP_METHODS_ALLOWED),
    customValidationMembershipMiddleware(),
    setInTransactionMiddleware(),
    setEmailVerified(),
    updateUserTableMiddleware(),
    limitOwnershipEdits(),
    // validateOwnershipMiddleware(),
    async (state, context) => {
      return [
        state,
        {
          ...context,
          response: await state.fhirDB.request(context.ctx, context.request),
        },
      ];
    },
  ]);
}

export function createMembershipClient<CTX extends IGUHealthServerCTX>(
  state: AuthState,
): FHIRClientAsync<CTX> {
  return new AsynchronousClient<CTX>(createAuthMiddleware(state));
}
