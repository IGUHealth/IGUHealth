import { nanoid } from "nanoid";
import jsonpatch, { Operation } from "fast-json-patch";
import dayjs from "dayjs";
import * as db from "zapatos/db";
import type * as s from "zapatos/schema";

import { FHIRClient } from "@iguhealth/client/interface";
import { AsynchronousClient } from "@iguhealth/client";
import {
  createMiddlewareAsync,
  MiddlewareAsync,
} from "@iguhealth/client/middleware";
import {
  Bundle,
  BundleEntry,
  code,
  id,
  Resource,
  ResourceType,
  SearchParameter,
  unsignedInt,
  uri,
} from "@iguhealth/fhir-types/r4/types";
import { evaluateWithMeta } from "@iguhealth/fhirpath";
import { MetaValueSingular } from "@iguhealth/meta-value";
import {
  OperationError,
  outcomeError,
  outcomeFatal,
} from "@iguhealth/operation-outcomes";

import dataConversion from "../../utilities/search/dataConversion.js";
import {
  searchResources,
  deriveLimit,
  searchParameterToTableName,
} from "../../utilities/search/parameters.js";
import { fhirResponseToBundleEntry } from "../../utilities/bundle.js";
import { httpRequestToFHIRRequest } from "../../../fhir-http/index.js";
import {
  asSystemCTX,
  FHIRServerCTX,
} from "../../../fhir-api/types.js";
import { param_types_supported } from "./constants.js";
import { executeSearchQuery } from "./search/index.js";
import { ParsedParameter } from "@iguhealth/client/url";
import { buildTransactionTopologicalGraph } from "../../transactions.js";
import { validateResource } from "../../../fhir-operation-executors/providers/local/resource_validate.js";
import {
  R4HistoryInstanceRequest,
  R4SystemHistoryRequest,
  R4TypeHistoryRequest,
} from "@iguhealth/client/lib/types";
import { createResolverRemoteCanonical } from "../../utilities/canonical.js";
import { TenantId } from "@iguhealth/jwt";
import { FHIR_VERSION, R4, R4B } from "@iguhealth/fhir-types/versions";

async function getAllParametersForResource<CTX extends FHIRServerCTX>(
  ctx: CTX,
  resourceTypes: ResourceType[],
): Promise<SearchParameter[]> {
  const parameters = [
    {
      name: "type",
      value: param_types_supported,
    },
    {
      name: "base",
      value: searchResources(resourceTypes),
    },
  ];

  return (
    await ctx.client.search_type(
      asSystemCTX(ctx),
      R4,
      "SearchParameter",
      parameters,
    )
  ).resources;
}

async function indexR4SearchParameter<CTX extends FHIRServerCTX>(
  client: db.Queryable,
  ctx: CTX,
  parameter: SearchParameter,
  resource: Resource & { id: id; meta: { versionId: id } },
  evaluation: MetaValueSingular<NonNullable<unknown>>[],
) {
  switch (parameter.type) {
    case "quantity": {
      const quantity_indexes: s.r4_quantity_idx.Insertable[] = (await dataConversion(parameter, "quantity", evaluation))
        .map(
          (value): s.r4_quantity_idx.Insertable => ({
            tenant: ctx.tenant,
            r_id: resource.id,
            resource_type: resource.resourceType,
            r_version_id: parseInt(resource.meta.versionId),
            parameter_name: parameter.name,
            parameter_url: parameter.url,
            // Note because I can use string -infinity for the start value, I need to cast it to number here even though technically string,
            start_value: value.start?.value as number | undefined,
            start_system: value.start?.system,
            start_code: value.start?.code,
            // Note because I can use string infinity for the start value, I need to cast it to number here even though technically string,
            end_value: value.end?.value as number | undefined,
            end_system: value.end?.system,
            end_code: value.end?.code,
          }),
        );

      await db
        .upsert(
          "r4_quantity_idx",
          quantity_indexes,
          db.constraint("quantity_idx_pkey"),
          { updateColumns: db.doNothing },
        )
        .run(client);

      return;
    }
    case "date": {
      const date_indexes = (await dataConversion(parameter, "date", evaluation))
        .flat()
        .map(
          (value): s.r4_date_idx.Insertable => ({
            tenant: ctx.tenant,
            r_id: resource.id,
            resource_type: resource.resourceType,
            r_version_id: parseInt(resource.meta.versionId),
            parameter_name: parameter.name,
            parameter_url: parameter.url,
            start_date: value.start as unknown as Date,
            end_date: value.end as unknown as Date,
          }),
        );
      await db
        .upsert("r4_date_idx", date_indexes, db.constraint("date_idx_pkey"), {
          updateColumns: db.doNothing,
        })
        .run(client);
      return;
    }

    case "reference": {
      const references = (await dataConversion(parameter, "reference", evaluation, createResolverRemoteCanonical(ctx))).flat();

      const reference_indexes = references
        .filter(({ reference }) => {
          if (!reference.reference) {
            ctx.logger.warn("Cannot index logical reference.");
            return false;
          }
          return true;
        })
        .map(({ reference, resourceType, id }): s.r4_reference_idx.Insertable => {
          if (!resourceType || !id) {
            throw new OperationError(
              outcomeError(
                "exception",
                "Resource type or id not found when indexing the resource.",
              ),
            );
          }
          return {
            tenant: ctx.tenant,
            r_id: resource.id,
            resource_type: resource.resourceType,
            r_version_id: parseInt(resource.meta.versionId),
            parameter_name: parameter.name,
            parameter_url: parameter.url,
            reference: reference as db.JSONValue,
            reference_type: resourceType,
            reference_id: id,
          };
        });

      await db
        .upsert(
          "r4_reference_idx",
          reference_indexes,
          db.constraint("reference_idx_unique"),
          {
            updateColumns: db.doNothing,
          },
        )
        .run(client);

      return;
    }
    case "uri": {
      const uri_indexes = (await dataConversion(parameter, "uri", evaluation))
        .flat()
        .map(
          (value): s.r4_uri_idx.Insertable => ({
            tenant: ctx.tenant,
            r_id: resource.id,
            resource_type: resource.resourceType,
            r_version_id: parseInt(resource.meta.versionId),
            parameter_name: parameter.name,
            parameter_url: parameter.url,
            value,
          }),
        );

      await db
        .upsert("r4_uri_idx", uri_indexes, db.constraint("uri_idx_unique"), {
          updateColumns: db.doNothing,
        })
        .run(client);

      return;
    }
    case "token": {
      const token_indexes = (await dataConversion(parameter, "token", evaluation))
        .flat()
        .map(
          (value): s.r4_token_idx.Insertable => ({
            tenant: ctx.tenant,
            r_id: resource.id,
            resource_type: resource.resourceType,
            r_version_id: parseInt(resource.meta.versionId),
            parameter_name: parameter.name,
            parameter_url: parameter.url,
            system: value.system,
            value: value.code,
          }),
        );

      await db
        .upsert("r4_token_idx", token_indexes, db.constraint("token_idx_unique"), {
          updateColumns: db.doNothing,
        })
        .run(client);

      return;
    }
    case "number": {
      const number_indexes = (await dataConversion(parameter, "number", evaluation)).map((value): s.r4_number_idx.Insertable => {
        if (typeof value !== "number")
          throw new OperationError(
            outcomeError(
              "invalid",
              "Failed to index number. Value found is not a number.",
            ),
          );
        return {
          tenant: ctx.tenant,
          r_id: resource.id,
          resource_type: resource.resourceType,
          r_version_id: parseInt(resource.meta.versionId),
          parameter_name: parameter.name,
          parameter_url: parameter.url,
          value,
        };
      });

      await db
        .upsert(
          "r4_number_idx",
          number_indexes,
          db.constraint("number_idx_unique"),
          {
            updateColumns: db.doNothing,
          },
        )
        .run(client);
      return;
    }

    case "string": {
      const string_indexes = (await dataConversion(parameter, "string", evaluation))
        .flat()
        .map(
          (value): s.r4_string_idx.Insertable => ({
            tenant: ctx.tenant,
            r_id: resource.id,
            resource_type: resource.resourceType,
            r_version_id: parseInt(resource.meta.versionId),
            parameter_name: parameter.name,
            parameter_url: parameter.url,
            value,
          }),
        );

      await db
        .upsert(
          "r4_string_idx",
          string_indexes,
          db.constraint("string_idx_unique"),
          {
            updateColumns: db.doNothing,
          },
        )
        .run(client);

      return;
    }
    default:
      throw new OperationError(
        outcomeError(
          "not-supported",
          `Parameters of type '${parameter.type}' are not yet supported.`,
        ),
      );
  }
}

async function removeIndices(
  client: db.Queryable,
  _ctx: FHIRServerCTX,
  resource: Resource,
) {
  await Promise.all(
    param_types_supported.map((type) => {
      return db.sql<
        | s.r4_number_idx.SQL
        | s.r4_string_idx.SQL
        | s.r4_uri_idx.SQL
        | s.r4_date_idx.SQL
        | s.r4_token_idx.SQL
        | s.r4_reference_idx.SQL
        | s.r4_quantity_idx.SQL
      >`DELETE FROM ${searchParameterToTableName(R4, type)} WHERE ${{
        r_id: resource.id,
      }}`.run(client);
    }),
  );
}

function resourceIsValidForIndexing(
  resource: Resource,
): resource is Resource & { id: id; meta: { versionId: id } } {
  if (
    !resource.id ||
    (!resource.meta?.versionId &&
      isNaN(parseInt(resource.meta?.versionId || "")))
  ) {
    return false;
  }
  return true;
}

async function indexR4Resource<CTX extends FHIRServerCTX>(
  client: db.Queryable,
  ctx: CTX,
  fhirVersion: FHIR_VERSION,
  resource: Resource,
) {
  await removeIndices(client, ctx, resource);
  const searchParameters = await getAllParametersForResource(ctx, [
    resource.resourceType,
  ]);
  await Promise.all(
    searchParameters.map((searchParameter) => {
      if (searchParameter.expression === undefined) return;
      const evaluation = evaluateWithMeta(
        searchParameter.expression,
        resource,
        {
          meta: {
            fhirVersion,
            getSD: (fhirVersion, type: uri) => {
              const canonicalURL = ctx.resolveTypeToCanonical(fhirVersion, type);
              if (!canonicalURL)
                throw new OperationError(
                  outcomeFatal(
                    "exception",
                    `Could not resolve canonical url for type '${type}'`,
                  ),
                );
              return ctx.resolveCanonical(fhirVersion, "StructureDefinition", canonicalURL);
            },
          },
        },
      );

      if (!resourceIsValidForIndexing(resource)) {
        throw new OperationError(
          outcomeFatal(
            "exception",
            "Resource id or versionId not found when indexing the resource.",
          ),
        );
      }
      return indexR4SearchParameter(
        client,
        ctx,
        searchParameter,
        resource,
        evaluation,
      );
    }),
  );
}

async function createResource<CTX extends FHIRServerCTX>(
  client: db.Queryable,
  initCTX: CTX,
  fhirVersion: FHIR_VERSION,
  resource: Resource,
): Promise<Resource> {
  return db.transaction(
    client,
    db.IsolationLevel.ReadCommitted,
    async (client) => {
      const ctx = { ...initCTX, db: client };
      const data: s.resources.Insertable = {
        tenant: ctx.tenant,
        fhir_version: "r4",
        request_method: "POST",
        author: ctx.user.jwt.sub,
        resource: resource as unknown as db.JSONObject,
      };
      // the <const> prevents generalization to string[]
      const resourceCol = <const>["resource"];
      type ResourceReturn = s.resources.OnlyCols<typeof resourceCol>;
      const res = await db.sql<s.resources.SQL, ResourceReturn[]>`
    INSERT INTO ${"resources"}(${db.cols(data)}) VALUES(${db.vals(
      data,
    )}) RETURNING ${db.cols(resourceCol)}
    `.run(client);

      await indexR4Resource(client, ctx, fhirVersion, res[0].resource as unknown as Resource);
      return res[0].resource as unknown as Resource;
    },
  );
}

async function getResource(
  client: db.Queryable,
  tenant: TenantId,
  resourceType: ResourceType,
  id: string,
): Promise<Resource> {
  const latestCols = <const>["resource", "deleted"];
  type ResourceReturn = s.resources.OnlyCols<typeof latestCols>;
  const getLatestVersionSQLFragment = db.sql<s.resources.SQL, ResourceReturn[]>`
    SELECT ${db.cols(latestCols)} FROM ${"resources"} WHERE ${{
      tenant: tenant,
      resource_type: resourceType,
      id: id,
    }} ORDER BY ${"version_id"} DESC LIMIT 1
  `;

  const res = await db.sql<s.resources.SQL, s.resources.Selectable[]>`
  SELECT * FROM (${getLatestVersionSQLFragment}) as t WHERE t.deleted = false
  `.run(client);

  if (res.length === 0) {
    throw new OperationError(
      outcomeError(
        "not-found",
        `'${resourceType}' with id '${id}' was not found`,
      ),
    );
  }
  return res[0].resource as unknown as Resource;
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
    sqlParams["created_at"] = db.sql`${db.self} >= ${db.param(
      dayjs(_since.value[0], "YYYY-MM-DDThh:mm:ss+zz:zz").toDate(),
    )}`;
  }

  if (_since_versionId?.value[0]) {
    sqlParams["version_id"] = db.sql`${db.self} > ${db.param(
      parseInt(_since_versionId.value[0].toString()),
    )}`;
  }

  return sqlParams;
}

function historyLevelFilter(
  request: R4HistoryInstanceRequest | R4TypeHistoryRequest | R4SystemHistoryRequest,
): s.resources.Whereable {
  switch (request.level) {
    case "instance": {
      return {
        resource_type: request.resourceType,
        id: request.id,
      };
    }
    case "type": {
      return {
        resource_type: request.resourceType,
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

async function getHistory<CTX extends FHIRServerCTX>(
  client: db.Queryable,
  ctx: CTX,
  filters: s.resources.Whereable,
  parameters: ParsedParameter<string | number>[],
): Promise<BundleEntry[]> {
  const _count = parameters.find((p) => p.name === "_count");
  const limit = deriveLimit([0, 50], _count);

  const historyCols = <const>["resource", "request_method"];
  type HistoryReturn = s.resources.OnlyCols<typeof historyCols>;
  const historySQL = await db.sql<s.resources.SQL, HistoryReturn[]>`
  SELECT ${db.cols(historyCols)}
  FROM ${"resources"} 
  WHERE
  ${{
    tenant: ctx.tenant,
    ...filters,
    ...processHistoryParameters(parameters),
  }} ORDER BY ${"version_id"} DESC LIMIT ${db.param(limit)}`;

  const history = await historySQL.run(client);

  const resourceHistory = history.map((row) => ({
    resource: row.resource as unknown as Resource,
    request: {
      url: `${(row.resource as unknown as Resource).resourceType}/${
        (row.resource as unknown as Resource).id
      }` as uri,
      method: row.request_method as code,
    },
  }));

  return resourceHistory;
}

async function patchResource<CTX extends FHIRServerCTX>(
  client: db.Queryable,
  initCTX: CTX,
  fhirVersion: FHIR_VERSION,
  resourceType: ResourceType,
  id: string,
  patches: Operation[],
): Promise<Resource> {
  return db.transaction(
    client,
    db.IsolationLevel.Serializable,
    async (client) => {
      const ctx = { ...initCTX, db: client };
      const existingResource = await getResource(
        client,
        ctx.tenant,
        resourceType,
        id,
      );
      try {
        const newResource = jsonpatch.applyPatch(existingResource, patches)
          .newDocument as Resource;

        const outcome = await validateResource(ctx, R4, resourceType, {
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

        const data: s.resources.Insertable = {
          tenant: ctx.tenant,
          fhir_version: "r4",
          request_method: "PATCH",
          author: ctx.user.jwt.sub,
          resource: newResource as unknown as db.JSONObject,
          prev_version_id: parseInt(existingResource.meta?.versionId as string),
          patches: JSON.stringify(patches),
        };

        const resourceCol = <const>["resource"];
        type ResourceReturn = s.resources.OnlyCols<typeof resourceCol>;
        const res = await db.sql<s.resources.SQL, ResourceReturn[]>`
        INSERT INTO ${"resources"}(${db.cols(data)}) VALUES(${db.vals(
          data,
        )}) RETURNING ${db.cols(resourceCol)}`.run(client);

        const patchedResource = res[0].resource as unknown as Resource;

        await indexR4Resource(client, ctx, fhirVersion, patchedResource);
        return patchedResource;
      } catch (e) {
        if (e instanceof OperationError) throw e;
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
    },
  );
}

async function updateResource<CTX extends FHIRServerCTX>(
  client: db.Queryable,
  initCTX: CTX,
  fhirVersion: FHIR_VERSION,
  resource: Resource,
): Promise<Resource> {
  return db.transaction(
    client,
    db.IsolationLevel.Serializable,
    async (client) => {
      const ctx = { ...initCTX, db: client };
      if (!resource.id)
        throw new OperationError(
          outcomeError("invalid", "Resource id not found on resource"),
        );

      const existingResource = await getResource(
        client,
        ctx.tenant,
        resource.resourceType,
        resource.id,
      );

      if (!existingResource)
        throw new OperationError(
          outcomeError(
            "not-found",
            `'${resource.resourceType}' with id '${resource.id}' was not found`,
          ),
        );

      const data: s.resources.Insertable = {
        tenant: ctx.tenant,
        fhir_version: "r4",
        request_method: "PUT",
        author: ctx.user.jwt.sub,
        resource: resource as unknown as db.JSONObject,
        prev_version_id: parseInt(existingResource.meta?.versionId as string),
        // [TODO] probably uneccessary to insert this and can instead derive in case of syncing.
        patches: JSON.stringify([{ op: "replace", path: "", value: resource }]),
      };

      const resourceCol = <const>["resource"];
      type ResourceReturn = s.resources.OnlyCols<typeof resourceCol>;
      const res = await db.sql<s.resources.SQL, ResourceReturn[]>`
        INSERT INTO ${"resources"}(${db.cols(data)}) VALUES(${db.vals(
          data,
        )}) RETURNING ${db.cols(resourceCol)}`.run(client);

      const updatedResource = res[0].resource as unknown as Resource;
      await indexR4Resource(client, ctx, fhirVersion, updatedResource);
      return updatedResource;
    },
  );
}

async function deleteResource<CTX extends FHIRServerCTX>(
  client: db.Queryable,
  initCTX: CTX,
  resourceType: ResourceType,
  id: string,
) {
  return db.transaction(
    client,
    db.IsolationLevel.RepeatableRead,
    async (client) => {
      const ctx = { ...initCTX, db: client };

      const resource = await getResource(client, ctx.tenant, resourceType, id);
      if (!resource)
        throw new OperationError(
          outcomeError(
            "not-found",
            `'${resourceType}' with id '${id}' was not found`,
          ),
        );

      const data: s.resources.Insertable = {
        tenant: ctx.tenant,
        fhir_version: "r4",
        request_method: "DELETE",
        author: ctx.user.jwt.sub,
        resource: resource as unknown as db.JSONObject,
        prev_version_id: parseInt(resource.meta?.versionId as string),
        deleted: true,
      };

      const resourceCol = <const>["resource"];
      type ResourceReturn = s.resources.OnlyCols<typeof resourceCol>;

      const deleteResource = await db.sql<s.resources.SQL, ResourceReturn[]>`
      INSERT INTO ${"resources"}(${db.cols(data)}) VALUES(${db.vals(
        data,
      )}) RETURNING ${db.cols(resourceCol)}`;

      await deleteResource.run(client);
      await removeIndices(client, ctx, resource);
    },
  );
}

function createPostgresMiddleware<
  State extends {
    transaction_entry_limit: number;
  },
  CTX extends FHIRServerCTX,
>(): MiddlewareAsync<State, CTX> {
  return createMiddlewareAsync<State, CTX>([
    async (context) => {
      switch(context.request.fhirVersion) {
        case R4B: {
          throw new OperationError(
            outcomeError("not-supported", "FHIR version '4.3' is not supported."),
          );
        }
        case R4:{
          switch (context.request.type) {
            case "read-request": {
              const resource = await getResource(
                context.ctx.db,
                context.ctx.tenant,
                context.request.resourceType,
                context.request.id,
              );
              return {
                state: context.state,
                ctx: context.ctx,
                request: context.request,
                response: {
                  fhirVersion: R4,
                  level: "instance",
                  type: "read-response",
                  resourceType: context.request.resourceType,
                  id: context.request.id,
                  body: resource,
                },
              };
            }
            case "search-request": {
              const result = await executeSearchQuery(
                context.ctx.db,
                context.ctx,
                context.request,
              );
              switch (context.request.level) {
                case "system": {
                  return {
                    request: context.request,
                    state: context.state,
                    ctx: context.ctx,
                    response: {
                      fhirVersion: R4,
                      type: "search-response",
                      parameters: context.request.parameters,
                      level: "system",
                      total: result.total as unsignedInt | undefined,
                      body: result.resources,
                    },
                  };
                }
                case "type": {
                  return {
                    request: context.request,
                    state: context.state,
                    ctx: context.ctx,
                    response: {
                      fhirVersion: R4,
                      type: "search-response",
                      parameters: context.request.parameters,
                      level: "type",
                      resourceType: context.request.resourceType,
                      total: result.total as unsignedInt | undefined,
                      body: result.resources,
                    },
                  };
                }
                default: {
                  throw new Error("Invalid search level");
                }
              }
            }
            case "create-request": {
              const savedResource = await createResource(
                context.ctx.db,
                context.ctx,
                context.request.fhirVersion,
                {
                  ...context.request.body,
                  // If the id is allowed to be set, use the id from the request body, otherwise generate a new id.
                  id: context.request.allowIdSet
                    ? context.request.body.id ?? (nanoid() as id)
                    : (nanoid() as id),
                },
              );

              return {
                request: context.request,
                state: context.state,
                ctx: context.ctx,
                response: {
                  fhirVersion: R4,
                  level: "type",
                  resourceType: context.request.resourceType,
                  type: "create-response",
                  body: savedResource,
                },
              };
            }

            case "patch-request": {
              const savedResource = await patchResource(
                context.ctx.db,
                context.ctx,
                context.request.fhirVersion,
                context.request.resourceType,
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
                  resourceType: context.request.resourceType,
                  id: context.request.id,
                  type: "patch-response",
                  body: savedResource,
                },
              };
            }
            case "update-request": {
              const savedResource = await updateResource(
                context.ctx.db,
                context.ctx,
                context.request.fhirVersion,
                // Set the id for the request body to ensure that the resource is updated correctly.
                // Should be pased on the request.id and request.resourceType
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
                  fhirVersion: R4,
                  level: "instance",
                  resourceType: context.request.resourceType,
                  id: context.request.id,
                  type: "update-response",
                  body: savedResource,
                },
              };
            }
            case "delete-request": {
              await deleteResource(
                context.ctx.db,
                context.ctx,
                context.request.resourceType,
                context.request.id,
              );

              return {
                request: context.request,
                state: context.state,
                ctx: context.ctx,
                response: {
                  fhirVersion: R4,
                  type: "delete-response",
                  level: "instance",
                  resourceType: context.request.resourceType,
                  id: context.request.id,
                },
              };
            }

            case "history-request": {
              const history = await getHistory(
                context.ctx.db,
                context.ctx,
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
                      fhirVersion: R4,
                      type: "history-response",
                      level: "instance",
                      resourceType: context.request.resourceType,
                      id: context.request.id,
                      body: history,
                    },
                  };
                }
                case "type": {
                  return {
                    request: context.request,
                    state: context.state,
                    ctx: context.ctx,
                    response: {
                      fhirVersion: R4,
                      type: "history-response",
                      level: "type",
                      resourceType: context.request.resourceType,
                      body: history,
                    },
                  };
                }
                case "system": {
                  return {
                    request: context.request,
                    state: context.state,
                    ctx: context.ctx,
                    response: {
                      fhirVersion: R4,
                      type: "history-response",
                      level: "system",
                      body: history,
                    },
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
              const { locationsToUpdate, order } = buildTransactionTopologicalGraph(
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
              const responseEntries: BundleEntry[] = [
                ...new Array((transactionBundle.entry || []).length),
              ];

              return db.transaction(
                context.ctx.db,
                db.IsolationLevel.RepeatableRead,
                async (client) => {
                  const ctx = { ...context.ctx, db: client };
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

                    const fhirRequest = httpRequestToFHIRRequest(context.request.fhirVersion, {
                      url: entry.request?.url || "",
                      method: entry.request?.method,
                      body: entry.resource,
                    });

                    const fhirResponse = await ctx.client.request(ctx, fhirRequest);

                    const responseEntry = fhirResponseToBundleEntry(fhirResponse);
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

                    // Update transaction bundle with applied references.
                    transactionBundle = jsonpatch.applyPatch(
                      transactionBundle,
                      patches,
                    ).newDocument;
                  }

                  const transactionResponse: Bundle = {
                    resourceType: "Bundle",
                    type: "transaction-response" as code,
                    entry: responseEntries,
                  };

                  return {
                    state: context.state,
                    ctx: context.ctx,
                    request: context.request,
                    response: {
                      fhirVersion: R4,
                      type: "transaction-response",
                      level: "system",
                      body: transactionResponse,
                    },
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
        }
      }
    },
  ]);
}

export function createPostgresClient<CTX extends FHIRServerCTX>(
  { transaction_entry_limit }: { transaction_entry_limit: number } = {
    transaction_entry_limit: 20,
  },
): FHIRClient<CTX> {
  return new AsynchronousClient<{ transaction_entry_limit: number }, CTX>(
    { transaction_entry_limit },
    createPostgresMiddleware(),
  );
}
