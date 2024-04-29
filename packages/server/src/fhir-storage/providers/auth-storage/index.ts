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
import { membershipToUser } from "../../../authN/db/users/utilities.js";
import { FHIRServerCTX } from "../../../fhir-api/types.js";
import validateOperationsAllowed from "../../middleware/validate-operations-allowed.js";
import validateResourceTypeMiddleware from "../../middleware/validate-resourcetype.js";
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
  if (membership.role === "owner") {
    throw new OperationError(
      outcomeFatal("not-supported", "Cannot create owner membership."),
    );
  }
}

function membershipHandler<
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
        await customValidationMembership(context.request.body as Membership);
        return db.serializable(context.ctx.db, async (txClient) => {
          const res = await next({
            ...context,
            ctx: { ...context.ctx, db: txClient },
          });

          const membership = (res.response as R4CreateResponse)?.body;
          if (membership.resourceType !== "Membership") {
            throw new OperationError(
              outcomeError("invariant", "Invalid resource type."),
            );
          }
          try {
            await tenantUserManagement.create(
              txClient,
              membershipToUser(membership),
            );
          } catch (e) {
            throw new OperationError(
              outcomeError("invariant", "Failed to create user."),
            );
          }

          return res;
        });
      }
      case "delete-request": {
        const id = context.request.id;
        return db.serializable(context.ctx.db, async (txClient) => {
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

          await tenantUserManagement.delete(txClient, {
            fhir_user_versionid: parseInt(versionId),
          });

          return next({ ...context, ctx: { ...context.ctx, db: txClient } });
        });
      }
      case "update-request": {
        await customValidationMembership(context.request.body as Membership);
        const id = context.request.id;
        return db.serializable(context.ctx.db, async (txClient) => {
          const ctx = { ...context.ctx, db: txClient };
          const existingMembership = await context.state.fhirDB.read(
            ctx,
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
            .run(txClient);

          if (!existingUser)
            throw new OperationError(
              outcomeFatal("not-found", "User not found."),
            );

          const res = await next({ ...context, ctx });
          if (!(res.response as R4UpdateResponse)?.body)
            throw new OperationError(
              outcomeFatal("invariant", "Response body not found."),
            );

          tenantUserManagement.update(
            txClient,
            existingUser.id,
            membershipToUser(
              (res.response as R4UpdateResponse)?.body as Membership,
            ),
          );

          return res;
        });
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
    validateResourceTypeMiddleware(AUTH_RESOURCETYPES),
    validateOperationsAllowed(AUTH_METHODS_ALLOWED),
    membershipHandler(),
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
