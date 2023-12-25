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
import { typeToUrl } from "@iguhealth/fhir-validation";

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
      await Promise.all(
        evaluation
          .map(toQuantityRange)
          .flat()
          .map(async (value) => {
            const QUANTITY_INDEX: s.quantity_idx.Insertable = {
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
            };
            await db.sql<
              s.quantity_idx.SQL,
              void
            >`INSERT INTO ${"quantity_idx"} (${db.cols(
              QUANTITY_INDEX
            )}) VALUES (${db.vals(QUANTITY_INDEX)})`.run(client);
          })
      );
      return;
    }
    case "date": {
      await Promise.all(
        evaluation
          .map(toDateRange)
          .flat()
          .map(async (value) => {
            const DATE_INDEX: s.date_idx.Insertable = {
              workspace: ctx.workspace,
              r_id: resource.id,
              resource_type: resource.resourceType,
              r_version_id: parseInt(resource.meta.versionId),
              parameter_name: parameter.name,
              parameter_url: parameter.url,
              start_date: value.start as unknown as Date,
              end_date: value.end as unknown as Date,
            };
            await db.sql<
              s.date_idx.SQL,
              void
            >`INSERT INTO ${"date_idx"} (${db.cols(
              DATE_INDEX
            )}) VALUES (${db.vals(DATE_INDEX)})`.run(client);
          })
      );
      return;
    }

    case "reference": {
      const references = (
        await Promise.all(evaluation.map((v) => toReference(ctx, parameter, v)))
      ).flat();

      await Promise.all(
        references.map(async ({ reference, resourceType, id }) => {
          if (!reference.reference) {
            ctx.logger.warn("Cannot index logical reference.");
            return;
          }
          if (!resourceType || !id) {
            throw new OperationError(
              outcomeError(
                "exception",
                "Resource type or id not found when indexing the resource."
              )
            );
          }
          const REFERENCE_INDEX: s.reference_idx.Insertable = {
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
          await db.sql<
            s.reference_idx.SQL,
            void
          >`INSERT INTO ${"reference_idx"} (${db.cols(
            REFERENCE_INDEX
          )}) VALUES (${db.vals(REFERENCE_INDEX)})`.run(client);
        })
      );
      return;
    }
    case "uri": {
      await Promise.all(
        evaluation
          .map((v) => toURIParameters(parameter, v))
          .flat()
          .map(async (value) => {
            const URI_INDEX: s.uri_idx.Insertable = {
              workspace: ctx.workspace,
              r_id: resource.id,
              resource_type: resource.resourceType,
              r_version_id: parseInt(resource.meta.versionId),
              parameter_name: parameter.name,
              parameter_url: parameter.url,
              value,
            };
            await db.sql<
              s.uri_idx.SQL,
              void
            >`INSERT INTO ${"uri_idx"} (${db.cols(
              URI_INDEX
            )}) VALUES (${db.vals(URI_INDEX)})`.run(client);
          })
      );
      return;
    }
    case "token": {
      await Promise.all(
        evaluation
          .map((v) => toTokenParameters(parameter, v))
          .flat()
          .map(async (value) => {
            const TOKEN_INDEX: s.token_idx.Insertable = {
              workspace: ctx.workspace,
              r_id: resource.id,
              resource_type: resource.resourceType,
              r_version_id: parseInt(resource.meta.versionId),
              parameter_name: parameter.name,
              parameter_url: parameter.url,
              system: value.system,
              value: value.code,
            };
            await db.sql<
              s.token_idx.SQL,
              void
            >`INSERT INTO ${"token_idx"} (${db.cols(
              TOKEN_INDEX
            )}) VALUES (${db.vals(TOKEN_INDEX)})`.run(client);
          })
      );
      return;
    }
    case "number": {
      await Promise.all(
        evaluation.map(async (v) => {
          const value = v.valueOf();
          if (typeof value !== "number")
            throw new OperationError(
              outcomeError(
                "invalid",
                "Failed to index number. Value found is not a number."
              )
            );
          const NUMBER_INDEX: s.number_idx.Insertable = {
            workspace: ctx.workspace,
            r_id: resource.id,
            resource_type: resource.resourceType,
            r_version_id: parseInt(resource.meta.versionId),
            parameter_name: parameter.name,
            parameter_url: parameter.url,
            value,
          };
          await db.sql<
            s.number_idx.SQL,
            void
          >`INSERT INTO ${"number_idx"} (${db.cols(
            NUMBER_INDEX
          )}) VALUES (${db.vals(NUMBER_INDEX)})`.run(client);
        })
      );
      return;
    }

    case "string": {
      await Promise.all(
        evaluation
          .map(toStringParameters)
          .flat()
          .map(async (value) => {
            const STRING_INDEX: s.string_idx.Insertable = {
              workspace: ctx.workspace,
              r_id: resource.id,
              resource_type: resource.resourceType,
              r_version_id: parseInt(resource.meta.versionId),
              parameter_name: parameter.name,
              parameter_url: parameter.url,
              value,
            };

            await db.sql<
              s.string_idx.SQL,
              void
            >`INSERT INTO ${"string_idx"} (${db.cols(
              STRING_INDEX
            )}) VALUES (${db.vals(STRING_INDEX)}) ON CONFLICT DO NOTHING`.run(
              client
            );
          })
      );
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
            getSD: (type: string) =>
              ctx.resolveCanonical("StructureDefinition", typeToUrl(type)),
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

async function saveResource<CTX extends FHIRServerCTX>(
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
      const queryText =
        "INSERT INTO resources(workspace, request_method, author, resource) VALUES($1, $2, $3, $4) RETURNING resource";
      const res = await client.query(queryText, [
        ctx.workspace,
        "POST",
        ctx.author,
        resource,
      ]);
      await indexResource(client, ctx, res.rows[0].resource as Resource);
      return res.rows[0].resource as Resource;
    }
  );
}

async function getResource<CTX extends FHIRServerCTX>(
  client: pg.PoolClient,
  ctx: CTX,
  resourceType: ResourceType,
  id: string
): Promise<Resource> {
  const queryText = `SELECT * FROM 
    (SELECT resource, deleted FROM resources WHERE workspace = $1 AND resource_type = $2 AND id = $3 ORDER BY version_id DESC LIMIT 1)
     as t WHERE t.deleted = false;`;
  const res = await client.query(queryText, [ctx.workspace, resourceType, id]);
  if (res.rows.length === 0) {
    throw new OperationError(
      outcomeError(
        "not-found",
        `'${resourceType}' with id '${id}' was not found`
      )
    );
  }
  return res.rows[0].resource as Resource;
}

function processHistoryParameters(
  query: string,
  sqlParameters: unknown[],
  parameters: ParsedParameter<string | number>[]
): { query: string; parameters: unknown[] } {
  let index = sqlParameters.length + 1;
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
    query = `${query} AND created_at >= $${index++} `;

    sqlParameters = [
      ...sqlParameters,
      dayjs(_since.value[0] as string, "YYYY-MM-DDThh:mm:ss+zz:zz").toDate(),
    ];
  }

  if (_since_versionId?.value[0]) {
    query = `${query} AND version_id > $${index++} `;
    sqlParameters = [...sqlParameters, _since_versionId.value[0] as string];
  }

  return {
    query,
    parameters: sqlParameters,
  };
}

async function getInstanceHistory<CTX extends FHIRServerCTX>(
  client: pg.PoolClient,
  ctx: CTX,
  resourceType: ResourceType,
  id: string,
  parameters: ParsedParameter<string | number>[]
): Promise<BundleEntry[]> {
  const _count = parameters.find((p) => p.name === "_count");
  const limit = deriveLimit([0, 50], _count);

  let { query, parameters: sqlParameters } = processHistoryParameters(
    "SELECT resource, request_method FROM resources WHERE workspace = $1 AND resource_type = $2 AND id = $3",
    [ctx.workspace, resourceType, id],
    parameters
  );

  query = `${query} ORDER BY version_id DESC LIMIT $${
    sqlParameters.length + 1
  }`;
  sqlParameters = [...sqlParameters, limit];

  const res = await client.query(query, sqlParameters);

  const resourceHistory = res.rows.map((row) => ({
    resource: row.resource as Resource,
    request: {
      url: `${row.resource.resourceType}/${row.resource.id}` as uri,
      method: row.request_method,
    },
  }));
  return resourceHistory;
}

const validHistoryParameters = ["_count", "_since", "_since-version"]; // "_at", "_list"]

async function getTypeHistory<CTX extends FHIRServerCTX>(
  client: pg.PoolClient,
  ctx: CTX,
  resourceType: ResourceType,
  parameters: ParsedParameter<string | number>[]
): Promise<BundleEntry[]> {
  const _count = parameters.find((p) => p.name === "_count");
  const limit = deriveLimit([0, 50], _count);

  let { query, parameters: sqlParameters } = processHistoryParameters(
    "SELECT resource, request_method FROM resources WHERE workspace = $1 AND resource_type = $2",
    [ctx.workspace, resourceType],
    parameters
  );

  query = `${query} ORDER BY version_id DESC LIMIT $${
    sqlParameters.length + 1
  }`;
  sqlParameters = [...sqlParameters, limit];

  const res = await client.query(query, sqlParameters);

  const resourceHistory = res.rows.map((row) => ({
    resource: row.resource as Resource,
    request: {
      url: `${row.resource.resourceType}/${row.resource.id}` as uri,
      method: row.request_method,
    },
  }));
  return resourceHistory;
}

async function getSystemHistory<CTX extends FHIRServerCTX>(
  client: pg.PoolClient,
  ctx: CTX,
  parameters: ParsedParameter<string | number>[]
): Promise<BundleEntry[]> {
  const _count = parameters.find((p) => p.name === "_count");
  const limit = deriveLimit([0, 50], _count);

  let { query, parameters: sqlParameters } = processHistoryParameters(
    "SELECT resource, request_method FROM resources WHERE workspace = $1",
    [ctx.workspace],
    parameters
  );

  query = `${query} ORDER BY version_id DESC LIMIT $${
    sqlParameters.length + 1
  }`;
  sqlParameters = [...sqlParameters, limit];

  const res = await client.query(query, sqlParameters);

  const resourceHistory = res.rows.map((row) => ({
    resource: row.resource as Resource,
    request: {
      url: `${row.resource.resourceType}/${row.resource.id}` as uri,
      method: row.request_method,
    },
  }));
  return resourceHistory;
}

async function patchResource<CTX extends FHIRServerCTX>(
  client: pg.PoolClient,
  request_method: "PATCH" | "PUT",
  ctx: CTX,
  resourceType: ResourceType,
  id: string,
  patches: Operation[]
): Promise<Resource> {
  return transaction(ISOLATION_LEVEL.Serializable, ctx, client, async (ctx) => {
    const resource = await getResource(client, ctx, resourceType, id);
    // [TODO] CHECK VALIDATION
    try {
      const newResource = jsonpatch.applyPatch(resource, patches)
        .newDocument as Resource;

      const outcome = await validateResource(ctx, resourceType, {
        resource: newResource,
      });
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
      const queryText =
        "INSERT INTO resources(workspace, request_method, author, resource, prev_version_id, patches) VALUES($1, $2, $3, $4, $5, $6) RETURNING resource";
      const res = await client.query(queryText, [
        ctx.workspace,
        request_method,
        ctx.author,
        newResource,
        resource.meta?.versionId,
        JSON.stringify(patches),
      ]);
      await indexResource(client, ctx, res.rows[0].resource as Resource);
      return res.rows[0].resource as Resource;
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
      const queryText =
        "INSERT INTO resources(workspace, request_method, author, resource, prev_version_id, deleted) VALUES($1, $2, $3, $4, $5, $6) RETURNING resource";

      const res = await client.query(queryText, [
        ctx.workspace,
        "DELETE",
        ctx.author,
        resource,
        resource.meta?.versionId,
        true,
      ]);
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
            context.request,
            context.ctx
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
                  total: result.total as unsignedInt,
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
                  total: result.total as unsignedInt,
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
          const savedResource = await saveResource(
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
            "PATCH",
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
          const savedResource = await patchResource(
            context.state.client,
            "PUT",
            context.ctx,
            context.request.resourceType,
            context.request.id,
            [{ op: "replace", path: "", value: context.request.body }]
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
          switch (context.request.level) {
            case "instance": {
              const instanceHistory = await getInstanceHistory(
                context.state.client,
                context.ctx,
                context.request.resourceType,
                context.request.id,
                context.request.parameters || []
              );
              return {
                request: context.request,
                state: context.state,
                ctx: context.ctx,
                response: {
                  type: "history-response",
                  level: "instance",
                  resourceType: context.request.resourceType,
                  id: context.request.id,
                  body: instanceHistory,
                },
              };
            }
            case "type": {
              const typeHistory = await getTypeHistory(
                context.state.client,
                context.ctx,
                context.request.resourceType,
                context.request.parameters || []
              );
              return {
                request: context.request,
                state: context.state,
                ctx: context.ctx,
                response: {
                  type: "history-response",
                  level: "type",
                  body: typeHistory,
                  resourceType: context.request.resourceType,
                },
              };
            }
            case "system": {
              const systemHistory = await getSystemHistory(
                context.state.client,
                context.ctx,
                context.request.parameters || []
              );
              return {
                request: context.request,
                state: context.state,
                ctx: context.ctx,
                response: {
                  type: "history-response",
                  level: "system",
                  body: systemHistory,
                },
              };
            }
            default: {
              throw new Error("Invalid history level");
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
