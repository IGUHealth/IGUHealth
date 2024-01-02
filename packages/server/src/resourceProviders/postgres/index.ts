import pg from "pg";
import { v4 } from "uuid";
import jsonpatch, { Operation } from "fast-json-patch";
import dayjs from "dayjs";
import * as db from "zapatos/db";
import type * as s from "zapatos/schema";

import { FHIRClientAsync } from "@iguhealth/client/interface";
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

import {
  toStringParameters,
  toQuantityRange,
  toDateRange,
  toReference,
  toTokenParameters,
  toURIParameters,
} from "../utilities/search/dataConversion.js";
import {
  searchResources,
  deriveLimit,
} from "../utilities/search/parameters.js";
import { fhirResponseToBundleEntry } from "../utilities/bundle.js";
import { httpRequestToFHIRRequest } from "../../http/index.js";
import { FHIRServerCTX } from "../../ctx/types.js";
import { param_types_supported } from "./constants.js";
import { executeSearchQuery } from "./search/index.js";
import { ParsedParameter } from "@iguhealth/client/url";
import {
  transaction,
  ISOLATION_LEVEL,
  buildTransactionTopologicalGraph,
} from "../transactions.js";
import { validateResource } from "../../operation-executors/local/resource_validate.js";
import {
  HistoryInstanceRequest,
  SystemHistoryRequest,
  TypeHistoryRequest,
} from "@iguhealth/client/lib/types";

async function getAllParametersForResource<CTX extends FHIRServerCTX>(
  ctx: CTX,
  resourceTypes: ResourceType[],
  names?: string[]
): Promise<SearchParameter[]> {
  let parameters = [
    {
      name: "type",
      value: param_types_supported,
    },
    {
      name: "base",
      value: searchResources(resourceTypes),
    },
  ];

  if (names) {
    parameters = [...parameters, { name: "name", value: names }];
  }

  return (await ctx.client.search_type(ctx, "SearchParameter", parameters))
    .resources;
}

async function indexSearchParameter<CTX extends FHIRServerCTX>(
  client: pg.PoolClient,
  ctx: CTX,
  parameter: SearchParameter,
  resource: Resource & { id: id; meta: { versionId: id } },
  evaluation: MetaValueSingular<NonNullable<unknown>>[]
) {
  switch (parameter.type) {
    case "quantity": {
      const quantity_indexes: s.quantity_idx.Insertable[] = evaluation
        .map(toQuantityRange)
        .flat()
        .map(
          (value): s.quantity_idx.Insertable => ({
            workspace: ctx.workspace,
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
          })
        );

      await db
        .upsert(
          "quantity_idx",
          quantity_indexes,
          db.constraint("quantity_idx_pkey"),
          { updateColumns: db.doNothing }
        )
        .run(client);

      return;
    }
    case "date": {
      const date_indexes = evaluation
        .map(toDateRange)
        .flat()
        .map(
          (value): s.date_idx.Insertable => ({
            workspace: ctx.workspace,
            r_id: resource.id,
            resource_type: resource.resourceType,
            r_version_id: parseInt(resource.meta.versionId),
            parameter_name: parameter.name,
            parameter_url: parameter.url,
            start_date: value.start as unknown as Date,
            end_date: value.end as unknown as Date,
          })
        );
      await db
        .upsert("date_idx", date_indexes, db.constraint("date_idx_pkey"), {
          updateColumns: db.doNothing,
        })
        .run(client);
      return;
    }

    case "reference": {
      const references = (
        await Promise.all(evaluation.map((v) => toReference(ctx, parameter, v)))
      ).flat();

      const reference_indexes = references
        .filter(({ reference }) => {
          if (!reference.reference) {
            ctx.logger.warn("Cannot index logical reference.");
            return false;
          }
          return true;
        })
        .map(({ reference, resourceType, id }): s.reference_idx.Insertable => {
          if (!resourceType || !id) {
            throw new OperationError(
              outcomeError(
                "exception",
                "Resource type or id not found when indexing the resource."
              )
            );
          }
          return {
            workspace: ctx.workspace,
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
          "reference_idx",
          reference_indexes,
          db.constraint("reference_idx_unique"),
          {
            updateColumns: db.doNothing,
          }
        )
        .run(client);

      return;
    }
    case "uri": {
      const uri_indexes = evaluation
        .map((v) => toURIParameters(parameter, v))
        .flat()
        .map(
          (value): s.uri_idx.Insertable => ({
            workspace: ctx.workspace,
            r_id: resource.id,
            resource_type: resource.resourceType,
            r_version_id: parseInt(resource.meta.versionId),
            parameter_name: parameter.name,
            parameter_url: parameter.url,
            value,
          })
        );

      await db
        .upsert("uri_idx", uri_indexes, db.constraint("uri_idx_unique"), {
          updateColumns: db.doNothing,
        })
        .run(client);

      return;
    }
    case "token": {
      const token_indexes = evaluation
        .map((v) => toTokenParameters(parameter, v))
        .flat()
        .map(
          (value): s.token_idx.Insertable => ({
            workspace: ctx.workspace,
            r_id: resource.id,
            resource_type: resource.resourceType,
            r_version_id: parseInt(resource.meta.versionId),
            parameter_name: parameter.name,
            parameter_url: parameter.url,
            system: value.system,
            value: value.code,
          })
        );

      await db
        .upsert("token_idx", token_indexes, db.constraint("token_idx_unique"), {
          updateColumns: db.doNothing,
        })
        .run(client);

      return;
    }
    case "number": {
      const number_indexes = evaluation.map((v): s.number_idx.Insertable => {
        const value = v.valueOf();
        if (typeof value !== "number")
          throw new OperationError(
            outcomeError(
              "invalid",
              "Failed to index number. Value found is not a number."
            )
          );
        return {
          workspace: ctx.workspace,
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
          "number_idx",
          number_indexes,
          db.constraint("number_idx_unique"),
          {
            updateColumns: db.doNothing,
          }
        )
        .run(client);
      return;
    }

    case "string": {
      const string_indexes = evaluation
        .map(toStringParameters)
        .flat()
        .map(
          (value): s.string_idx.Insertable => ({
            workspace: ctx.workspace,
            r_id: resource.id,
            resource_type: resource.resourceType,
            r_version_id: parseInt(resource.meta.versionId),
            parameter_name: parameter.name,
            parameter_url: parameter.url,
            value,
          })
        );

      await db
        .upsert(
          "string_idx",
          string_indexes,
          db.constraint("string_idx_unique"),
          {
            updateColumns: db.doNothing,
          }
        )
        .run(client);

      return;
    }
    default:
      throw new OperationError(
        outcomeError(
          "not-supported",
          `Parameters of type '${parameter.type}' are not yet supported.`
        )
      );
  }
}

async function removeIndices(
  client: pg.PoolClient,
  _ctx: FHIRServerCTX,
  resource: Resource
) {
  await Promise.all(
    param_types_supported.map((type) => {
      return client.query(
        `DELETE FROM ${client.escapeIdentifier(type + "_idx")} WHERE r_id = $1`,
        [resource.id]
      );
    })
  );
}

function resourceIsValidForIndexing(
  resource: Resource
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

async function indexResource<CTX extends FHIRServerCTX>(
  client: pg.PoolClient,
  ctx: CTX,
  resource: Resource
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
            getSD: (type: uri) => {
              const canonicalURL = ctx.resolveTypeToCanonical(type);
              if (!canonicalURL)
                throw new OperationError(
                  outcomeFatal(
                    "exception",
                    `Could not resolve canonical url for type '${type}'`
                  )
                );
              return ctx.resolveCanonical("StructureDefinition", canonicalURL);
            },
          },
        }
      );

      if (!resourceIsValidForIndexing(resource)) {
        throw new OperationError(
          outcomeFatal(
            "exception",
            "Resource id or versionId not found when indexing the resource."
          )
        );
      }
      return indexSearchParameter(
        client,
        ctx,
        searchParameter,
        resource,
        evaluation
      );
    })
  );
}

async function createResource<CTX extends FHIRServerCTX>(
  client: pg.PoolClient,
  ctx: CTX,
  resource: Resource
): Promise<Resource> {
  return transaction(
    /* Only insertion don't need a guarantee around state of data */
    ISOLATION_LEVEL.ReadCommitted,
    ctx,
    client,
    async (ctx) => {
      const data: s.resources.Insertable = {
        workspace: ctx.workspace,
        request_method: "POST",
        author: ctx.author,
        resource: resource as unknown as db.JSONObject,
      };
      // the <const> prevents generalization to string[]
      const resourceCol = <const>["resource"];
      type ResourceReturn = s.resources.OnlyCols<typeof resourceCol>;
      const res = await db.sql<s.resources.SQL, ResourceReturn[]>`
      INSERT INTO ${"resources"}(${db.cols(data)}) VALUES(${db.vals(
        data
      )}) RETURNING ${db.cols(resourceCol)}
      `.run(client);

      await indexResource(client, ctx, res[0].resource as unknown as Resource);
      return res[0].resource as unknown as Resource;
    }
  );
}

async function getResource<CTX extends FHIRServerCTX>(
  client: pg.PoolClient,
  ctx: CTX,
  resourceType: ResourceType,
  id: string
): Promise<Resource> {
  const latestCols = <const>["resource", "deleted"];
  type ResourceReturn = s.resources.OnlyCols<typeof latestCols>;
  const getLatestVersionSQLFragment = db.sql<s.resources.SQL, ResourceReturn[]>`
    SELECT ${db.cols(latestCols)} FROM ${"resources"} WHERE ${{
    workspace: ctx.workspace,
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
        `'${resourceType}' with id '${id}' was not found`
      )
    );
  }
  return res[0].resource as unknown as Resource;
}

const validHistoryParameters = ["_count", "_since", "_since-version"]; // "_at", "_list"]
function processHistoryParameters(
  parameters: ParsedParameter<string | number>[]
): s.resources.Whereable {
  const sqlParams: s.resources.Whereable = {};
  const _since = parameters.find((p) => p.name === "_since");
  const _since_versionId = parameters.find((p) => p.name === "_since-version");

  const invalidParameters = parameters.filter(
    (p) => validHistoryParameters.indexOf(p.name) === -1
  );

  if (invalidParameters.length !== 0) {
    throw new OperationError(
      outcomeError(
        "invalid",
        `Invalid parameters: ${invalidParameters.map((p) => p.name).join(", ")}`
      )
    );
  }

  if (_since?.value[0] && typeof _since?.value[0] === "string") {
    sqlParams["created_at"] = db.sql`${db.self} >= ${db.param(
      dayjs(_since.value[0] as string, "YYYY-MM-DDThh:mm:ss+zz:zz").toDate()
    )}`;
  }

  if (_since_versionId?.value[0]) {
    sqlParams["version_id"] = db.sql`${db.self} > ${db.param(
      parseInt(_since_versionId.value[0].toString())
    )}`;
  }

  return sqlParams;
}

function historyLevelFilter(
  request: HistoryInstanceRequest | TypeHistoryRequest | SystemHistoryRequest
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
        outcomeError("invalid", "Invalid history level")
      );
  }
}

async function getHistory<CTX extends FHIRServerCTX>(
  client: pg.PoolClient,
  ctx: CTX,
  filters: s.resources.Whereable,
  parameters: ParsedParameter<string | number>[]
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
    workspace: ctx.workspace,
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
  client: pg.PoolClient,
  ctx: CTX,
  resourceType: ResourceType,
  id: string,
  patches: Operation[]
): Promise<Resource> {
  return transaction(ISOLATION_LEVEL.Serializable, ctx, client, async (ctx) => {
    const resource = await getResource(client, ctx, resourceType, id);
    try {
      const newResource = jsonpatch.applyPatch(resource, patches)
        .newDocument as Resource;

      const outcome = await validateResource(ctx, resourceType, {
        resource: newResource,
      });

      // Need to revaluate post application of patch to ensure that the resource is still valid.
      if (
        outcome.issue.filter(
          (i) => i.severity === "error" || i.severity === "fatal"
        ).length > 0
      ) {
        throw new OperationError(outcome);
      }

      if (
        newResource.resourceType !== resource.resourceType ||
        newResource.id !== resource.id
      ) {
        newResource.id = resource.id;
      }

      const data: s.resources.Insertable = {
        workspace: ctx.workspace,
        request_method: "PATCH",
        author: ctx.author,
        resource: newResource as unknown as db.JSONObject,
        prev_version_id: parseInt(resource.meta?.versionId as string),
        patches: JSON.stringify(patches),
      };

      const resourceCol = <const>["resource"];
      type ResourceReturn = s.resources.OnlyCols<typeof resourceCol>;
      const res = await db.sql<s.resources.SQL, ResourceReturn[]>`
        INSERT INTO ${"resources"}(${db.cols(data)}) VALUES(${db.vals(
        data
      )}) RETURNING ${db.cols(resourceCol)}`.run(client);

      const patchedResource = res[0].resource as unknown as Resource;

      await indexResource(client, ctx, patchedResource);
      return patchedResource;
    } catch (e) {
      if (e instanceof OperationError) throw e;
      else {
        ctx.logger.error(e);
        throw new OperationError(
          outcomeError(
            "structure",
            `Patch could not be applied to the given resource '${resourceType}/${id}'`
          )
        );
      }
    }
  });
}

async function updateResource<CTX extends FHIRServerCTX>(
  client: pg.PoolClient,
  ctx: CTX,
  resource: Resource
): Promise<Resource> {
  return transaction(ISOLATION_LEVEL.Serializable, ctx, client, async (ctx) => {
    if (!resource.id)
      throw new OperationError(
        outcomeError("invalid", "Resource id not found on resource")
      );

    const existingResource = await getResource(
      client,
      ctx,
      resource.resourceType,
      resource.id
    );

    if (!existingResource)
      throw new OperationError(
        outcomeError(
          "not-found",
          `'${resource.resourceType}' with id '${resource.id}' was not found`
        )
      );

    const data: s.resources.Insertable = {
      workspace: ctx.workspace,
      request_method: "PUT",
      author: ctx.author,
      resource: resource as unknown as db.JSONObject,
      prev_version_id: parseInt(resource.meta?.versionId as string),
      // [TODO] probably uneccessary to insert this and can instead derive in case of syncing.
      patches: JSON.stringify([{ op: "replace", path: "", value: resource }]),
    };

    const resourceCol = <const>["resource"];
    type ResourceReturn = s.resources.OnlyCols<typeof resourceCol>;
    const res = await db.sql<s.resources.SQL, ResourceReturn[]>`
        INSERT INTO ${"resources"}(${db.cols(data)}) VALUES(${db.vals(
      data
    )}) RETURNING ${db.cols(resourceCol)}`.run(client);

    const updatedResource = res[0].resource as unknown as Resource;
    await indexResource(client, ctx, updatedResource);
    return updatedResource;
  });
}

async function deleteResource<CTX extends FHIRServerCTX>(
  client: pg.PoolClient,
  ctx: CTX,
  resourceType: ResourceType,
  id: string
) {
  return transaction(
    ISOLATION_LEVEL.RepeatableRead,
    ctx,
    client,
    async (ctx) => {
      const resource = await getResource(client, ctx, resourceType, id);
      if (!resource)
        throw new OperationError(
          outcomeError(
            "not-found",
            `'${resourceType}' with id '${id}' was not found`
          )
        );

      const data: s.resources.Insertable = {
        workspace: ctx.workspace,
        request_method: "DELETE",
        author: ctx.author,
        resource: resource as unknown as db.JSONObject,
        prev_version_id: parseInt(resource.meta?.versionId as string),
        deleted: true,
      };

      const resourceCol = <const>["resource"];
      type ResourceReturn = s.resources.OnlyCols<typeof resourceCol>;

      const deleteResource = await db.sql<s.resources.SQL, ResourceReturn[]>`
        INSERT INTO ${"resources"}(${db.cols(data)}) VALUES(${db.vals(
        data
      )}) RETURNING ${db.cols(resourceCol)}`;

      await deleteResource.run(client);
      await removeIndices(client, ctx, resource);
    }
  );
}

function createPostgresMiddleware<
  State extends { client: pg.PoolClient; transaction_entry_limit: number },
  CTX extends FHIRServerCTX
>(): MiddlewareAsync<State, CTX> {
  return createMiddlewareAsync<State, CTX>([
    async (context, next) => {
      switch (context.request.type) {
        case "read-request": {
          const resource = await getResource(
            context.state.client,
            context.ctx,
            context.request.resourceType,
            context.request.id
          );
          return {
            state: context.state,
            ctx: context.ctx,
            request: context.request,
            response: {
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
            context.state.client,
            context.ctx,
            context.request
          );
          switch (context.request.level) {
            case "system": {
              return {
                request: context.request,
                state: context.state,
                ctx: context.ctx,
                response: {
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
            context.state.client,
            context.ctx,
            {
              ...context.request.body,
              id: v4() as id,
            }
          );

          return {
            request: context.request,
            state: context.state,
            ctx: context.ctx,
            response: {
              level: "type",
              resourceType: context.request.resourceType,
              type: "create-response",
              body: savedResource,
            },
          };
        }

        case "patch-request": {
          const savedResource = await patchResource(
            context.state.client,
            context.ctx,
            context.request.resourceType,
            context.request.id,
            context.request.body as Operation[]
          );

          return {
            request: context.request,
            state: context.state,
            ctx: context.ctx,
            response: {
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
            context.state.client,
            context.ctx,
            // Set the id for the request body to ensure that the resource is updated correctly.
            // Should be pased on the request.id and request.resourceType
            {
              ...context.request.body,
              id: context.request.id,
            }
          );

          return {
            request: context.request,
            state: context.state,
            ctx: context.ctx,
            response: {
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
            context.state.client,
            context.ctx,
            context.request.resourceType,
            context.request.id
          );

          return {
            request: context.request,
            state: context.state,
            ctx: context.ctx,
            response: {
              type: "delete-response",
              level: "instance",
              resourceType: context.request.resourceType,
              id: context.request.id,
            },
          };
        }

        case "history-request": {
          const history = await getHistory(
            context.state.client,
            context.ctx,
            historyLevelFilter(context.request),
            context.request.parameters || []
          );

          switch (context.request.level) {
            case "instance": {
              return {
                request: context.request,
                state: context.state,
                ctx: context.ctx,
                response: {
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
                  type: "history-response",
                  level: "system",
                  body: history,
                },
              };
            }
            default: {
              throw new OperationError(
                outcomeError("invalid", "Invalid history level")
              );
            }
          }
        }

        case "transaction-request": {
          let transactionBundle = context.request.body;
          const { locationsToUpdate, order } = buildTransactionTopologicalGraph(
            context.ctx,
            transactionBundle
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
                }'`
              )
            );
          }
          const responseEntries: BundleEntry[] = [
            ...new Array((transactionBundle.entry || []).length),
          ];
          return transaction(
            ISOLATION_LEVEL.RepeatableRead,
            context.ctx,
            context.state.client,
            async (ctx) => {
              for (const index of order) {
                const entry = transactionBundle.entry?.[parseInt(index)];
                if (!entry)
                  throw new OperationError(
                    outcomeFatal(
                      "exception",
                      "invalid entry in transaction processing."
                    )
                  );

                if (!entry.request?.method) {
                  throw new OperationError(
                    outcomeError(
                      "invalid",
                      `No request.method found at index '${index}'`
                    )
                  );
                }
                if (!entry.request?.url) {
                  throw new OperationError(
                    outcomeError(
                      "invalid",
                      `No request.url found at index '${index}'`
                    )
                  );
                }
                const fhirRequest = httpRequestToFHIRRequest({
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
                              "response location not found during transaction processing"
                            )
                          );
                        return {
                          path: `/${loc.join("/")}`,
                          op: "replace",
                          value: {
                            reference: responseEntry.response?.location,
                          },
                        };
                      }
                    )
                  : [];

                // Update transaction bundle with applied references.
                transactionBundle = jsonpatch.applyPatch(
                  transactionBundle,
                  patches
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
                  type: "transaction-response",
                  level: "system",
                  body: transactionResponse,
                },
              };
            }
          );
        }
        default:
          throw new OperationError(
            outcomeError(
              "not-supported",
              `Requests of type '${context.request.type}' are not yet supported`
            )
          );
      }
    },
  ]);
}

export function createPostgresClient<CTX extends FHIRServerCTX>(
  client: pg.PoolClient,
  { transaction_entry_limit }: { transaction_entry_limit: number } = {
    transaction_entry_limit: 20,
  }
): FHIRClientAsync<CTX> {
  return new AsynchronousClient<
    { client: pg.PoolClient; transaction_entry_limit: number },
    CTX
  >({ client, transaction_entry_limit }, createPostgresMiddleware());
}
