import * as db from "zapatos/db";
import * as s from "zapatos/schema";

import {
  MiddlewareAsync,
  MiddlewareAsyncChain,
  createMiddlewareAsync,
} from "@iguhealth/client/middleware";
import {
  Membership,
  Resource,
} from "@iguhealth/fhir-types/lib/generated/r4/types";
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
import { FHIRTransaction } from "../../transactions.js";

function getMembershipResource(request: s.resources.Insertable): Membership {
  const membership = request.resource as unknown as Membership;
  if (membership.resourceType !== "Membership") {
    throw new OperationError(
      outcomeError("invariant", "Invalid resource type."),
    );
  }
  return membership;
}

type MembershipMiddlewareChain<State, CTX> = MiddlewareAsyncChain<
  State,
  CTX,
  s.resources.Insertable,
  undefined
>;

async function gateCheckSingleOwner(
  ctx: Pick<IGUHealthServerCTX, "db" | "tenant">,
) {
  const owners = await db
    .select("users", { tenant: ctx.tenant, role: "owner" })
    .run(ctx.db);

  if (owners.length !== 1) {
    throw new OperationError(
      outcomeError(
        "invariant",
        "Must have a single owner associated to a tenant.",
      ),
    );
  }
}

function setInTransactionMiddleware<
  State,
  CTX extends { db: db.Queryable },
>(): MembershipMiddlewareChain<State, CTX> {
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

function setEmailVerified<
  State,
  CTX extends Pick<IGUHealthServerCTX, "db" | "tenant">,
>(): MembershipMiddlewareChain<State, CTX> {
  return async (context, next) => {
    const membership = getMembershipResource(context.request);
    switch (context.request.request_method) {
      case "POST": {
        context.request.resource = {
          ...membership,
          emailVerified: false,
        } as unknown as db.JSONObject;
        return next(context);
      }
      case "PUT": {
        if (membership.resourceType === "Membership") {
          const existingUser = await db
            .selectOne("users", {
              fhir_user_id: membership.id as string,
            })
            .run(context.ctx.db);

          context.request.resource = {
            ...membership,
            emailVerified: determineEmailUpdate(
              { email: membership.email },
              existingUser,
            ),
          } as unknown as db.JSONObject;
        }
        return next(context);
      }
      case "PATCH": {
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
  State,
  CTX extends Pick<IGUHealthServerCTX, "db" | "tenant">,
>(): MembershipMiddlewareChain<State, CTX> {
  return async (context, next) => {
    // Skip and run other middleware if not membership.
    if (
      (context.request.resource as unknown as Resource)?.resourceType !==
      "Membership"
    ) {
      throw new OperationError(
        outcomeError("invariant", "Invalid resource type."),
      );
    }

    switch (context.request.request_method) {
      case "POST": {
        const res = await next(context);
        const membership = getMembershipResource(res.request);

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
          console.error(e);
          throw new OperationError(
            outcomeError("invariant", "Failed to create user."),
          );
        }
        return res;
      }
      case "DELETE": {
        const membership = getMembershipResource(context.request);

        const versionId = membership?.meta?.versionId;
        if (!versionId)
          throw new OperationError(
            outcomeFatal("not-found", "Membership not found."),
          );

        await users.remove(context.ctx.db, context.ctx.tenant, {
          fhir_user_id: membership.id,
        });

        return next(context);
      }
      case "PUT": {
        const res = await next(context);
        const membership = getMembershipResource(context.request);

        const existingUser = await db
          .selectOne("users", {
            tenant: context.ctx.tenant,
            fhir_user_id: membership.id as string,
          })
          .run(context.ctx.db);

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
      default: {
        throw new OperationError(
          outcomeFatal(
            "invariant",
            `Invalid method type '${context.request.request_method?.toString()}'`,
          ),
        );
      }
    }
  };
}

function verifySingleOwnerMiddleware<
  State,
  CTX extends Pick<IGUHealthServerCTX, "db" | "tenant">,
>(): MembershipMiddlewareChain<State, CTX> {
  return async (context, next) => {
    const res = await next(context);

    await gateCheckSingleOwner(context.ctx);
    return res;
  };
}

export default function createAuthMembershipMiddleware<
  State,
  CTX extends Pick<IGUHealthServerCTX, "db" | "tenant">,
>(): MiddlewareAsync<State, CTX, s.resources.Insertable, undefined> {
  return createMiddlewareAsync([
    setInTransactionMiddleware(),
    setEmailVerified(),
    updateUserTableMiddleware(),
    verifySingleOwnerMiddleware(),
  ]);
}
