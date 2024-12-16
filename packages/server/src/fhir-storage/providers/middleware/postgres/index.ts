import jsonpatch, { Operation } from "fast-json-patch";
import dayjs from "dayjs";
import * as db from "zapatos/db";
import * as s from "zapatos/schema";

import { FHIRClient } from "@iguhealth/client/interface";
import { AsynchronousClient } from "@iguhealth/client";
import {
  createMiddlewareAsync,
  MiddlewareAsync,
} from "@iguhealth/client/middleware";
import { code, id, unsignedInt, uri } from "@iguhealth/fhir-types/r4/types";
import {
  AllResourceTypes,
  FHIR_VERSION,
  R4,
  R4B,
  Resource,
  ResourceType,
} from "@iguhealth/fhir-types/versions";
import {
  isOperationError,
  OperationError,
  outcomeError,
  outcomeFatal,
} from "@iguhealth/operation-outcomes";
import {
  FHIRResponse,
  R4BHistoryInstanceRequest,
  R4BSystemHistoryRequest,
  R4BSystemSearchRequest,
  R4BTypeHistoryRequest,
  R4BTypeSearchRequest,
  R4HistoryInstanceRequest,
  R4SystemHistoryRequest,
  R4SystemSearchRequest,
  R4TypeHistoryRequest,
  R4TypeSearchRequest,
} from "@iguhealth/client/types";

import { deriveLimit } from "../../../utilities/search/parameters.js";
import {
  fhirResourceToBundleEntry,
  fhirResponseToBundleEntry,
} from "../../../utilities/bundle.js";
import { httpRequestToFHIRRequest } from "../../../../fhir-http/index.js";
import { IGUHealthServerCTX } from "../../../../fhir-api/types.js";
import { ParsedParameter } from "@iguhealth/client/url";
import {
  buildTransactionTopologicalGraph,
  FHIRTransaction,
} from "../../../transactions.js";
import { validateResource } from "../../../../fhir-operation-executors/providers/local/ops/resource_validate.js";
import { CUSTOM_CLAIMS } from "@iguhealth/jwt/types";
import { toDBFHIRVersion } from "../../../utilities/version.js";
import { generateId } from "../../../utilities/generateId.js";
import { createFHIRURL } from "../../../../fhir-api/constants.js";
import { PostgresStore } from "../../../resource-stores/postgres.js";
import { PostgresSearchEngine } from "../../../search-stores/postgres/index.js";
import { ResourceStore } from "../../../resource-stores/interface.js";
import { SearchEngine } from "../../../search-stores/interface.js";

type StorageState<CTX> = {
  transaction_entry_limit: number;
  store: ResourceStore<CTX>;
  search: SearchEngine<CTX>;
};

async function createResource<
  CTX extends IGUHealthServerCTX,
  Version extends FHIR_VERSION,
>(
  store: ResourceStore<CTX>,
  ctx: CTX,
  fhirVersion: Version,
  resource: Resource<Version, AllResourceTypes>,
): Promise<Resource<Version, AllResourceTypes>> {
  // For creation force new id.
  resource.id = generateId();
  return FHIRTransaction(ctx, db.IsolationLevel.ReadCommitted, async (ctx) => {
    const res = await store.insert(ctx, [
      {
        tenant: ctx.tenant,
        fhir_version: toDBFHIRVersion(fhirVersion),
        request_method: "POST",
        author_id: ctx.user.payload[CUSTOM_CLAIMS.RESOURCE_ID],
        author_type: ctx.user.payload[CUSTOM_CLAIMS.RESOURCE_TYPE],
        resource: resource as unknown as db.JSONObject,
      },
    ]);

    return res[0] as Resource<Version, AllResourceTypes>;
  });
}

async function getLatestVersionId(
  ctx: IGUHealthServerCTX,
  fhirVersion: FHIR_VERSION,
  id: string,
): Promise<id | undefined> {
  switch (fhirVersion) {
    case R4: {
      const res = await db
        .selectOne(
          "r4_sp1_idx",
          {
            r_id: id,
          },
          { columns: ["r_version_id"] },
        )
        .run(ctx.db);

      return res?.r_version_id.toString() as id | undefined;
    }
    case R4B: {
      const res = await db
        .selectOne(
          "r4b_sp1_idx",
          {
            r_id: id,
          },
          { columns: ["r_version_id"] },
        )
        .run(ctx.db);

      return res?.r_version_id.toString() as id | undefined;
    }
    default: {
      throw new OperationError(
        outcomeError("not-supported", `Unknown FHIR version.`),
      );
    }
  }
}

async function getResourceById<
  CTX extends IGUHealthServerCTX,
  Version extends FHIR_VERSION,
>(
  store: ResourceStore<CTX>,
  ctx: CTX,
  fhirVersion: Version,
  id: string,
): Promise<Resource<Version, AllResourceTypes> | undefined> {
  const versionId = await getLatestVersionId(ctx, fhirVersion, id);
  if (!versionId) return undefined;

  const res = await store.read(ctx, fhirVersion, [versionId]);
  return res[0];
}

async function getResource<
  CTX extends IGUHealthServerCTX,
  Version extends FHIR_VERSION,
  Type extends ResourceType<Version>,
>(
  store: ResourceStore<CTX>,
  ctx: IGUHealthServerCTX,
  fhirVersion: Version,
  resourceType: Type,
  id: string,
): Promise<Resource<Version, Type> | undefined> {
  const resource = await getResourceById(store, ctx, fhirVersion, id);

  if (resource === undefined || resource.resourceType !== resourceType) {
    return undefined;
  }

  return resource as Resource<Version, Type>;
}

async function getVersionedResource<Version extends FHIR_VERSION>(
  ctx: IGUHealthServerCTX,
  fhirVersion: Version,
  resourceType: ResourceType<Version>,
  id: string,
  versionId: string,
) {
  const res = await db
    .select("resources", {
      tenant: ctx.tenant,
      resource_type: resourceType,
      id: id,
      version_id: parseInt(versionId),
      fhir_version: toDBFHIRVersion(fhirVersion),
    })
    .run(ctx.db);

  if (res.length === 0) {
    throw new OperationError(
      outcomeError(
        "not-found",
        `'${resourceType}' with id '${id}' was not found`,
      ),
    );
  }

  return res[0].resource as unknown as Resource<Version, AllResourceTypes>;
}

const validHistoryParameters = ["_count", "_since", "_since-version"]; // "_at", "_list"]
function processHistoryParameters(
  parameters: ParsedParameter<string | number>[],
): s.resources.Whereable {
  const sqlParams: s.resources.Whereable = {};
  const _since = parameters.find((p) => p.name === "_since");
  const _since_versionId = parameters.find((p) => p.name === "_since-version");

  const invalidParameters = parameters.filter(
    (p) => validHistoryParameters.indexOf(p.name) === -1,
  );

  if (invalidParameters.length !== 0) {
    throw new OperationError(
      outcomeError(
        "invalid",
        `Invalid parameters: ${invalidParameters.map((p) => p.name).join(", ")}`,
      ),
    );
  }

  if (_since?.value[0] && typeof _since?.value[0] === "string") {
    const value = dayjs(_since.value[0], "YYYY-MM-DDThh:mm:ss+zz:zz");
    if (!value.isValid()) {
      throw new OperationError(
        outcomeError("invalid", "_since must be a valid date time."),
      );
    }
    sqlParams["created_at"] = db.sql`${db.self} >= ${db.param(value.toDate())}`;
  }

  if (_since_versionId?.value[0]) {
    const value = parseInt(_since_versionId.value[0].toString());
    if (isNaN(value)) {
      throw new OperationError(
        outcomeError("invalid", "_since-version must be a number."),
      );
    }
    sqlParams["version_id"] = db.sql`${db.self} > ${db.param(value)}`;
  }

  return sqlParams;
}

function historyLevelFilter(
  request:
    | R4HistoryInstanceRequest
    | R4TypeHistoryRequest
    | R4SystemHistoryRequest
    | R4BHistoryInstanceRequest
    | R4BTypeHistoryRequest
    | R4BSystemHistoryRequest,
): s.resources.Whereable {
  switch (request.level) {
    case "instance": {
      return {
        resource_type: request.resource,
        id: request.id,
      };
    }
    case "type": {
      return {
        resource_type: request.resource,
      };
    }
    case "system": {
      return {};
    }
    default:
      throw new OperationError(
        outcomeError("invalid", "Invalid history level"),
      );
  }
}

async function getHistory<
  CTX extends IGUHealthServerCTX,
  Version extends FHIR_VERSION,
>(
  ctx: CTX,
  fhirVersion: Version,
  filters: s.resources.Whereable,
  parameters: ParsedParameter<string | number>[],
): Promise<NonNullable<Resource<Version, "Bundle">["entry"]>> {
  const _count = parameters.find((p) => p.name === "_count");
  const limit = deriveLimit([0, 50], _count);

  const historyCols = <const>["resource", "request_method"];
  type HistoryReturn = s.resources.OnlyCols<typeof historyCols>;
  const historySQL = await db.sql<s.resources.SQL, HistoryReturn[]>`
  SELECT ${db.cols(historyCols)}
  FROM ${"resources"} 
  WHERE
  ${{
    fhir_version: toDBFHIRVersion(fhirVersion),
    tenant: ctx.tenant,
    ...filters,
    ...processHistoryParameters(parameters),
  }} ORDER BY ${"version_id"} DESC LIMIT ${db.param(limit)}`;

  const history = await historySQL.run(ctx.db);

  const resourceHistory = history.map((row) => {
    const resource = row.resource as unknown as Resource<
      Version,
      AllResourceTypes
    >;
    return {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      resource: resource as any,
      fullUrl: createFHIRURL(
        fhirVersion,
        ctx.tenant,
        `${resource.resourceType}/${resource.id}`,
      ),
      request: {
        url: `resource.resourceType}/${resource.id}` as uri,
        method: row.request_method as code,
      },
      response: {
        location: `${resource.resourceType}/${resource.id}` as uri,
        status: "200",
        etag: resource.meta?.versionId as id,
        lastModified: resource.meta?.lastUpdated,
      },
    };
  });

  return resourceHistory;
}

async function patchResource<
  CTX extends IGUHealthServerCTX,
  Version extends FHIR_VERSION,
>(
  store: ResourceStore<CTX>,
  ctx: CTX,
  fhirVersion: Version,
  resourceType: ResourceType<Version>,
  id: string,
  patches: Operation[],
): Promise<Resource<Version, AllResourceTypes>> {
  return FHIRTransaction(ctx, db.IsolationLevel.RepeatableRead, async (ctx) => {
    const existingResource = await getResource(
      store,
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

      const res = await store.insert(ctx, [
        {
          tenant: ctx.tenant,
          fhir_version: toDBFHIRVersion(fhirVersion),
          request_method: "PATCH",
          author_id: ctx.user.payload[CUSTOM_CLAIMS.RESOURCE_ID],
          author_type: ctx.user.payload[CUSTOM_CLAIMS.RESOURCE_TYPE],
          resource: newResource as unknown as db.JSONObject,
        },
      ]);

      const patchedResource = res[0] as Resource<Version, AllResourceTypes>;

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
  });
}

async function updateResource<
  CTX extends IGUHealthServerCTX,
  Version extends FHIR_VERSION,
>(
  store: ResourceStore<CTX>,
  ctx: CTX,
  fhirVersion: Version,
  resource: Resource<Version, AllResourceTypes>,
): Promise<{
  created: boolean;
  resource: Resource<Version, AllResourceTypes>;
}> {
  return FHIRTransaction(ctx, db.IsolationLevel.RepeatableRead, async (ctx) => {
    if (!resource.id)
      throw new OperationError(
        outcomeError("invalid", "Resource id not found on resource"),
      );

    const existingResource = await getResourceById(
      store,
      ctx,
      fhirVersion,
      resource.id,
    );

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

    const res = await store.insert(ctx, [
      {
        tenant: ctx.tenant,
        fhir_version: toDBFHIRVersion(fhirVersion),
        request_method: "PUT",
        author_id: ctx.user.payload[CUSTOM_CLAIMS.RESOURCE_ID],
        author_type: ctx.user.payload[CUSTOM_CLAIMS.RESOURCE_TYPE],
        resource: resource as unknown as db.JSONObject,
      },
    ]);

    const updatedResource = res[0] as Resource<Version, AllResourceTypes>;

    return {
      created: existingResource === undefined,
      resource: updatedResource,
    };
  });
}

async function deleteResource<
  CTX extends IGUHealthServerCTX,
  Version extends FHIR_VERSION,
>(
  store: ResourceStore<CTX>,
  ctx: CTX,
  fhirVersion: Version,
  resourceType: ResourceType<Version>,
  id: string,
) {
  return FHIRTransaction(ctx, db.IsolationLevel.RepeatableRead, async (ctx) => {
    const resource = await getResource(
      store,
      ctx,
      fhirVersion,
      resourceType,
      id,
    );
    if (!resource)
      throw new OperationError(
        outcomeError(
          "not-found",
          `'${resourceType}' with id '${id}' was not found`,
        ),
      );

    await store.insert(ctx, [
      {
        tenant: ctx.tenant,
        fhir_version: toDBFHIRVersion(fhirVersion),
        request_method: "DELETE",
        author_id: ctx.user.payload[CUSTOM_CLAIMS.RESOURCE_ID],
        author_type: ctx.user.payload[CUSTOM_CLAIMS.RESOURCE_TYPE],
        resource: resource as unknown as db.JSONObject,
        deleted: true,
      },
    ]);
  });
}

async function conditionalDelete(
  store: ResourceStore<IGUHealthServerCTX>,
  search: SearchEngine<IGUHealthServerCTX>,
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

  const result = await search.search(ctx, searchRequest);

  if ((result.total ?? limit + 1) > limit)
    throw new OperationError(
      outcomeError("too-costly", "The operation is too costly to perform."),
    );

  for (const { type, id } of result.result) {
    await deleteResource(store, ctx, searchRequest.fhirVersion, type, id);
  }

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
      } as FHIRResponse;
    }
  }
}

function createStorageMiddleware<
  CTX extends IGUHealthServerCTX,
  State extends StorageState<CTX>,
>(): MiddlewareAsync<State, CTX> {
  return createMiddlewareAsync<State, CTX>([
    async (context) => {
      switch (context.request.type) {
        case "read-request": {
          const resource = await getResource(
            context.state.store,
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
          const resource = await getVersionedResource(
            context.ctx,
            context.request.fhirVersion,
            context.request.resource,
            context.request.id,
            context.request.versionId,
          );

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
              body: resource,
            } as FHIRResponse,
          };
        }
        case "search-request": {
          const result = await context.state.search.search(
            context.ctx,
            context.request,
          );
          const resources = await context.state.store.read(
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
                context.state.store,

                context.ctx,
                context.request.fhirVersion,
                context.request.body,
              ),
            } as FHIRResponse,
          };
        }

        case "patch-request": {
          const savedResource = await patchResource(
            context.state.store,
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
              return FHIRTransaction(
                context.ctx,
                db.IsolationLevel.RepeatableRead,
                async (ctx) => {
                  const result = await context.state.search.search(ctx, {
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
                          context.state.store,
                          ctx,
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
                          context.state.store,
                          ctx,
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
                          context.state.store,
                          ctx,
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
                      if (
                        request.body.id &&
                        request.body.id !== foundResource.id
                      ) {
                        throw new OperationError(
                          outcomeError(
                            "invalid",
                            "Resource id provided does not match resource found.",
                          ),
                        );
                      }
                      const { created, resource } = await updateResource(
                        context.state.store,
                        ctx,
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
                        outcomeError(
                          "multiple-matches",
                          "Multiple matches found.",
                        ),
                      );
                    }
                  }
                },
              );
            }
            case "instance": {
              const { created, resource } = await updateResource(
                context.state.store,
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
                context.state.store,
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
                response: await conditionalDelete(
                  context.state.store,
                  context.state.search,
                  context.ctx,
                  {
                    type: "search-request",
                    fhirVersion: context.request.fhirVersion,
                    level: "type",
                    resource: context.request.resource,
                    parameters: context.request.parameters,
                  } as R4BTypeSearchRequest | R4TypeSearchRequest,
                ),
              };
            }
            case "system": {
              return {
                request: context.request,
                state: context.state,
                ctx: context.ctx,
                response: await conditionalDelete(
                  context.state.store,
                  context.state.search,
                  context.ctx,
                  {
                    type: "search-request",
                    fhirVersion: context.request.fhirVersion,
                    level: "system",
                    parameters: context.request.parameters,
                  } as R4BSystemSearchRequest | R4SystemSearchRequest,
                ),
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
          const history = await getHistory(
            context.ctx,
            context.request.fhirVersion,
            historyLevelFilter(context.request),
            context.request.parameters || [],
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

          return FHIRTransaction(
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
    },
  ]);
}

/**
 * Indexing middleware for searching. This happens within a single transaction if single postgres.
 * @returns
 */
function createSynchronousIndexingMiddleware<
  CTX extends IGUHealthServerCTX,
  State extends StorageState<CTX>,
>(): MiddlewareAsync<State, CTX> {
  return createMiddlewareAsync<State, CTX>([
    async (context, next) => {
      switch (context.request.type) {
        case "update-request":
        case "patch-request":
        case "create-request": {
          const response = await next(context);
          if (
            !["patch-response", "update-response", "create-response"].includes(
              response.response?.type ?? "",
            )
          )
            throw new OperationError(
              outcomeFatal("exception", "Invalid response"),
            );

          await context.state.search.index(
            context.ctx,
            context.request.fhirVersion,
            // Checked above for response type.
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (response.response as any)?.body,
          );

          return response;
        }
        case "delete-request": {
          throw new Error();
          // const response = await next(context);
          // await context.state.search.removeIndex(
          //   context.ctx,
          //   context.ctx.response.fhirVersion,
          //   response.resource,
          // );
        }
        default: {
          return next(context);
        }
      }
    },
  ]);
}

export function createPostgresClient<CTX extends IGUHealthServerCTX>(
  { transaction_entry_limit }: { transaction_entry_limit: number } = {
    transaction_entry_limit: 20,
  },
): FHIRClient<CTX> {
  return new AsynchronousClient<StorageState<CTX>, CTX>(
    {
      transaction_entry_limit,
      store: new PostgresStore(),
      search: new PostgresSearchEngine(),
    },
    createStorageMiddleware(),
  );
}
