import * as db from "zapatos/db";
import * as s from "zapatos/schema";

import {
  FHIRResponse,
  R4BCreateResponse,
  R4BInstanceDeleteResponse,
  R4BPatchResponse,
  R4BSystemDeleteResponse,
  R4BTypeDeleteResponse,
  R4BUpdateResponse,
  R4CreateResponse,
  R4InstanceDeleteResponse,
  R4PatchResponse,
  R4SystemDeleteResponse,
  R4TypeDeleteResponse,
  R4UpdateResponse,
} from "@iguhealth/client/lib/types";
import {
  MiddlewareAsyncChain,
  createMiddlewareAsync,
} from "@iguhealth/client/middleware";
import { Membership, id } from "@iguhealth/fhir-types/lib/generated/r4/types";
import {
  AllResourceTypes,
  FHIR_VERSION,
  Resource,
} from "@iguhealth/fhir-types/versions";
import { CUSTOM_CLAIMS } from "@iguhealth/jwt";
import {
  OperationError,
  outcomeError,
  outcomeFatal,
} from "@iguhealth/operation-outcomes";

import { membershipToUser } from "../../authN/db/users/utilities.js";
import { IGUHealthServerCTX } from "../../fhir-server/types.js";
import * as queue from "../../queue/interface.js";
import { Topic } from "../../queue/topics/tenants.js";
import { toDBFHIRVersion } from "../utilities/version.js";

function resourceInsertable<Version extends FHIR_VERSION>(
  ctx: IGUHealthServerCTX,
  request_method: "POST" | "PUT" | "PATCH" | "DELETE",
  fhir_version: Version,
  resource: Resource<Version, AllResourceTypes>,
  deleted: boolean = false,
): s.resources.Insertable {
  if (!resource.meta?.versionId)
    throw new OperationError(
      outcomeFatal("exception", "Resource does not have a versionId"),
    );

  return {
    tenant: ctx.tenant,
    version_id: resource.meta?.versionId,
    fhir_version: toDBFHIRVersion(fhir_version),
    request_method: request_method,
    author_id: ctx.user.payload[CUSTOM_CLAIMS.RESOURCE_ID],
    author_type: ctx.user.payload[CUSTOM_CLAIMS.RESOURCE_TYPE],
    resource: resource as unknown as db.JSONObject,
    deleted,
  };
}

function createInsertable(
  ctx: IGUHealthServerCTX,
  response: R4CreateResponse | R4BCreateResponse,
) {
  return resourceInsertable(ctx, "POST", response.fhirVersion, response.body);
}

function updateInsertable(
  ctx: IGUHealthServerCTX,
  response: R4UpdateResponse | R4BUpdateResponse,
) {
  if (response.created)
    return resourceInsertable(ctx, "POST", response.fhirVersion, response.body);

  return resourceInsertable(ctx, "PUT", response.fhirVersion, response.body);
}

function patchInsertable(
  ctx: IGUHealthServerCTX,
  response: R4PatchResponse | R4BPatchResponse,
) {
  return resourceInsertable(ctx, "PATCH", response.fhirVersion, response.body);
}

async function getResource(
  ctx: IGUHealthServerCTX,
  fhir_version: FHIR_VERSION,
  type: AllResourceTypes,
  id: id,
) {
  const resource = await ctx.store.readLatestResourceById(
    ctx,
    fhir_version,
    id,
  );
  if (!resource || resource.resourceType !== type) {
    throw new OperationError(
      outcomeError(
        "not-found",
        `Resource of type '${type}' with id '${id}' not found.`,
      ),
    );
  }
  return resource;
}

async function deleteInsertable(
  ctx: IGUHealthServerCTX,
  response:
    | R4InstanceDeleteResponse
    | R4BInstanceDeleteResponse
    | R4TypeDeleteResponse
    | R4BTypeDeleteResponse
    | R4SystemDeleteResponse
    | R4BSystemDeleteResponse,
): Promise<s.resources.Insertable[]> {
  switch (response.level) {
    case "instance": {
      const resource = await getResource(
        ctx,
        response.fhirVersion,
        response.resource,
        response.id,
      );
      return [
        resourceInsertable(ctx, "DELETE", response.fhirVersion, resource, true),
      ];
    }
    case "type":
    case "system": {
      return await Promise.all(
        (response.deletions ?? []).map(async (deletion) => {
          const resource = await getResource(
            ctx,
            response.fhirVersion,
            deletion.type,
            deletion.id,
          );
          return resourceInsertable(
            ctx,
            "DELETE",
            response.fhirVersion,
            resource,
            true,
          );
        }),
      );
    }
    default: {
      throw new OperationError(
        outcomeError(
          "not-supported",
          // @ts-ignore
          `Delete level '${response.level}' not supported.`,
        ),
      );
    }
  }
}

function createUpdateUserTableMiddleware<
  CTX extends IGUHealthServerCTX,
>(): MiddlewareAsyncChain<unknown, CTX, FHIRResponse, queue.Operations> {
  return async function updateUserTableMiddleware(context, next) {
    // Skip and run other middleware if not membership.
    if (
      !("resource" in context.request) ||
      "Membership" !== context.request.resource
    ) {
      return next(context);
    }

    switch (context.request.type) {
      case "create-response": {
        const res = await next(context);
        const membership = (res.request as R4CreateResponse)?.body;
        if (membership.resourceType !== "Membership") {
          throw new OperationError(
            outcomeError("invariant", "Invalid resource type."),
          );
        }

        return {
          ...res,
          response: [
            ...(res.response ?? []),
            {
              resource: "users",
              type: "create",
              value: membershipToUser(context.ctx.tenant, membership),
            },
          ],
        };
      }
      case "update-response": {
        const res = await next(context);
        const membership = (res.request as R4UpdateResponse).body as Membership;
        const user = membershipToUser(context.ctx.tenant, membership);

        return {
          ...res,
          response: [
            ...(res.response ?? []),
            {
              resource: "users",
              type: "update",
              value: user,
              constraint: ["tenant", "fhir_user_id"],
              onConflict: Object.keys(user) as s.users.Column[],
            },
          ],
        };
      }
      case "delete-response": {
        switch (context.request.level) {
          case "instance": {
            const id = context.request.id;
            const res = await next(context);

            return {
              ...res,
              response: [
                ...(res.response ?? []),
                {
                  resource: "users",
                  type: "delete",
                  singular: true,
                  where: {
                    tenant: context.ctx.tenant,
                    fhir_user_id: id,
                  },
                },
              ],
            };
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

      default: {
        return next(context);
      }
    }
  };
}

function createResponseToQueueOperationMiddleware<
  CTX extends IGUHealthServerCTX,
>(): MiddlewareAsyncChain<unknown, CTX, FHIRResponse, queue.Operations> {
  return async function responseToQueueMiddleware(context, next) {
    switch (context.request.type) {
      case "create-response": {
        return next({
          ...context,
          response: [
            {
              type: "create",
              resource: "resources",
              value: createInsertable(
                context.ctx,
                context.request as R4CreateResponse | R4BCreateResponse,
              ),
            },
          ],
        });
      }

      case "update-response": {
        return next({
          ...context,
          response: [
            {
              type: "create",
              resource: "resources",
              value: updateInsertable(
                context.ctx,
                context.request as R4UpdateResponse | R4BUpdateResponse,
              ),
            },
          ],
        });
      }

      case "patch-response": {
        return next({
          ...context,
          response: [
            {
              type: "create",
              resource: "resources",
              value: patchInsertable(
                context.ctx,
                context.request as R4PatchResponse | R4BPatchResponse,
              ),
            },
          ],
        });
      }
      case "delete-response": {
        return next({
          ...context,
          response: (
            await deleteInsertable(
              context.ctx,
              context.request as
                | R4InstanceDeleteResponse
                | R4BInstanceDeleteResponse
                | R4TypeDeleteResponse
                | R4BTypeDeleteResponse
                | R4SystemDeleteResponse
                | R4BSystemDeleteResponse,
            )
          ).map((value) => ({
            type: "create",
            resource: "resources",
            value,
          })),
        });
      }
      default: {
        return context;
      }
    }
  };
}

function deriveKey(response: FHIRResponse): id | undefined {
  if ("body" in response) return response.body.id as id;
  return undefined;
}

function createSendToQueueMiddleware<
  CTX extends IGUHealthServerCTX,
>(): MiddlewareAsyncChain<unknown, CTX, FHIRResponse, queue.Operations> {
  return async function sendToQueueMiddleware(context, next) {
    const res = await next(context);
    const queueOperations = res.response ?? [];

    if (queueOperations.length > 0) {
      await context.ctx.queue.send(
        context.ctx.tenant,
        Topic(context.ctx.tenant, "operations"),
        [
          {
            key: deriveKey(res.request),
            headers: {
              tenant: context.ctx.tenant,
            },
            value: queueOperations,
          },
        ],
      );
    }

    return res;
  };
}

const queueMiddleware = createMiddlewareAsync([
  createUpdateUserTableMiddleware(),
  createResponseToQueueOperationMiddleware(),
  createSendToQueueMiddleware(),
]);

export default async function sendtoQueue(
  ctx: IGUHealthServerCTX,
  response: FHIRResponse,
) {
  await queueMiddleware({ state: undefined, ctx, request: response });
}
