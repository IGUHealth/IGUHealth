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

import TenantUserManagement from "../../../authN/db/users/provider/tenant.js";
import {
  determineEmailUpdate,
  membershipToUser,
} from "../../../authN/db/users/utilities.js";
import { FHIRServerCTX } from "../../../fhir-api/types.js";
import validateOperationsAllowed from "../../middleware/validate-operations-allowed.js";
import validateResourceTypesAllowedMiddleware from "../../middleware/validate-resourcetype.js";
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

async function gateCheckSingleOwner(ctx: FHIRServerCTX) {
  const owners = await ctx.client.search_type(ctx, R4, "Membership", [
    {
      name: "role",
      value: ["owner"],
    },
  ]);

  if (owners.resources.length === 0) {
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
  CTX extends FHIRServerCTX,
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
  CTX extends FHIRServerCTX,
>(): MiddlewareAsyncChain<State, CTX> {
  return async (context, next) => {
    return db.serializable(context.ctx.db, async (txClient) => {
      const res = await next({
        ...context,
        ctx: { ...context.ctx, db: txClient },
      });
      return res;
    });
  };
}

function customValidationMembershipMiddleware<
  State extends {
    fhirDB: ReturnType<typeof createPostgresClient>;
  },
  CTX extends FHIRServerCTX,
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

function updateUserTableMiddleware<
  State extends {
    fhirDB: ReturnType<typeof createPostgresClient>;
  },
  CTX extends FHIRServerCTX,
>(): MiddlewareAsyncChain<State, CTX> {
  return async (context, next) => {
    const tenantUserManagement = new TenantUserManagement(context.ctx.tenant);
    // Skip and run other middleware if not membership.
    if (
      !("resourceType" in context.request) ||
      "Membership" !== context.request.resourceType
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

        membership.emailVerified = false;

        try {
          await tenantUserManagement.create(
            context.ctx,
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

        await tenantUserManagement.delete(context.ctx, {
          fhir_user_versionid: parseInt(versionId),
        });

        return next(context);
      }
      case "update-request": {
        const id = context.request.id;

        const existingMembership = await context.state.fhirDB.read(
          context.ctx,
          R4,
          "Membership",
          id,
        );

        if (!existingMembership?.meta?.versionId)
          throw new OperationError(
            outcomeFatal("not-found", "Membership not found."),
          );

        const existingUser = await db
          .selectOne("users", {
            fhir_user_versionid: parseInt(existingMembership.meta.versionId),
          })
          .run(context.ctx.db);

        if (!existingUser)
          throw new OperationError(
            outcomeFatal("not-found", "User not found."),
          );

        context.request.body = {
          ...(context.request.body as Membership),
          emailVerified: determineEmailUpdate(
            membershipToUser(context.request?.body as Membership),
            existingUser,
          ),
        } as Membership;

        const res = await next(context);
        if (!(res.response as R4UpdateResponse)?.body)
          throw new OperationError(
            outcomeFatal("invariant", "Response body not found."),
          );

        tenantUserManagement.update(
          context.ctx,
          existingUser.id,
          membershipToUser(
            (res.response as R4UpdateResponse)?.body as Membership,
          ),
        );

        return res;
      }
      case "read-request": {
        return next(context);
      }
      case "search-request": {
        return next(context);
      }
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
  CTX extends FHIRServerCTX,
>(): MiddlewareAsync<State, CTX> {
  return createMiddlewareAsync<State, CTX>([
    validateResourceTypesAllowedMiddleware(AUTH_RESOURCETYPES),
    validateOperationsAllowed(AUTH_METHODS_ALLOWED),
    customValidationMembershipMiddleware(),
    setInTransactionMiddleware(),
    updateUserTableMiddleware(),
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

export function createAuthStorageClient<CTX extends FHIRServerCTX>(
  fhirDB: ReturnType<typeof createPostgresClient>,
): FHIRClientAsync<CTX> {
  return new AsynchronousClient<
    { fhirDB: ReturnType<typeof createPostgresClient> },
    CTX
  >({ fhirDB }, createAuthMiddleware());
}
