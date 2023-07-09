import pg from "pg";
import { v4 } from "uuid";
import jsonpatch, { Operation } from "fast-json-patch";
import dayjs from "dayjs";

import { FHIRURL, ParsedParameter } from "@genfhi/fhir-query";
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
} from "@genfhi/fhir-types/r4/types";
import { resourceTypes } from "@genfhi/fhir-types/r4/sets";
import { evaluateWithMeta } from "@genfhi/fhirpath";

import { FHIRServerCTX } from "../../fhirServer.js";
import { FHIRClientAsync } from "../../client/interface";
import { AsynchronousClient } from "../../client/index.js";
import {
  createMiddlewareAsync,
  MiddlewareAsync,
} from "../../client/middleware/index.js";
import { descend, MetaValueArray, MetaValueSingular } from "@genfhi/meta-value";
import { SystemSearchRequest, TypeSearchRequest } from "../../client/types";

function searchResources(
  resourceType?: ResourceType
): (ResourceType | string)[] {
  const searchTypes = ["Resource", "DomainResource"];
  if (resourceType) {
    searchTypes.push(resourceType);
  }
  return searchTypes;
}

// Composite,  Special
const param_types_supported = [
  "quantity",
  "date",
  "string",
  "number",
  "token",
  "uri",
  "reference",
];

async function getAllParametersForResource<CTX extends FHIRServerCTX>(
  ctx: CTX,
  resourceType?: ResourceType,
  names?: string[]
): Promise<SearchParameter[]> {
  let parameters: FHIRURL = {
    resourceType: "SearchParameter",
    parameters: {
      type: {
        name: "type",
        value: param_types_supported,
      },
      base: {
        name: "base",
        value: searchResources(resourceType),
      },
    },
  };
  if (names) {
    parameters = {
      ...parameters,
      parameters: {
        ...parameters.parameters,
        name: { name: "name", value: names },
      },
    };
  }

  return await ctx.database.search_type(ctx, "SearchParameter", parameters);
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
        return codings.toArray().map(toTokenParameters).flat();
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
        `Unknown token parameter of type '${value.meta()?.type}'`
      );
  }
}

function toURIParameters(
  value: MetaValueSingular<NonNullable<unknown>>
): string[] {
  switch (value.meta()?.type) {
    case "uri":
    case "canonical": {
      const v: canonical | uri = value.valueOf() as canonical | uri;
      return [v];
    }
    default:
      throw new Error(`Unknown uri parameter of type '${value.meta()?.type}'`);
  }
}

function toReference(
  value: MetaValueSingular<NonNullable<unknown>>
): Array<{ reference: Reference; resourceType?: ResourceType; id?: id }> {
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
        return [{ reference: reference }];
      }
    }
    default:
      throw new Error(
        `Unknown reference parameter of type '${value.meta()?.type}'`
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
  throw new Error(`Invalid date or dateTime format '${v}'`);
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
        const decimalPrecision =
          quantity.value?.toString().split(".")[1]?.length || 0;
        return [
          {
            start: {
              ...quantity,
              value: quantity.value - 0.5 * 10 ** -decimalPrecision,
            },
            end: {
              ...quantity,
              value: quantity.value + 0.5 * 10 ** -decimalPrecision,
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
  client: pg.Client,
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
              "INSERT INTO quantity_idx(workspace, r_id, r_version_id, parameter_name, parameter_url, start_quantity, end_quantity) VALUES($1, $2, $3, $4, $5, $6, $7)",
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
      await Promise.all(
        evaluation
          .map(toReference)
          .flat()
          .map(async ({ reference, resourceType, id }) => {
            await client.query(
              "INSERT INTO reference_idx(workspace, r_id, r_version_id, parameter_name, parameter_url, reference, resource_type, resource_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8)",
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
          .map(toURIParameters)
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
          .map(toTokenParameters)
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
        evaluation.map(async (value) => {
          await client.query(
            "INSERT INTO number_idx(workspace, r_id, r_version_id, parameter_name, parameter_url, value) VALUES($1, $2, $3, $4, $5, $6)",
            [
              ctx.workspace,
              resource.id,
              resource.meta?.versionId,
              parameter.name,
              parameter.url,
              value.valueOf(),
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
      throw new Error(`Not implemented '${parameter.type}'`);
  }
}

async function removeIndices(
  client: pg.Client,
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
  client: pg.Client,
  ctx: CTX,
  resource: Resource
) {
  await removeIndices(client, ctx, resource);
  const searchParameters = await getAllParametersForResource(
    ctx,
    resource.resourceType
  );
  for (const searchParameter of searchParameters) {
    if (searchParameter.expression === undefined) continue;
    const evaluation = evaluateWithMeta(searchParameter.expression, resource, {
      meta: { getSD: (type: string) => ctx.resolveSD(ctx, type) },
    });
    indexSearchParameter(client, ctx, searchParameter, resource, evaluation);
  }
}

async function saveResource<CTX extends FHIRServerCTX>(
  client: pg.Client,
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
  } finally {
    // Finally
    // client.release() when switching to pool
  }
}

async function getResource<CTX extends FHIRServerCTX>(
  client: pg.Client,
  ctx: CTX,
  resourceType: ResourceType,
  id: string
): Promise<Resource> {
  const queryText =
    "SELECT resource FROM resources WHERE workspace = $1 AND resource_type = $2 AND id = $3 ORDER BY version_id DESC LIMIT 1";
  const res = await client.query(queryText, [ctx.workspace, resourceType, id]);
  if (res.rows.length === 0) {
    throw new Error(`Resource not found`);
  }
  return res.rows[0].resource as Resource;
}

async function patchResource<CTX extends FHIRServerCTX>(
  client: pg.Client,
  ctx: CTX,
  resourceType: ResourceType,
  id: string,
  patches: Operation[]
): Promise<Resource> {
  try {
    await client.query("BEGIN");
    const resource = await getResource(client, ctx, resourceType, id);
    // [TODO] CHECK VALIDATION
    const newResource = jsonpatch.applyPatch(resource, patches)
      .newDocument as Resource;
    if (
      newResource.resourceType !== resource.resourceType ||
      newResource.id !== resource.id
    ) {
      throw new Error("Invalid Patch");
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
  } finally {
    // Finally
    // client.release() when switching to pool
  }
}

function buildParameters(
  search_parameters: SearchParameter[],
  parameters: ParsedParameter<string | number>[],
  index: number,
  values: any[]
): { index: number; query: string; values: any[] } {
  let query = [];
  let i = 0;
  for (let parameter of parameters) {
    const searchParameter = search_parameters.find(
      (p) => p.name === parameter.name
    );
    if (searchParameter === undefined)
      throw new Error(`Unknown parameter '${parameter.name}'`);
    const search_table = `${searchParameter.type}_idx`;
    const alias = `${searchParameter.type}${i++}`;
    const paramJoin = `JOIN ${search_table} ${alias} on ${alias}.r_version_id=resources.version_id AND ${alias}.parameter_url= $${index++}`;
    values = [...values, searchParameter.url];
    let parameterClause;
    switch (searchParameter.type) {
      case "token": {
        parameterClause = parameter.value
          .map((value) => {
            const parts = value.toString().split("|");
            if (parts.length === 1) {
              values = [...values, value];
              return `${alias}.value = $${index++}`;
            }
            if (parts.length === 2) {
              if (parts[0] !== "" && parts[1] !== "") {
                values = [...values, parts[0], parts[1]];
                return `${alias}.system = $${index++} AND ${alias}.value = $${index++}`;
              } else if (parts[0] !== "" && parts[1] === "") {
                values = [...values, parts[0]];
                return `${alias}.system = $${index++}`;
              } else if (parts[0] === "" && parts[1] !== "") {
                values = [...values, parts[1]];
                return `${alias}.value = $${index++}`;
              }
            }
            throw new Error(`Invalid token value found '${value}'`);
          })
          .join(" OR ");
        break;
      }
      case "quantity": {
        parameterClause = parameter.value.map((value) => {
          const parts = value.toString().split("|");
          if (parts.length === 4) {
            throw new Error(
              `prefix not supported yet for parameter '${searchParameter.name}' and value '${value}'`
            );
          }
          if (parts.length === 3) {
            const [value, system, code] = parts;
            let clauses: string[] = [];
            if (value !== "") {
              values = [...values, value, value];
              clauses = [
                ...clauses,
                `${alias}.start_value <= $${index++}`,
                `${alias}.end_value >= $${index++}`,
              ];
            }
            if (system !== "") {
              values = [...values, system, system];
              clauses = [
                ...clauses,
                `${alias}.start_system = $${index++}`,
                `${alias}.end_system = $${index++}`,
              ];
            }
            if (code != "") {
              values = [...values, code, code];
              clauses = [
                ...clauses,
                `${alias}.start_code = $${index++}`,
                `${alias}.end_code = $${index++}`,
              ];
            }
            return clauses.join(" AND ");
          } else {
            throw new Error("Must specify number|system|code for quantity");
          }
        });
        break;
      }
      case "date": {
        parameterClause = parameter.value.map((value) => {
          const formattedDate = dayjs(
            value,
            "YYYY-MM-DDThh:mm:ss+zz:zz"
          ).toISOString();
          values = [...values, formattedDate, formattedDate];
          // Check the range for date
          return `${alias}.start_date <= $${index++} AND ${alias}.end_date >= $${index++}`;
        });
        break;
      }
      case "uri":
      case "number":
      case "string": {
        parameterClause = parameter.value
          .map((value) => `${alias}.value = $${index++}`)
          .join(" OR ");
        values = [...values, ...parameter.value];
        break;
      }
      case "reference": {
        parameterClause = parameter.value
          .map((value) => {
            const parts = value.toString().split("/");
            if (parts.length === 1) {
              values = [...values, parts[0]];
              return `${alias}.resource_id = $${index++}`;
            } else if (parts.length === 2) {
              values = [...values, parts[0], parts[1]];
              return `${alias}.resource_type = $${index++} AND ${alias}.resource_id = $${index++}`;
            } else {
              throw new Error(
                `Invalid reference value '${value}' for search parameter '${searchParameter.name}'`
              );
            }
          })
          .join(" OR ");
        break;
      }
      default:
        throw new Error(
          `Unsupported search parameter querying '${searchParameter.type}'`
        );
    }
    query.push(
      `${paramJoin} ${
        parameter.value.length > 0 ? "AND" : ""
      } ${parameterClause}`
    );
  }
  return { index, query: query.join("\n"), values };
}

async function executeSearchQuery(
  client: pg.Client,
  request: SystemSearchRequest | TypeSearchRequest,
  ctx: FHIRServerCTX
): Promise<Resource[]> {
  let values: any[] = [];
  let index = 1;
  const searchParameters = await getAllParametersForResource(
    ctx,
    request.level === "type"
      ? (request.resourceType as ResourceType)
      : undefined,
    Object.keys(request.query.parameters)
  );

  const parameters = Object.values(request.query.parameters);
  let parameterQuery = buildParameters(
    searchParameters,
    parameters,
    index,
    values
  );

  values = parameterQuery.values;
  index = parameterQuery.index;

  let queryText = `
  SELECT * FROM (
     SELECT DISTINCT ON (resources.id) resources.resource, deleted
     FROM resources 
     ${parameterQuery.query}
     WHERE 
  `;

  // System vs type search filtering
  if (request.level === "type") {
    values.push(request.resourceType);
    queryText = `${queryText} resources.resource_type = $${index++}`;
  } else {
    queryText = `${queryText} resources.resource_type is not null`;
  }

  // Ensure that only one versionid of resource is returned. Given we're using
  // a giant table of resources with all versions.
  queryText = `${queryText} ORDER BY resources.id, resources.version_id DESC) as t WHERE t.deleted = false`;

  console.log(queryText, values);

  const res = await client.query(queryText, values);
  return res.rows.map((row) => row.resource) as Resource[];
}

function createPostgresMiddleware<
  State extends { client: pg.Client },
  CTX extends FHIRServerCTX
>(): MiddlewareAsync<State, CTX> {
  return createMiddlewareAsync<State, CTX>([
    async (request, args, next) => {
      const client = args.state.client;
      switch (request.type) {
        case "read-request": {
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
        }
        case "search-request": {
          const result = await executeSearchQuery(client, request, args.ctx);
          switch (request.level) {
            case "system": {
              return {
                state: args.state,
                ctx: args.ctx,
                response: {
                  type: "search-response",
                  query: request.query,
                  level: "system",
                  body: result,
                },
              };
            }
            case "type": {
              return {
                state: args.state,
                ctx: args.ctx,
                response: {
                  type: "search-response",
                  query: request.query,
                  level: "type",
                  resourceType: request.resourceType,
                  body: result,
                },
              };
            }
          }
        }
        case "create-request":
          const savedResource = await saveResource(client, args.ctx, {
            ...request.body,
            id: v4(),
          });
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
        case "patch-request":
          throw new Error("Not implemented");
        case "update-request": {
          const savedResource = await patchResource(
            client,
            args.ctx,
            request.resourceType as ResourceType,
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
        default:
          throw new Error(`Not implemented ${request.type}`);
      }
    },
  ]);
}

export function createPostgresClient<CTX extends FHIRServerCTX>(
  config: pg.ClientConfig
): FHIRClientAsync<CTX> {
  const client = new pg.Client(config);
  client.connect();
  return new AsynchronousClient<{ client: pg.Client }, CTX>(
    { client: client },
    createPostgresMiddleware()
  );
}
