import pg from "pg";
import { v4 } from "uuid";
import jsonpatch, { Operation } from "fast-json-patch";
import dayjs from "dayjs";

import { FHIRClientAsync } from "@iguhealth/client/interface";
import { AsynchronousClient } from "@iguhealth/client";
import {
  createMiddlewareAsync,
  MiddlewareAsync,
} from "@iguhealth/client/middleware";
import {
  Bundle,
  BundleEntry,
  Resource,
  ResourceType,
  SearchParameter,
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
import { KoaRequestToFHIRRequest } from "../../koaParsing/index.js";
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
  resource: Resource,
  evaluation: MetaValueSingular<NonNullable<unknown>>[]
) {
  switch (parameter.type) {
    case "quantity": {
      await Promise.all(
        evaluation
          .map(toQuantityRange)
          .flat()
          .map(async (value) => {
            await client.query(
              "INSERT INTO quantity_idx(workspace, r_id, resource_type, r_version_id, parameter_name, parameter_url, start_value, start_system, start_code, end_value, end_system, end_code) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)",
              [
                ctx.workspace,
                resource.id,
                resource.resourceType,
                resource.meta?.versionId,
                parameter.name,
                parameter.url,
                value.start?.value,
                value.start?.system,
                value.start?.code,
                value.end?.value,
                value.end?.system,
                value.end?.code,
              ]
            );
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
            await client.query(
              "INSERT INTO date_idx(workspace, r_id, resource_type, r_version_id, parameter_name, parameter_url, start_date, end_date) VALUES($1, $2, $3, $4, $5, $6, $7, $8)",
              [
                ctx.workspace,
                resource.id,
                resource.resourceType,
                resource.meta?.versionId,
                parameter.name,
                parameter.url,
                value.start,
                value.end,
              ]
            );
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
          return await client.query(
            "INSERT INTO reference_idx(workspace, r_id, resource_type, r_version_id, parameter_name, parameter_url, reference, reference_type, reference_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)",
            [
              ctx.workspace,
              resource.id,
              resource.resourceType,
              resource.meta?.versionId,
              parameter.name,
              parameter.url,
              reference,
              resourceType,
              id,
            ]
          );
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
            await client.query(
              "INSERT INTO uri_idx(workspace, r_id, resource_type, r_version_id, parameter_name, parameter_url, value) VALUES($1, $2, $3, $4, $5, $6, $7)",
              [
                ctx.workspace,
                resource.id,
                resource.resourceType,
                resource.meta?.versionId,
                parameter.name,
                parameter.url,
                value,
              ]
            );
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
            await client.query(
              "INSERT INTO token_idx(workspace, r_id, resource_type, r_version_id, parameter_name, parameter_url, system, value) VALUES($1, $2, $3, $4, $5, $6, $7, $8)",
              [
                ctx.workspace,
                resource.id,
                resource.resourceType,
                resource.meta?.versionId,
                parameter.name,
                parameter.url,
                value.system,
                value.code,
              ]
            );
          })
      );
      return;
    }
    case "number": {
      await Promise.all(
        evaluation.map(async (v) => {
          await client.query(
            "INSERT INTO number_idx(workspace, r_id, resource_type, r_version_id, parameter_name, parameter_url, value) VALUES($1, $2, $3, $4, $5, $6, $7)",
            [
              ctx.workspace,
              resource.id,
              resource.resourceType,
              resource.meta?.versionId,
              parameter.name,
              parameter.url,
              v.valueOf(),
            ]
          );
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
            await client.query(
              "INSERT INTO string_idx(workspace, r_id, resource_type, r_version_id, parameter_name, parameter_url, value) VALUES($1, $2, $3, $4, $5, $6, $7)",
              [
                ctx.workspace,
                resource.id,
                resource.resourceType,
                resource.meta?.versionId,
                parameter.name,
                parameter.url,
                value,
              ]
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
      return client.query(`DELETE FROM ${type}_idx WHERE r_id = $1`, [
        resource.id,
      ]);
    })
  );
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
      url: `${row.resource.resourceType}/${row.resource.id}`,
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
      url: `${row.resource.resourceType}/${row.resource.id}`,
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
      url: `${row.resource.resourceType}/${row.resource.id}`,
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
    async (request, args, next) => {
      switch (request.type) {
        case "read-request": {
          const resource = await getResource(
            args.state.client,
            args.ctx,
            request.resourceType,
            request.id
          );
          return {
            state: args.state,
            ctx: args.ctx,
            response: {
              level: "instance",
              type: "read-response",
              resourceType: request.resourceType,
              id: request.id,
              body: resource,
            },
          };
        }
        case "search-request": {
          const result = await executeSearchQuery(
            args.state.client,
            request,
            args.ctx
          );
          switch (request.level) {
            case "system": {
              return {
                state: args.state,
                ctx: args.ctx,
                response: {
                  type: "search-response",
                  parameters: request.parameters,
                  level: "system",
                  total: result.total,
                  body: result.resources,
                },
              };
            }
            case "type": {
              return {
                state: args.state,
                ctx: args.ctx,
                response: {
                  type: "search-response",
                  parameters: request.parameters,
                  level: "type",
                  resourceType: request.resourceType,
                  total: result.total,
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
            args.state.client,
            args.ctx,
            {
              ...request.body,
              id: v4(),
            }
          );

          return {
            state: args.state,
            ctx: args.ctx,
            response: {
              level: "type",
              resourceType: request.resourceType,
              type: "create-response",
              body: savedResource,
            },
          };
        }

        case "patch-request": {
          const savedResource = await patchResource(
            args.state.client,
            "PATCH",
            args.ctx,
            request.resourceType,
            request.id,
            request.body as Operation[]
          );

          return {
            state: args.state,
            ctx: args.ctx,
            response: {
              level: "instance",
              resourceType: request.resourceType,
              id: request.id,
              type: "patch-response",
              body: savedResource,
            },
          };
        }
        case "update-request": {
          const savedResource = await patchResource(
            args.state.client,
            "PUT",
            args.ctx,
            request.resourceType,
            request.id,
            [{ op: "replace", path: "", value: request.body }]
          );

          return {
            state: args.state,
            ctx: args.ctx,
            response: {
              level: "instance",
              resourceType: request.resourceType,
              id: request.id,
              type: "update-response",
              body: savedResource,
            },
          };
        }
        case "delete-request": {
          await deleteResource(
            args.state.client,
            args.ctx,
            request.resourceType,
            request.id
          );

          return {
            state: args.state,
            ctx: args.ctx,
            response: {
              type: "delete-response",
              level: "instance",
              resourceType: request.resourceType,
              id: request.id,
            },
          };
        }

        case "history-request": {
          switch (request.level) {
            case "instance": {
              const instanceHistory = await getInstanceHistory(
                args.state.client,
                args.ctx,
                request.resourceType,
                request.id,
                request.parameters || []
              );
              return {
                state: args.state,
                ctx: args.ctx,
                response: {
                  type: "history-response",
                  level: "instance",
                  resourceType: request.resourceType,
                  id: request.id,
                  body: instanceHistory,
                },
              };
            }
            case "type": {
              const typeHistory = await getTypeHistory(
                args.state.client,
                args.ctx,
                request.resourceType,
                request.parameters || []
              );
              return {
                state: args.state,
                ctx: args.ctx,
                response: {
                  type: "history-response",
                  level: "type",
                  body: typeHistory,
                  resourceType: request.resourceType,
                },
              };
            }
            case "system": {
              const systemHistory = await getSystemHistory(
                args.state.client,
                args.ctx,
                request.parameters || []
              );
              return {
                state: args.state,
                ctx: args.ctx,
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
          let transactionBundle = request.body;
          const { locationsToUpdate, order } = buildTransactionTopologicalGraph(
            args.ctx,
            transactionBundle
          );
          if (
            (transactionBundle.entry || []).length >
            args.state.transaction_entry_limit
          ) {
            throw new OperationError(
              outcomeError(
                "invalid",
                `Transaction bundle only allowed to have '${
                  args.state.transaction_entry_limit
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
            args.ctx,
            args.state.client,
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
                const fhirRequest = KoaRequestToFHIRRequest(
                  entry.request?.url || "",
                  {
                    method: entry.request?.method,
                    body: entry.resource,
                  }
                );
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
                type: "transaction-response",
                entry: responseEntries,
              };

              return {
                state: args.state,
                ctx: args.ctx,
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
              `Requests of type '${request.type}' are not yet supported`
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
