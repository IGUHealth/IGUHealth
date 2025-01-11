import validator from "validator";
import * as db from "zapatos/db";
import * as s from "zapatos/schema";

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

import {
  determineEmailUpdate,
  membershipToUser,
} from "../../../authN/db/users/utilities.js";
import { IGUHealthServerCTX } from "../../../fhir-api/types.js";
import { MUTATIONS_QUEUE } from "../../../worker/kafka/constants.js";
import validateOperationsAllowed from "../../middleware/validate-operations-allowed.js";
import validateResourceTypesAllowedMiddleware from "../../middleware/validate-resourcetype.js";
import { QueueTansaction } from "../../transactions.js";
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

async function gateCheckAtLeastOneOwner(ctx: IGUHealthServerCTX) {
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
    fhirDB: ReturnType<typeof createRemoteStorage>;
  },
  CTX extends IGUHealthServerCTX,
>(): MiddlewareAsyncChain<State, CTX> {
  return async (context, next) => {
    const res = await next(context);

    switch (context.request.type) {
      case "delete-request":
      case "update-request":
      case "patch-request": {
        await gateCheckAtLeastOneOwner(context.ctx);
        return res;
      }
      case "create-request":
      default: {
        return res;
      }
    }
  };
}

function setInTransactionMiddleware<
  State extends {
    fhirDB: ReturnType<typeof createRemoteStorage>;
  },
  CTX extends IGUHealthServerCTX,
>(): MiddlewareAsyncChain<State, CTX> {
  return async (context, next) => {
    return QueueTansaction(context.ctx, async (ctx) => {
      const res = await next({
        ...context,
        ctx,
      });

      return res;
    });
  };
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

function setEmailVerified<
  State extends {
    fhirDB: ReturnType<typeof createRemoteStorage>;
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
            .run(context.ctx.store.getClient());

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
    fhirDB: ReturnType<typeof createRemoteStorage>;
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
          await context.ctx.queue.send(context.ctx.tenant, MUTATIONS_QUEUE, [
            {
              headers: {
                tenant: context.ctx.tenant,
              },
              value: [
                {
                  type: "users",
                  interaction: "create",
                  value: membershipToUser(context.ctx.tenant, membership),
                },
              ],
            },
          ]);
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

            if (!membership) {
              throw new OperationError(
                outcomeError("not-found", "Membership not found."),
              );
            }

            const res = await next(context);

            await context.ctx.queue.send(context.ctx.tenant, MUTATIONS_QUEUE, [
              {
                headers: {
                  tenant: context.ctx.tenant,
                },
                value: [
                  {
                    type: "users",
                    interaction: "delete",
                    singular: true,
                    where: {
                      tenant: context.ctx.tenant,
                      fhir_user_id: membership.id,
                    },
                  },
                ],
              },
            ]);

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
        const res = await next(context);
        const membership = (res.response as R4UpdateResponse)
          .body as Membership;

        const user = membershipToUser(context.ctx.tenant, membership);
        await context.ctx.queue.send(context.ctx.tenant, MUTATIONS_QUEUE, [
          {
            headers: {
              tenant: context.ctx.tenant,
            },
            value: [
              {
                type: "users",
                interaction: "update",
                value: user,
                constraint: ["tenant", "fhir_user_id"],
                onConflict: Object.keys(user) as s.users.Column[],
              },
            ],
          },
        ]);

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
    fhirDB: ReturnType<typeof createRemoteStorage>;
  },
  CTX extends IGUHealthServerCTX,
>(): MiddlewareAsync<State, CTX> {
  return createMiddlewareAsync<State, CTX>([
    validateResourceTypesAllowedMiddleware(MEMBERSHIP_RESOURCE_TYPES),
    validateOperationsAllowed(MEMBERSHIP_METHODS_ALLOWED),
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

export function createMembershipClient<CTX extends IGUHealthServerCTX>(
  fhirDB: ReturnType<typeof createRemoteStorage>,
): FHIRClientAsync<CTX> {
  return new AsynchronousClient<
    { fhirDB: ReturnType<typeof createRemoteStorage> },
    CTX
  >({ fhirDB }, createAuthMiddleware());
}
