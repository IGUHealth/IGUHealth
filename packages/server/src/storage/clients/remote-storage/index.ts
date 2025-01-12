import jsonpatch, { Operation } from "fast-json-patch";
import * as db from "zapatos/db";
import * as s from "zapatos/schema";

import { AsynchronousClient } from "@iguhealth/client";
import { FHIRClient } from "@iguhealth/client/interface";
import {
  MiddlewareAsyncChain,
  createMiddlewareAsync,
} from "@iguhealth/client/middleware";
import {
  FHIRResponse,
  R4BSystemSearchRequest,
  R4BTypeSearchRequest,
  R4SystemSearchRequest,
  R4TypeSearchRequest,
} from "@iguhealth/client/types";
import { code, id, unsignedInt } from "@iguhealth/fhir-types/r4/types";
import {
  AllResourceTypes,
  FHIR_VERSION,
  R4,
  R4B,
  Resource,
  ResourceType,
} from "@iguhealth/fhir-types/versions";
import { CUSTOM_CLAIMS } from "@iguhealth/jwt/types";
import {
  OperationError,
  isOperationError,
  outcomeError,
  outcomeFatal,
} from "@iguhealth/operation-outcomes";

import { httpRequestToFHIRRequest } from "../../../fhir-http/index.js";
import { validateResource } from "../../../fhir-operation-executors/providers/local/ops/resource_validate.js";
import { IGUHealthServerCTX } from "../../../fhir-server/types.js";
import { CreateOperation } from "../../../queue/interface.js";
import { OPERATIONS_QUEUE } from "../../../worker/kafka/constants.js";
import {
  DBTransaction,
  buildTransactionTopologicalGraph,
} from "../../transactions.js";
import {
  fhirResourceToBundleEntry,
  fhirResponseToBundleEntry,
} from "../../utilities/bundle.js";
import { generateId } from "../../utilities/generateId.js";
import { toDBFHIRVersion } from "../../utilities/version.js";

type StorageState = {
  transaction_entry_limit: number;
};

const AUTHOR_EXTENSION = "https://iguhealth.app/author";

function version(
  insertable: Omit<s.resources.Insertable, "version_id">,
): s.resources.Insertable {
  const versionId = generateId();
  const resource = insertable.resource as unknown as Resource<
    FHIR_VERSION,
    AllResourceTypes
  >;
  insertable.resource = {
    ...resource,
    meta: {
      ...resource.meta,
      versionId,
      lastUpdated: new Date().toISOString(),
      // Filters meta extensions for author and places the author reference in the resource.
      extension: (resource.meta?.extension ?? [])
        .filter((e) => e.url !== AUTHOR_EXTENSION)
        .concat([
          {
            url: AUTHOR_EXTENSION as id,
            valueReference: {
              reference: `${insertable.author_type}/${insertable.author_id}`,
            },
          },
        ]),
    },
  } as unknown as db.JSONObject;

  return { ...insertable, version_id: versionId };
}

async function createResource<
  CTX extends IGUHealthServerCTX,
  Version extends FHIR_VERSION,
>(
  ctx: CTX,
  fhirVersion: Version,
  resource: Resource<Version, AllResourceTypes>,
): Promise<Resource<Version, AllResourceTypes>> {
  // For creation force new id.

  resource.id = generateId();

  const message = version({
    tenant: ctx.tenant,
    fhir_version: toDBFHIRVersion(fhirVersion),
    request_method: "POST",
    author_id: ctx.user.payload[CUSTOM_CLAIMS.RESOURCE_ID],
    author_type: ctx.user.payload[CUSTOM_CLAIMS.RESOURCE_TYPE],
    resource: resource as unknown as db.JSONObject,
  });

  await ctx.queue.send(ctx.tenant, OPERATIONS_QUEUE, [
    {
      key: resource.id,
      value: [
        {
          resource: "resources",
          type: "create",
          value: message,
        } as CreateOperation<"resources">,
      ],
    },
  ]);

  return message.resource as unknown as Resource<Version, AllResourceTypes>;
}

async function getResourceById<
  CTX extends IGUHealthServerCTX,
  Version extends FHIR_VERSION,
>(
  ctx: CTX,
  fhirVersion: Version,
  id: id,
): Promise<Resource<Version, AllResourceTypes> | undefined> {
  const resource = await ctx.store.readLatestResourceById(ctx, fhirVersion, id);

  return resource;
}

async function getResource<
  CTX extends IGUHealthServerCTX,
  Version extends FHIR_VERSION,
  Type extends ResourceType<Version>,
>(
  ctx: CTX,
  fhirVersion: Version,
  resourceType: Type,
  id: id,
): Promise<Resource<Version, Type> | undefined> {
  const resource = await getResourceById(ctx, fhirVersion, id);

  if (resource === undefined || resource.resourceType !== resourceType) {
    return undefined;
  }

  return resource as Resource<Version, Type>;
}

async function patchResource<
  CTX extends IGUHealthServerCTX,
  Version extends FHIR_VERSION,
>(
  ctx: CTX,
  fhirVersion: Version,
  resourceType: ResourceType<Version>,
  id: id,
  patches: Operation[],
): Promise<Resource<Version, AllResourceTypes>> {
  const existingResource = await getResource(
    ctx,
    fhirVersion,
    resourceType,
    id,
  );
  if (!existingResource) {
    throw new OperationError(
      outcomeError(
        "not-found",
        `'${resourceType}' with id '${id}' was not found`,
      ),
    );
  }

  try {
    const newResource = jsonpatch.applyPatch(
      existingResource,
      patches,
      true,
      false,
    ).newDocument as Resource<Version, AllResourceTypes>;

    const outcome = await validateResource(ctx, fhirVersion, resourceType, {
      resource: newResource,
    });

    // Need to revaluate post application of patch to ensure that the resource is still valid.
    if (
      outcome.issue.filter(
        (i) => i.severity === "error" || i.severity === "fatal",
      ).length > 0
    ) {
      throw new OperationError(outcome);
    }

    if (newResource.id !== existingResource.id) {
      newResource.id = existingResource.id;
    }

    const message = version({
      tenant: ctx.tenant,
      fhir_version: toDBFHIRVersion(fhirVersion),
      request_method: "PATCH",
      author_id: ctx.user.payload[CUSTOM_CLAIMS.RESOURCE_ID],
      author_type: ctx.user.payload[CUSTOM_CLAIMS.RESOURCE_TYPE],
      resource: newResource as unknown as db.JSONObject,
    });

    await ctx.queue.send(ctx.tenant, OPERATIONS_QUEUE, [
      {
        key: newResource.id as id,
        value: [
          {
            resource: "resources",
            type: "create",
            value: message,
          } as CreateOperation<"resources">,
        ],
      },
    ]);

    const patchedResource = message.resource as unknown as Resource<
      Version,
      AllResourceTypes
    >;

    return patchedResource;
  } catch (e) {
    if (isOperationError(e)) throw e;
    else {
      ctx.logger.error(e);
      throw new OperationError(
        outcomeError(
          "structure",
          `Patch could not be applied to the given resource '${resourceType}/${id}'`,
        ),
      );
    }
  }
}

async function updateResource<
  CTX extends IGUHealthServerCTX,
  Version extends FHIR_VERSION,
>(
  ctx: CTX,
  fhirVersion: Version,
  resource: Resource<Version, AllResourceTypes>,
): Promise<{
  created: boolean;
  resource: Resource<Version, AllResourceTypes>;
}> {
  if (!resource.id)
    throw new OperationError(
      outcomeError("invalid", "Resource id not found on resource"),
    );

  const existingResource = await getResourceById(ctx, fhirVersion, resource.id);

  if (
    existingResource &&
    existingResource.resourceType !== resource.resourceType
  ) {
    throw new OperationError(
      outcomeError(
        "invalid",
        `'${existingResource.resourceType}' is not the same as '${resource.resourceType}'`,
      ),
    );
  }

  // https://hl7.org/fhir/R4/http.html#upsert
  // Allow clients to define their own ids.
  // Necessary for certain external test suites.
  // Note we automatically set id to be the request.id from update.
  if (!existingResource) {
    ctx.logger.warn({
      message: "Resource not found. Creating new resource with id.",
      id: resource.id,
    });
  }

  const message = version({
    tenant: ctx.tenant,
    fhir_version: toDBFHIRVersion(fhirVersion),
    request_method: "PUT",
    author_id: ctx.user.payload[CUSTOM_CLAIMS.RESOURCE_ID],
    author_type: ctx.user.payload[CUSTOM_CLAIMS.RESOURCE_TYPE],
    resource: resource as unknown as db.JSONObject,
  });

  await ctx.queue.send(ctx.tenant, OPERATIONS_QUEUE, [
    {
      key: resource.id as id,
      value: [
        {
          resource: "resources",
          type: "create",
          value: message,
        } as CreateOperation<"resources">,
      ],
    },
  ]);

  const updatedResource = message.resource as unknown as Resource<
    Version,
    AllResourceTypes
  >;

  return {
    created: existingResource === undefined,
    resource: updatedResource,
  };
}

async function deleteResource<
  CTX extends IGUHealthServerCTX,
  Version extends FHIR_VERSION,
>(ctx: CTX, fhirVersion: Version, resourceType: ResourceType<Version>, id: id) {
  const resource = await getResource(ctx, fhirVersion, resourceType, id);
  if (!resource)
    throw new OperationError(
      outcomeError(
        "not-found",
        `'${resourceType}' with id '${id}' was not found`,
      ),
    );

  await ctx.queue.send(ctx.tenant, OPERATIONS_QUEUE, [
    {
      key: resource.id as id,
      value: [
        {
          resource: "resources",
          type: "create",
          value: version({
            tenant: ctx.tenant,
            fhir_version: toDBFHIRVersion(fhirVersion),
            request_method: "DELETE",
            author_id: ctx.user.payload[CUSTOM_CLAIMS.RESOURCE_ID],
            author_type: ctx.user.payload[CUSTOM_CLAIMS.RESOURCE_TYPE],
            resource: resource as unknown as db.JSONObject,
            deleted: true,
          }),
        } as CreateOperation<"resources">,
      ],
    },
  ]);
}

async function conditionalDelete(
  ctx: IGUHealthServerCTX,
  searchRequest:
    | R4TypeSearchRequest
    | R4BTypeSearchRequest
    | R4SystemSearchRequest
    | R4BSystemSearchRequest,
) {
  const limit = parseInt(process.env.FHIR_DELETE_CONDITIONAL_LIMIT ?? "20");
  searchRequest.parameters = [
    ...searchRequest.parameters.filter(
      (p) => p.name !== "_total" && p.name !== "_count",
    ),
    { name: "_total", value: ["accurate"] },
    { name: "_count", value: [limit] },
  ];

  const result = await ctx.search.search(ctx, searchRequest);

  if ((result.total ?? limit + 1) > limit)
    throw new OperationError(
      outcomeError("too-costly", "The operation is too costly to perform."),
    );

  const deletions = await Promise.all(
    result.result.map(async (typeId) => {
      await deleteResource(
        ctx,
        searchRequest.fhirVersion,
        typeId.type,
        typeId.id,
      );
      return typeId;
    }),
  );

  switch (searchRequest.level) {
    case "type": {
      switch (searchRequest.fhirVersion) {
        case R4:
        case R4B: {
          return {
            fhirVersion: searchRequest.fhirVersion,
            type: "delete-response",
            level: "type",
            resource: searchRequest.resource,
            parameters: searchRequest.parameters,
            deletions,
          } as FHIRResponse;
        }
        default: {
          throw new OperationError(
            outcomeError("not-supported", `Unknown FHIR version.`),
          );
        }
      }
    }
    case "system": {
      return {
        fhirVersion: searchRequest.fhirVersion,
        type: "delete-response",
        level: "system",
        parameters: searchRequest.parameters,
        deletions,
      } as FHIRResponse;
    }
  }
}

function createStorageMiddleware<
  CTX extends IGUHealthServerCTX,
  State extends StorageState,
>(): MiddlewareAsyncChain<State, CTX> {
  return async function storageMiddleware(context) {
    switch (context.request.type) {
      case "read-request": {
        const resource = await getResource(
          context.ctx,
          context.request.fhirVersion,
          context.request.resource,
          context.request.id,
        );
        if (!resource) {
          throw new OperationError(
            outcomeError(
              "not-found",
              `'${context.request.resource}' with id '${context.request.id}' was not found`,
            ),
          );
        }
        return {
          state: context.state,
          ctx: context.ctx,
          request: context.request,
          response: {
            fhirVersion: context.request.fhirVersion,
            level: "instance",
            type: "read-response",
            resource: context.request.resource,
            id: context.request.id,
            body: resource,
          } as FHIRResponse,
        };
      }
      case "vread-request": {
        const foundResources = await context.ctx.store.read(
          context.ctx,
          context.request.fhirVersion,
          [context.request.versionId as id],
        );
        if (foundResources.length === 0) {
          throw new OperationError(
            outcomeError(
              "not-found",
              `'${context.request.resource}' with id '${context.request.id}' and version '${context.request.versionId}' was not found`,
            ),
          );
        }
        if (foundResources.length > 1) {
          throw new OperationError(
            outcomeError(
              "invalid",
              `Multiple resources found with id '${context.request.id}' and version '${context.request.versionId}'`,
            ),
          );
        }
        const foundResource = foundResources[0];
        if (foundResource.id !== context.request.id) {
          throw new OperationError(
            outcomeError(
              "not-found",
              `'${context.request.resource}' with id '${context.request.id}' and version '${context.request.versionId}' was not found`,
            ),
          );
        }
        if (foundResource.resourceType !== context.request.resource) {
          throw new OperationError(
            outcomeError(
              "invalid",
              `Resource type '${context.request.resource}' does not match found resource type '${foundResource.resourceType}'`,
            ),
          );
        }

        return {
          state: context.state,
          ctx: context.ctx,
          request: context.request,
          response: {
            fhirVersion: context.request.fhirVersion,
            level: "instance",
            type: "vread-response",
            resource: context.request.resource,
            id: context.request.id,
            versionId: context.request.versionId,
            body: foundResource,
          } as FHIRResponse,
        };
      }
      case "search-request": {
        const result = await context.ctx.search.search(
          context.ctx,
          context.request,
        );
        const resources = await context.ctx.store.read(
          context.ctx,
          context.request.fhirVersion,
          result.result.map((r) => r.version_id),
        );

        switch (context.request.level) {
          case "system": {
            return {
              request: context.request,
              state: context.state,
              ctx: context.ctx,
              response: {
                fhirVersion: context.request.fhirVersion,
                type: "search-response",
                parameters: context.request.parameters,
                level: "system",
                body: {
                  total: result.total as unsignedInt | undefined,
                  resourceType: "Bundle",
                  type: "searchset",
                  entry: resources.map((r) =>
                    fhirResourceToBundleEntry(
                      context.request.fhirVersion,
                      context.ctx.tenant,
                      r,
                    ),
                  ),
                },
              } as FHIRResponse,
            };
          }
          case "type": {
            return {
              request: context.request,
              state: context.state,
              ctx: context.ctx,
              response: {
                fhirVersion: context.request.fhirVersion,
                type: "search-response",
                parameters: context.request.parameters,
                level: "type",
                resource: context.request.resource,
                body: {
                  total: result.total as unsignedInt | undefined,
                  resourceType: "Bundle",
                  type: "searchset",
                  entry: resources.map((r) =>
                    fhirResourceToBundleEntry(
                      context.request.fhirVersion,
                      context.ctx.tenant,
                      r,
                    ),
                  ),
                },
              } as FHIRResponse,
            };
          }
          default: {
            throw new Error("Invalid search level");
          }
        }
      }
      case "create-request": {
        return {
          request: context.request,
          state: context.state,
          ctx: context.ctx,
          response: {
            fhirVersion: R4,
            level: "type",
            resource: context.request.resource,
            type: "create-response",
            body: await createResource(
              context.ctx,
              context.request.fhirVersion,
              context.request.body,
            ),
          } as FHIRResponse,
        };
      }

      case "patch-request": {
        const savedResource = await patchResource(
          context.ctx,
          context.request.fhirVersion,
          context.request.resource,
          context.request.id,
          context.request.body as Operation[],
        );

        return {
          request: context.request,
          state: context.state,
          ctx: context.ctx,
          response: {
            fhirVersion: R4,
            level: "instance",
            resource: context.request.resource,
            id: context.request.id,
            type: "patch-response",
            body: savedResource,
          } as FHIRResponse,
        };
      }
      case "update-request": {
        switch (context.request.level) {
          case "type": {
            const request = context.request;
            const result = await context.ctx.search.search(context.ctx, {
              fhirVersion: request.fhirVersion,
              type: "search-request",
              level: "type",
              resource: request.resource,
              // Filter out _sort, _total and _count as not needed and setting count by default to be 2.
              parameters: [
                ...request.parameters.filter(
                  (p) =>
                    p.name !== "_total" &&
                    p.name !== "_count" &&
                    p.name !== "_sort",
                ),
                { name: "_count", value: [2] },
              ],
            } as R4TypeSearchRequest | R4BTypeSearchRequest);
            switch (result.result.length) {
              // No matches, no id provided:
              //   The server creates the resource.
              // No matches, id provided:
              //   The server treats the interaction as an Update as Create interaction (or rejects it, if it does not support Update as Create)
              case 0: {
                if (request.body.id) {
                  // From R5 but Applying here on all versions to dissallow updating a Resource if it already exists
                  const existingResource = await getResource(
                    context.ctx,
                    request.fhirVersion,
                    request.body.resourceType,
                    request.body.id,
                  );

                  if (existingResource) {
                    throw new OperationError(
                      outcomeError(
                        "conflict",
                        "Resource already exists. But not found in conditional criteria.",
                      ),
                    );
                  }

                  const { resource, created } = await updateResource(
                    context.ctx,
                    request.fhirVersion,
                    request.body,
                  );

                  return {
                    request: context.request,
                    state: context.state,
                    ctx: context.ctx,
                    response: {
                      fhirVersion: request.fhirVersion,
                      level: "instance",
                      resource: resource.resourceType,
                      id: resource.id,
                      type: "update-response",
                      created: created,
                      body: resource,
                    } as FHIRResponse,
                  };
                } else {
                  const resource = await createResource(
                    context.ctx,
                    request.fhirVersion,
                    request.body,
                  );
                  return {
                    request: context.request,
                    state: context.state,
                    ctx: context.ctx,
                    response: {
                      fhirVersion: request.fhirVersion,
                      level: "instance",
                      resource: resource.resourceType,
                      id: resource.id,
                      type: "update-response",
                      body: resource,
                    } as FHIRResponse,
                  };
                }
              }
              // One Match, no resource id provided OR (resource id provided and it matches the found resource):
              //   The server performs the update against the matching resource
              // One Match, resource id provided but does not match resource found:
              //   The server returns a 400 Bad Request error indicating the client id specification was a problem preferably with an OperationOutcome
              case 1: {
                const foundResource = result.result[0];
                if (request.body.id && request.body.id !== foundResource.id) {
                  throw new OperationError(
                    outcomeError(
                      "invalid",
                      "Resource id provided does not match resource found.",
                    ),
                  );
                }
                const { created, resource } = await updateResource(
                  context.ctx,
                  request.fhirVersion,
                  { ...request.body, id: foundResource.id },
                );
                return {
                  request: context.request,
                  state: context.state,
                  ctx: context.ctx,
                  response: {
                    fhirVersion: request.fhirVersion,
                    level: "instance",
                    resource: resource.resourceType,
                    id: resource.id,
                    created,
                    type: "update-response",
                    body: resource,
                  } as FHIRResponse,
                };
              }
              // Multiple matches: The server returns a 412 Precondition
              // Failed error indicating the client's criteria were not selective enough preferably with an OperationOutcome
              default: {
                throw new OperationError(
                  outcomeError("multiple-matches", "Multiple matches found."),
                );
              }
            }
          }
          case "instance": {
            const { created, resource } = await updateResource(
              context.ctx,
              context.request.fhirVersion,
              // Set the id for the request body to ensure that the resource is updated correctly.
              // Should be pased on the request.id and request.resource
              {
                ...context.request.body,
                id: context.request.id,
              },
            );

            return {
              request: context.request,
              state: context.state,
              ctx: context.ctx,
              response: {
                fhirVersion: context.request.fhirVersion,
                level: "instance",
                resource: context.request.resource,
                id: context.request.id,
                type: "update-response",
                created: created,
                body: resource,
              } as FHIRResponse,
            };
          }
          default: {
            throw new OperationError(
              outcomeError("not-supported", `Invalid level.`),
            );
          }
        }
      }
      case "delete-request": {
        switch (context.request.level) {
          case "instance": {
            await deleteResource(
              context.ctx,
              context.request.fhirVersion,
              context.request.resource,
              context.request.id,
            );

            return {
              request: context.request,
              state: context.state,
              ctx: context.ctx,
              response: {
                fhirVersion: context.request.fhirVersion,
                type: "delete-response",
                level: "instance",
                resource: context.request.resource,
                id: context.request.id,
              } as FHIRResponse,
            };
          }
          case "type": {
            return {
              request: context.request,
              state: context.state,
              ctx: context.ctx,
              response: await conditionalDelete(context.ctx, {
                type: "search-request",
                fhirVersion: context.request.fhirVersion,
                level: "type",
                resource: context.request.resource,
                parameters: context.request.parameters,
              } as R4BTypeSearchRequest | R4TypeSearchRequest),
            };
          }
          case "system": {
            return {
              request: context.request,
              state: context.state,
              ctx: context.ctx,
              response: await conditionalDelete(context.ctx, {
                type: "search-request",
                fhirVersion: context.request.fhirVersion,
                level: "system",
                parameters: context.request.parameters,
              } as R4BSystemSearchRequest | R4SystemSearchRequest),
            };
          }
          default: {
            throw new OperationError(
              outcomeError("not-supported", `Invalid level.`),
            );
          }
        }
      }

      case "history-request": {
        const history = await context.ctx.store.history(
          context.ctx,
          context.request,
        );

        switch (context.request.level) {
          case "instance": {
            return {
              request: context.request,
              state: context.state,
              ctx: context.ctx,
              response: {
                fhirVersion: context.request.fhirVersion,
                type: "history-response",
                level: "instance",
                resource: context.request.resource,
                id: context.request.id,
                body: {
                  resourceType: "Bundle",
                  type: "history",
                  entry: history,
                },
              } as FHIRResponse,
            };
          }
          case "type": {
            return {
              request: context.request,
              state: context.state,
              ctx: context.ctx,
              response: {
                fhirVersion: context.request.fhirVersion,
                type: "history-response",
                level: "type",
                resource: context.request.resource,
                body: {
                  resourceType: "Bundle",
                  type: "history",
                  entry: history,
                },
              } as FHIRResponse,
            };
          }
          case "system": {
            return {
              request: context.request,
              state: context.state,
              ctx: context.ctx,
              response: {
                fhirVersion: context.request.fhirVersion,
                type: "history-response",
                level: "system",
                body: {
                  resourceType: "Bundle",
                  type: "history",
                  entry: history,
                },
              } as FHIRResponse,
            };
          }
          default: {
            throw new OperationError(
              outcomeError("invalid", "Invalid history level"),
            );
          }
        }
      }
      case "transaction-request": {
        let transactionBundle = context.request.body;
        const { locationsToUpdate, order } =
          await buildTransactionTopologicalGraph(
            context.ctx,
            context.request.fhirVersion,
            transactionBundle,
          );
        if (
          (transactionBundle.entry || []).length >
          context.state.transaction_entry_limit
        ) {
          throw new OperationError(
            outcomeError(
              "invalid",
              `Transaction bundle only allowed to have '${
                context.state.transaction_entry_limit
              }' entries. Current bundle has '${
                (transactionBundle.entry || []).length
              }'`,
            ),
          );
        }

        const responseEntries = [
          ...new Array((transactionBundle.entry || []).length),
        ];

        return DBTransaction(
          context.ctx,
          db.IsolationLevel.RepeatableRead,
          async (ctx: IGUHealthServerCTX) => {
            for (const index of order) {
              const entry = transactionBundle.entry?.[parseInt(index)];
              if (!entry)
                throw new OperationError(
                  outcomeFatal(
                    "exception",
                    "invalid entry in transaction processing.",
                  ),
                );

              if (!entry.request?.method) {
                throw new OperationError(
                  outcomeError(
                    "invalid",
                    `No request.method found at index '${index}'`,
                  ),
                );
              }
              if (!entry.request?.url) {
                throw new OperationError(
                  outcomeError(
                    "invalid",
                    `No request.url found at index '${index}'`,
                  ),
                );
              }

              const fhirRequest = httpRequestToFHIRRequest(
                context.request.fhirVersion,
                {
                  url: entry.request?.url || "",
                  method: entry.request?.method,
                  body: entry.resource,
                },
              );

              const fhirResponse = await ctx.client.request(ctx, fhirRequest);

              const responseEntry = fhirResponseToBundleEntry(
                ctx.tenant,
                fhirResponse,
              );
              responseEntries[parseInt(index)] = responseEntry;
              // Generate patches to update the transaction references.
              const patches = entry.fullUrl
                ? (locationsToUpdate[entry.fullUrl] || []).map(
                    (loc): Operation => {
                      if (!responseEntry.response?.location)
                        throw new OperationError(
                          outcomeFatal(
                            "exception",
                            "response location not found during transaction processing",
                          ),
                        );
                      return {
                        path: `/${loc.join("/")}`,
                        op: "replace",
                        value: {
                          reference: responseEntry.response?.location,
                        },
                      };
                    },
                  )
                : [];

              // End of loop and operation
              // Now update transaction bundle with applied references.
              transactionBundle = jsonpatch.applyPatch(
                transactionBundle,
                patches,
              ).newDocument;
            }

            const transactionResponse: Resource<
              typeof context.request.fhirVersion,
              "Bundle"
            > = {
              resourceType: "Bundle",
              type: "transaction-response" as code,
              entry: responseEntries,
            };

            return {
              state: context.state,
              ctx: context.ctx,
              request: context.request,
              response: {
                fhirVersion: context.request.fhirVersion,
                type: "transaction-response",
                level: "system",
                body: transactionResponse,
              } as FHIRResponse,
            };
          },
        );
      }
      default: {
        throw new OperationError(
          outcomeError(
            "not-supported",
            `Requests of type '${context.request.type}' are not yet supported`,
          ),
        );
      }
    }
  };
}

/**
 * Create a remote storage client.
 * @param param0 Options for the storage client.
 * @returns FHIRClient
 */
export function createRemoteStorage<CTX extends IGUHealthServerCTX>({
  transaction_entry_limit,
}: {
  transaction_entry_limit: number;
  synchronousIndexing: boolean;
}): FHIRClient<CTX> {
  const middleware: MiddlewareAsyncChain<StorageState, CTX>[] = [];
  middleware.push(createStorageMiddleware());

  return new AsynchronousClient<StorageState, CTX>(
    {
      transaction_entry_limit,
    },
    createMiddlewareAsync(middleware, { logging: false }),
  );
}
