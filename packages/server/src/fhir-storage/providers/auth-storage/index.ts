import * as db from "zapatos/db";
import * as s from "zapatos/schema";

import { AsynchronousClient } from "@iguhealth/client";
import { FHIRClientAsync } from "@iguhealth/client/lib/interface";
import { FHIRResponse } from "@iguhealth/client/lib/types";
import {
  MiddlewareAsync,
  createMiddlewareAsync,
} from "@iguhealth/client/middleware";
import { Membership, ResourceType, id } from "@iguhealth/fhir-types/r4/types";
import {
  OperationError,
  outcomeError,
  outcomeFatal,
} from "@iguhealth/operation-outcomes";

import { FHIRServerCTX } from "../../../fhir-context/types.js";
import validateResourceTypeMiddleware from "../../middleware/validate-resourcetype.js";
import { createPostgresClient } from "../postgres/index.js";

export const AUTH_RESOURCETYPES: ResourceType[] = ["Membership"];

async function customValidationMembership(
  membership: Membership,
): Promise<void> {
  if (membership.role === "owner") {
    throw new OperationError(
      outcomeFatal("not-supported", "Cannot create owner membership."),
    );
  }
  return;
}

function createAuthMiddleware<
  State extends {
    fhirDB: ReturnType<typeof createPostgresClient>;
  },
  CTX extends FHIRServerCTX,
>(): MiddlewareAsync<State, CTX> {
  return createMiddlewareAsync<State, CTX>([
    validateResourceTypeMiddleware(AUTH_RESOURCETYPES),
    async (context) => {
      if (context.request.level === "system") {
        throw new OperationError(
          outcomeError(
            "not-supported",
            `Operation level '${context.request.level}' is not supported in auth.`,
          ),
        );
      }
      switch (context.request.type) {
        // Mutations
        case "create-request": {
          switch (context.request.resourceType) {
            case "Membership": {
              const membership = context.request.body as Membership;
              return {
                ...context,
                response: await db.serializable(
                  context.ctx.db,
                  async (client) => {
                    customValidationMembership(membership);
                    const ctx = { ...context.ctx, db: client };
                    const email = membership.email;

                    const response = await db
                      .insert("users", {
                        email,
                        tenant: context.ctx.tenant,
                        first_name: membership.name?.given?.[0],
                        last_name: membership.name?.family,
                        role: membership.role === "admin" ? "admin" : "member",
                      })
                      .run(client);
                    const resource = await context.state.fhirDB.create(
                      ctx,
                      {
                        ...membership,
                        id: response.id as id,
                      },
                      true,
                    );

                    return {
                      level: "type",
                      type: "create-response",
                      resourceType: "Membership",
                      body: resource,
                    };
                  },
                ),
              };
            }
            default:
              throw new OperationError(
                outcomeFatal("not-supported", "invalid resourcetype"),
              );
          }
        }
        case "update-request": {
          throw new Error("Method not implemented.");
        }
        case "patch-request": {
          throw new Error("Method not implemented.");
        }
        case "delete-request": {
          const id = context.request.id;

          switch (context.request.resourceType) {
            case "Membership": {
              return {
                ...context,
                response: await db.serializable(
                  context.ctx.db,
                  async (client) => {
                    const ctx = { ...context.ctx, db: client };
                    await db
                      .deletes("users", { id, tenant: context.ctx.tenant })
                      .run(client);
                    await context.state.fhirDB.delete(ctx, "Membership", id);
                    return {
                      type: "delete-response",
                      resourceType: "Membership",
                      id,
                    } as FHIRResponse;
                  },
                ),
              };
            }
            default: {
              throw new OperationError(
                outcomeFatal("not-supported", "invalid resourcetype"),
              );
            }
          }
        }

        case "read-request": {
          return {
            ...context,
            response: await context.state.fhirDB.request(context.ctx, {
              type: "read-request",
              level: "instance",
              resourceType: "Membership",
              id: context.request.id,
            }),
          };
        }
        case "vread-request": {
          return {
            ...context,
            response: await context.state.fhirDB.request(context.ctx, {
              type: "vread-request",
              level: "instance",
              resourceType: "Membership",
              id: context.request.id,
              versionId: context.request.versionId,
            }),
          };
        }

        case "search-request": {
          return {
            ...context,
            response: await context.state.fhirDB.request(context.ctx, {
              type: "search-request",
              level: "type",
              resourceType: context.request.resourceType,
              parameters: context.request.parameters,
            }),
          };
        }

        default: {
          throw new OperationError(
            outcomeError(
              "not-supported",
              `Operation '${context.request.type}' is not supported in auth.`,
            ),
          );
        }
      }
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
