import pg from "pg";
import { v4 } from "uuid";
import jsonpatch, { Operation } from "fast-json-patch";
import dayjs from "dayjs";

import { FHIRClientAsync } from "@iguhealth/client/lib/interface";
import { AsynchronousClient } from "@iguhealth/client/lib/index.js";
import {
  createMiddlewareAsync,
  MiddlewareAsync,
} from "@iguhealth/client/lib/middleware/index.js";
import {
  Address,
  canonical,
  CodeableConcept,
  Coding,
  ContactPoint,
  date,
  dateTime,
  HumanName,
  id,
  Identifier,
  instant,
  Period,
  Quantity,
  Range,
  Reference,
  Resource,
  ResourceType,
  SearchParameter,
  uri,
} from "@iguhealth/fhir-types/r4/types";
import { resourceTypes } from "@iguhealth/fhir-types/r4/sets";
import { evaluateWithMeta } from "@iguhealth/fhirpath";
import {
  descend,
  MetaValueArray,
  MetaValueSingular,
} from "@iguhealth/meta-value";
import {
  OperationError,
  outcome,
  outcomeError,
} from "@iguhealth/operation-outcomes";

import { param_types_supported } from "./constants.js";
import { searchResources, getDecimalPrecision } from "./utilities.js";
import { FHIRServerCTX } from "../../fhirServer.js";
import { executeSearchQuery } from "./search/index.js";

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

// ---------------------------------------------------------
// [DATA TYPE CONVERSIONS]
// ---------------------------------------------------------
// https://hl7.org/fhir/r4/search.html#table
// ---------------------------------------------------------

function toStringParameters(
  value: MetaValueSingular<NonNullable<unknown>>
): string[] {
  switch (value.meta()?.type) {
    // Even though spec states won't encounter this it does. [ImplementationGuide.description]
    case "markdown":
    case "string": {
      return [value.valueOf() as string];
    }
    case "HumanName": {
      const humanName = value.valueOf() as HumanName;
      return [
        humanName.text ? [humanName.text] : [],
        humanName.family ? [humanName.family] : [],
        humanName.given ? humanName.given : [],
        humanName.prefix ? humanName.prefix : [],
        humanName.suffix ? humanName.suffix : [],
      ].flat();
    }
    case "Address": {
      const address = value.valueOf() as Address;
      return [
        address.text ? [address.text] : [],
        address.line ? address.line : [],
        address.city ? [address.city] : [],
        address.district ? [address.district] : [],
        address.state ? [address.state] : [],
        address.postalCode ? [address.postalCode] : [],
        address.country ? [address.country] : [],
      ].flat();
    }
    default:
      throw new Error(`Unknown string parameter '${value.meta()?.type}'`);
  }
}

// Coding	Coding.system	Coding.code
// CodeableConcept	CodeableConcept.coding.system	CodeableConcept.coding.code	Matches against any coding in the CodeableConcept
// Identifier	Identifier.system	Identifier.value	Clients can search by type not system using the :of-type modifier, see below. To search on a CDA II.root - which may appear in either Identifier.system or Identifier.value, use the syntax identifier=|[root],[root]
// ContactPoint		ContactPoint.value	At the discretion of the server, token searches on ContactPoint may use special handling, such as ignoring punctuation, performing partial searches etc.
// code	(implicit)	code	the system is defined in the value set (though it's not usually needed)
// boolean		boolean	The implicit system for boolean values is http://hl7.org/fhir/special-values but this is never actually used
// uri		uri
// string	n/a	string	Token is sometimes used for string to indicate that exact matching is the correct default search strategy

function toTokenParameters(
  parameter: SearchParameter,
  value: MetaValueSingular<NonNullable<unknown>>
): Array<{ system?: string; code?: string }> {
  switch (value.meta()?.type) {
    case "Coding": {
      const coding: Coding = value.valueOf() as CodeableConcept;
      return [{ system: coding.system, code: coding.code }];
    }
    case "CodeableConcept": {
      const codings = descend(value, "coding");
      if (codings instanceof MetaValueArray) {
        return codings
          .toArray()
          .map((v) => toTokenParameters(parameter, v))
          .flat();
      }
      return [];
    }
    case "Identifier": {
      const identifier: Identifier = value.valueOf() as Identifier;
      return [{ system: identifier.system, code: identifier.value }];
    }
    case "ContactPoint": {
      const contactPoint: ContactPoint = value.valueOf() as ContactPoint;
      return [{ code: contactPoint.value }];
    }
    case "code": {
      return [{ code: value.valueOf() as string }];
    }
    case "boolean": {
      return [
        {
          system: "http://hl7.org/fhir/special-values",
          code: (value.valueOf() as boolean).toString(),
        },
      ];
    }

    case "id":
    case "http://hl7.org/fhirpath/System.String":
    case "string": {
      return [
        {
          code: (value.valueOf() as string).toString(),
        },
      ];
    }
    default:
      throw new Error(
        `Unknown token parameter of type '${
          value.meta()?.type
        }' '${value.valueOf()}' indexing '${parameter.url}'`
      );
  }
}

function toURIParameters(
  param: SearchParameter,
  value: MetaValueSingular<NonNullable<unknown>>
): string[] {
  switch (value.meta()?.type) {
    case "uri":
    case "url":
    case "uuid":
    case "canonical": {
      const v: canonical | uri = value.valueOf() as canonical | uri;
      return [v];
    }
    default:
      throw new Error(
        `Unknown uri parameter of type '${
          value.meta()?.type
        }' '${value.valueOf()}' indexing '${param.url}'`
      );
  }
}

async function toReference(
  ctx: FHIRServerCTX,
  parameter: SearchParameter,
  value: MetaValueSingular<NonNullable<unknown>>
): Promise<
  Array<{ reference: Reference; resourceType?: ResourceType; id?: id }>
> {
  switch (value.meta()?.type) {
    case "Reference": {
      const reference: Reference = value.valueOf() as Reference;
      const [resourceType, id] = reference.reference?.split("/") || [];
      if (resourceTypes.has(resourceType) && id) {
        return [
          {
            reference: reference,
            resourceType: resourceType as ResourceType,
            id: id,
          },
        ];
      } else {
        // Need to determine how to handle identifier style references.
        return [];
        //return [{ reference: reference }];
      }
    }
    case "uri":
    case "canonical": {
      const results = await ctx.client.search_system(ctx, [
        { name: "_type", value: parameter.target || [] },
        { name: "url", value: [value.valueOf() as canonical | uri] },
      ]);
      if (results.resources.length !== 1) {
        ctx.logger.warn(
          `Expected one resource for canonical or uri reference parameter '${parameter.url}' but found '${results.resources.length}' so could not resolve.`
        );
        return [];
      }
      return [
        {
          reference: {
            reference: `${results.resources[0].resourceType}/${results.resources[0].id}`,
          },
          resourceType: results.resources[0].resourceType,
          id: results.resources[0].id,
        },
      ];
    }

    default:
      throw new Error(
        `Unknown reference parameter of type '${
          value.meta()?.type
        }' indexing '${parameter.url}'`
      );
  }
}

const dateRegex =
  /^(?<year>[0-9]([0-9]([0-9][1-9]|[1-9]0)|[1-9]00)|[1-9]000)(-(?<month>0[1-9]|1[0-2])(-(?<day>0[1-9]|[1-2][0-9]|3[0-1]))?)?$/;

const dateTimeRegex =
  /^(?<year>[0-9]([0-9]([0-9][1-9]|[1-9]0)|[1-9]00)|[1-9]000)(-(?<month>0[1-9]|1[0-2])(-(?<day>0[1-9]|[1-2][0-9]|3[0-1])(T(?<hour>[01][0-9]|2[0-3]):(?<minute>[0-5][0-9]):(?<second>[0-5][0-9]|60)(?<ms>\.[0-9]{1,9})?)?)?(?<timezone>Z|(\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00)?)?)?$/;

const precisionLevels = [
  "ms",
  "second",
  "minute",
  "hour",
  "day",
  "month",
  "year",
];

function getPrecision(v: date | dateTime) {
  const match = v.match(dateTimeRegex);
  if (match) {
    for (const precision of precisionLevels) {
      if (match.groups?.[precision]) {
        return precision;
      }
    }
    throw new Error(`could not determine precision level of '${v}'`);
  }
  throw new OperationError(
    outcomeError("invalid", `Invalid date or dateTime format '${v}'`)
  );
}

function toDateRange(
  value: MetaValueSingular<NonNullable<unknown>>
): { start: string; end: string }[] {
  switch (value.meta()?.type) {
    case "Period": {
      const period: Period = value.valueOf() as Period;
      return [
        {
          start: period.start || "-infinity",
          end: period.end || "infinity",
        },
      ];
    }
    case "Timing": {
      const events = descend(value, "event");
      if (events instanceof MetaValueArray) {
        return events.toArray().map(toDateRange).flat();
      }
      return [];
    }
    case "instant": {
      const instant: instant = value.valueOf() as instant;
      return [
        {
          start: instant,
          end: instant,
        },
      ];
    }
    // TODO: Handle date and dateTime
    case "date": {
      const v: date = value.valueOf() as date;
      const precision = getPrecision(v);
      switch (precision) {
        case "day":
        case "month":
        case "year": {
          return [
            {
              start: dayjs(v, "YYYY-MM-DD").startOf(precision).toISOString(),
              end: dayjs(v, "YYYY-MM-DD").endOf(precision).toISOString(),
            },
          ];
        }
        default:
          throw new Error(`Unknown precision '${precision}'for date '${v}'`);
      }
    }
    case "dateTime": {
      const v: dateTime = value.valueOf() as dateTime;
      const precision = getPrecision(v);
      switch (precision) {
        case "ms": {
          return [{ start: v, end: v }];
        }
        case "second":
        case "minute":
        case "hour":
        case "day":
        case "month":
        case "year": {
          {
            return [
              {
                start: dayjs(v, "YYYY-MM-DDThh:mm:ss+zz:zz")
                  .startOf(precision)
                  .toISOString(),
                end: dayjs(v, "YYYY-MM-DDThh:mm:ss+zz:zz")
                  .endOf(precision)
                  .toISOString(),
              },
            ];
          }
        }
      }
    }
    default:
      throw new Error(`Cannot index as date value '${value.meta()?.type}'`);
  }
}

type QuantityIndex = Omit<Quantity, "value"> & { value?: number | string };

// Number and quantity dependent on the precision for indexing.
function getRange(value: number): { start: number; end: number } {
  const decimalPrecision = getDecimalPrecision(value);
  return {
    start: value - 0.5 * 10 ** -decimalPrecision,
    end: value + 0.5 * 10 ** -decimalPrecision,
  };
}

function toQuantityRange(
  value: MetaValueSingular<NonNullable<unknown>>
): { start?: QuantityIndex; end?: QuantityIndex }[] {
  switch (value.meta()?.type) {
    case "Range": {
      const range: Range = value.valueOf() as Range;
      // Need to have some bound here otherwise would be returning infinite in both dirs.
      if (range.low?.value || range.high?.value) {
        return [
          {
            start: range.low || { ...range.high, value: "-infinity" },
            end: range.high || { ...range.low, value: "infinity" },
          },
        ];
      }
      return [];
    }
    case "Age":
    case "Money":
    case "Duration":
    case "Quantity": {
      const quantity: Quantity = value.valueOf() as Quantity;
      // using decimalprecision subtract .5 of  decimal precision to get lower bound
      // and add .5 of decimal precision to get upper bound
      if (quantity.value) {
        const range = getRange(quantity.value);
        return [
          {
            start: {
              ...quantity,
              value: range.start,
            },
            end: {
              ...quantity,
              value: range.end,
            },
          },
        ];
      }
      return [];
    }
    default:
      throw new Error(
        `Unable to index as quantity value '${value.meta()?.type}'`
      );
  }
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
              "INSERT INTO quantity_idx(workspace, r_id, r_version_id, parameter_name, parameter_url, start_value, start_system, start_code, end_value, end_system, end_code) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)",
              [
                ctx.workspace,
                resource.id,
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
              "INSERT INTO date_idx(workspace, r_id, r_version_id, parameter_name, parameter_url, start_date, end_date) VALUES($1, $2, $3, $4, $5, $6, $7)",
              [
                ctx.workspace,
                resource.id,
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
            "INSERT INTO reference_idx(workspace, r_id, r_version_id, parameter_name, parameter_url, reference, reference_type, reference_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8)",
            [
              ctx.workspace,
              resource.id,
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
              "INSERT INTO uri_idx(workspace, r_id, r_version_id, parameter_name, parameter_url, value) VALUES($1, $2, $3, $4, $5, $6)",
              [
                ctx.workspace,
                resource.id,
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
              "INSERT INTO token_idx(workspace, r_id, r_version_id, parameter_name, parameter_url, system, value) VALUES($1, $2, $3, $4, $5, $6, $7)",
              [
                ctx.workspace,
                resource.id,
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
            "INSERT INTO number_idx(workspace, r_id, r_version_id, parameter_name, parameter_url, value) VALUES($1, $2, $3, $4, $5, $6)",
            [
              ctx.workspace,
              resource.id,
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
              "INSERT INTO string_idx(workspace, r_id, r_version_id, parameter_name, parameter_url, value) VALUES($1, $2, $3, $4, $5, $6)",
              [
                ctx.workspace,
                resource.id,
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
  for (const searchParameter of searchParameters) {
    if (searchParameter.expression === undefined) continue;
    const evaluation = evaluateWithMeta(searchParameter.expression, resource, {
      meta: { getSD: (type: string) => ctx.resolveSD(ctx, type) },
    });
    indexSearchParameter(client, ctx, searchParameter, resource, evaluation);
  }
}

async function saveResource<CTX extends FHIRServerCTX>(
  client: pg.PoolClient,
  ctx: CTX,
  resource: Resource
): Promise<Resource> {
  try {
    await client.query("BEGIN");
    const queryText =
      "INSERT INTO resources(workspace, author, resource) VALUES($1, $2, $3) RETURNING resource";
    const res = await client.query(queryText, [
      ctx.workspace,
      ctx.author,
      resource,
    ]);
    await indexResource(client, ctx, res.rows[0].resource as Resource);
    await client.query("COMMIT");
    return res.rows[0].resource as Resource;
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  }
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

async function patchResource<CTX extends FHIRServerCTX>(
  client: pg.PoolClient,
  ctx: CTX,
  resourceType: ResourceType,
  id: string,
  patches: Operation[]
): Promise<Resource> {
  try {
    await client.query("BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE");
    const resource = await getResource(client, ctx, resourceType, id);
    // [TODO] CHECK VALIDATION
    const newResource = jsonpatch.applyPatch(resource, patches)
      .newDocument as Resource;
    if (
      newResource.resourceType !== resource.resourceType ||
      newResource.id !== resource.id
    ) {
      throw new OperationError(
        outcomeError(
          "invalid",
          `Invalid patch, patches must maintain resourceType and id.`
        )
      );
    }
    const queryText =
      "INSERT INTO resources(workspace, author, resource, prev_version_id, patches) VALUES($1, $2, $3, $4, $5) RETURNING resource";
    const res = await client.query(queryText, [
      ctx.workspace,
      ctx.author,
      newResource,
      resource.meta?.versionId,
      JSON.stringify(patches),
    ]);
    await indexResource(client, ctx, res.rows[0].resource as Resource);
    await client.query("COMMIT");
    return res.rows[0].resource as Resource;
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  }
}

async function deleteResource<CTX extends FHIRServerCTX>(
  client: pg.PoolClient,
  ctx: CTX,
  resourceType: ResourceType,
  id: string
) {
  try {
    await client.query("BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE");
    const resource = await getResource(client, ctx, resourceType, id);
    if (!resource)
      throw new OperationError(
        outcomeError(
          "not-found",
          `'${resourceType}' with id '${id}' was not found`
        )
      );
    const queryText =
      "INSERT INTO resources(workspace, author, resource, prev_version_id, deleted) VALUES($1, $2, $3, $4, $5) RETURNING resource";

    const res = await client.query(queryText, [
      ctx.workspace,
      ctx.author,
      resource,
      resource.meta?.versionId,
      true,
    ]);
    await removeIndices(client, ctx, resource);
    await client.query("END");
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  }
}

async function retryFailedTransactions<ReturnType>(
  execute: () => Promise<ReturnType>
): Promise<ReturnType> {
  while (true) {
    try {
      const res = await execute();
      return res;
    } catch (e) {
      if (!(e instanceof pg.DatabaseError)) throw e;
      // Only going to retry on failed transactions
      if (e.code !== "40001") {
        throw e;
      }
    }
  }
}

function createPostgresMiddleware<
  State extends { pool: pg.Pool },
  CTX extends FHIRServerCTX
>(): MiddlewareAsync<State, CTX> {
  return createMiddlewareAsync<State, CTX>([
    async (request, args, next) => {
      switch (request.type) {
        case "read-request": {
          const client = await args.state.pool.connect();
          try {
            const resource = await getResource(
              client,
              args.ctx,
              request.resourceType as ResourceType,
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
          } finally {
            client.release();
          }
        }
        case "search-request": {
          const result = await executeSearchQuery(
            args.state.pool,
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
          }
        }
        case "create-request": {
          const client = await args.state.pool.connect();
          try {
            const savedResource = await retryFailedTransactions(
              async () =>
                await saveResource(client, args.ctx, {
                  ...request.body,
                  id: v4(),
                })
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
          } finally {
            client.release();
          }
        }
        case "patch-request":
          throw new OperationError(
            outcomeError("not-supported", `Patch is not yet supported.`)
          );
        case "update-request": {
          const client = await args.state.pool.connect();
          try {
            const savedResource = await retryFailedTransactions(
              async () =>
                await patchResource(
                  client,
                  args.ctx,
                  request.resourceType as ResourceType,
                  request.id,
                  [{ op: "replace", path: "", value: request.body }]
                )
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
          } finally {
            client.release();
          }
        }
        case "delete-request": {
          const client = await args.state.pool.connect();
          try {
            await retryFailedTransactions(async () => {
              await deleteResource(
                client,
                args.ctx,
                request.resourceType as ResourceType,
                request.id
              );
            });

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
          } finally {
            client.release();
          }
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
  config: pg.PoolConfig
): FHIRClientAsync<CTX> {
  const pool = new pg.Pool(config);
  pool.connect();
  return new AsynchronousClient<{ pool: pg.Pool }, CTX>(
    { pool },
    createPostgresMiddleware()
  );
}
