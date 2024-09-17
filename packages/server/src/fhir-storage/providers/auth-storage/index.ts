import validator from "validator";
import * as db from "zapatos/db";

import { AsynchronousClient } from "@iguhealth/client";
import { FHIRClientAsync } from "@iguhealth/client/lib/interface";
import {
  FHIRRequest,
  R4CreateResponse,
  R4UpdateResponse,
} from "@iguhealth/client/lib/types";
import {
  MiddlewareAsync,
  MiddlewareAsyncChain,
  createMiddlewareAsync,
} from "@iguhealth/client/middleware";
import { Membership, ResourceType } from "@iguhealth/fhir-types/r4/types";
import { R4 } from "@iguhealth/fhir-types/versions";
import {
  OperationError,
  outcomeError,
  outcomeFatal,
} from "@iguhealth/operation-outcomes";

import * as users from "../../../authN/db/users/index.js";
import {
  determineEmailUpdate,
  membershipToUser,
} from "../../../authN/db/users/utilities.js";
import { IGUHealthServerCTX } from "../../../fhir-api/types.js";
import validateOperationsAllowed from "../../middleware/validate-operations-allowed.js";
import validateResourceTypesAllowedMiddleware from "../../middleware/validate-resourcetype.js";
import { FHIRTransaction } from "../../transactions.js";
import { createPostgresClient } from "../postgres/index.js";

export const AUTH_RESOURCETYPES: ResourceType[] = ["Membership"];
export const AUTH_METHODS_ALLOWED: FHIRRequest["type"][] = [
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

async function gateCheckSingleOwner(ctx: IGUHealthServerCTX) {
  const owners = await ctx.client.search_type(ctx, R4, "Membership", [
    {
      name: "role",
      value: ["owner"],
    },
  ]);

  if (owners.resources.length !== 1) {
    throw new OperationError(
      outcomeError(
        "invariant",
        "Must have a single owner associated to a tenant.",
      ),
    );
  }
}

function validateOwnershipMiddleware<
  State extends {
    fhirDB: ReturnType<typeof createPostgresClient>;
  },
  CTX extends IGUHealthServerCTX,
>(): MiddlewareAsyncChain<State, CTX> {
  return async (context, next) => {
    const res = await next(context);

    switch (context.request.type) {
      case "delete-request":
      case "update-request":
      case "patch-request":
      case "create-request": {
        await gateCheckSingleOwner(context.ctx);
        return res;
      }
      default: {
        return res;
      }
    }
  };
}

function setInTransactionMiddleware<
  State extends {
    fhirDB: ReturnType<typeof createPostgresClient>;
  },
  CTX extends IGUHealthServerCTX,
>(): MiddlewareAsyncChain<State, CTX> {
  return async (context, next) => {
    return FHIRTransaction(
      context.ctx,
      db.IsolationLevel.RepeatableRead,
      async (ctx) => {
        const res = await next({
          ...context,
          ctx,
        });
        return res;
      },
    );
  };
}

/**
 * Creates middleware to limit ownership edits to just owners.
 * @returns MiddlewareAsyncChain
 */
function limitOwnershipEdits<
  State extends {
    fhirDB: ReturnType<typeof createPostgresClient>;
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

      case "delete-response": {
        await gateCheckSingleOwner(context.ctx);
        return res;
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
    fhirDB: ReturnType<typeof createPostgresClient>;
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

function setEmailVerified<
  State extends {
    fhirDB: ReturnType<typeof createPostgresClient>;
  },
  CTX extends IGUHealthServerCTX,
>(): MiddlewareAsyncChain<State, CTX> {
  return async (context, next) => {
    switch (context.request.type) {
      case "create-request": {
        if (context.request.body.resourceType === "Membership") {
          context.request.body.emailVerified = false;
        }
        return next(context);
      }
      case "update-request": {
        const membership = context.request.body;
        if (membership.resourceType === "Membership") {
          const existingUser = await db
            .selectOne("users", {
              fhir_user_id: membership.id as string,
            })
            .run(context.ctx.db);

          context.request.body = {
            ...membership,
            emailVerified: determineEmailUpdate(
              { email: membership.email },
              existingUser,
            ),
          } as Membership;
        }
        return next(context);
      }
      case "patch-request": {
        throw new OperationError(
          outcomeError("not-supported", "Patch not supported."),
        );
      }
      default: {
        return next(context);
      }
    }
  };
}

function updateUserTableMiddleware<
  State extends {
    fhirDB: ReturnType<typeof createPostgresClient>;
  },
  CTX extends IGUHealthServerCTX,
>(): MiddlewareAsyncChain<State, CTX> {
  return async (context, next) => {
    // Skip and run other middleware if not membership.
    if (
      !("resource" in context.request) ||
      "Membership" !== context.request.resource
    ) {
      return next(context);
    }

    switch (context.request.type) {
      case "create-request": {
        const res = await next(context);
        const membership = (res.response as R4CreateResponse)?.body;
        if (membership.resourceType !== "Membership") {
          throw new OperationError(
            outcomeError("invariant", "Invalid resource type."),
          );
        }

        try {
          await users.create(
            context.ctx.db,
            context.ctx.tenant,
            membershipToUser(membership),
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

            const membership = await context.state.fhirDB.read(
              context.ctx,
              R4,
              "Membership",
              id,
            );
            const versionId = membership?.meta?.versionId;
            if (!versionId)
              throw new OperationError(
                outcomeFatal("not-found", "Membership not found."),
              );

            await users.remove(context.ctx.db, context.ctx.tenant, {
              fhir_user_versionid: parseInt(versionId),
            });

            return next(context);
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
        const res = await next(context);
        const membership = (res.response as R4UpdateResponse)
          .body as Membership;

        const existingUser = await db
          .selectOne("users", {
            fhir_user_id: membership.id as string,
          })
          .run(context.ctx.db);

        if (!(res.response as R4UpdateResponse)?.body)
          throw new OperationError(
            outcomeFatal("invariant", "Response body not found."),
          );
        try {
          // Update on create.
          if (!existingUser) {
            await users.create(
              context.ctx.db,
              context.ctx.tenant,
              membershipToUser(membership),
            );
          } else {
            await users.update(
              context.ctx.db,
              context.ctx.tenant,
              existingUser.id,
              membershipToUser(membership),
            );
          }

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          context.ctx.logger.error(error);
          if (
            db.isDatabaseError(
              error,
              "IntegrityConstraintViolation_UniqueViolation",
            )
          ) {
            throw new OperationError(
              outcomeError(
                "invariant",
                "Failed to update user email is not unique.",
              ),
            );
          } else {
            throw new OperationError(
              outcomeError("invariant", "Failed to update user."),
            );
          }
        }

        return res;
      }

      case "read-request":
      case "search-request":
      case "history-request": {
        return next(context);
      }
      default: {
        throw new OperationError(
          outcomeFatal("invariant", "Invalid request type."),
        );
      }
    }
  };
}

function createAuthMiddleware<
  State extends {
    fhirDB: ReturnType<typeof createPostgresClient>;
  },
  CTX extends IGUHealthServerCTX,
>(): MiddlewareAsync<State, CTX> {
  return createMiddlewareAsync<State, CTX>([
    validateResourceTypesAllowedMiddleware(AUTH_RESOURCETYPES),
    validateOperationsAllowed(AUTH_METHODS_ALLOWED),
    customValidationMembershipMiddleware(),
    setInTransactionMiddleware(),
    setEmailVerified(),
    updateUserTableMiddleware(),
    limitOwnershipEdits(),
    validateOwnershipMiddleware(),
    async (context) => {
      return {
        ...context,
        response: await context.state.fhirDB.request(
          context.ctx,
          context.request,
        ),
      };
    },
  ]);
}

export function createAuthStorageClient<CTX extends IGUHealthServerCTX>(
  fhirDB: ReturnType<typeof createPostgresClient>,
): FHIRClientAsync<CTX> {
  return new AsynchronousClient<
    { fhirDB: ReturnType<typeof createPostgresClient> },
    CTX
  >({ fhirDB }, createAuthMiddleware());
}
