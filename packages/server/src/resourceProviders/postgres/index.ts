import pg from "pg";
import { v4 } from "uuid";
import jsonpatch, { Operation } from "fast-json-patch";
import dayjs from "dayjs";

import { ParsedParameter } from "@iguhealth/client/lib/url.js";
import { FHIRClientAsync } from "@iguhealth/client/lib/interface";
import { AsynchronousClient } from "@iguhealth/client/lib/index.js";
import {
  createMiddlewareAsync,
  MiddlewareAsync,
} from "@iguhealth/client/lib/middleware/index.js";
import {
  SystemSearchRequest,
  TypeSearchRequest,
} from "@iguhealth/client/lib/types";
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
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { FHIRServerCTX } from "../../fhirServer.js";

function searchResources(
  resourceTypes: ResourceType[]
): (ResourceType | string)[] {
  const searchTypes = ["Resource", "DomainResource"];
  if (resourceTypes.length > 0) {
    return searchTypes.concat(resourceTypes);
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

function toReference(
  parameter: SearchParameter,
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
        // Need to determine how to handle identifier style references.
        return [];
        //return [{ reference: reference }];
      }
    }
    case "uri":
    case "canonical": {
      console.warn("Not supporting canonical or uri reference parameters yet.");
      return [];
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
  const decimalPrecision = value.toString().split(".")[1]?.length || 0;
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
      await Promise.all(
        evaluation
          .map((v) => toReference(parameter, v))
          .flat()
          .map(async ({ reference, resourceType, id }) => {
            if (!reference.reference) {
              console.warn("Cannot index logical reference.");
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
        evaluation
          .map((v) => getRange(v.valueOf() as number))
          .map(async ({ start, end }) => {
            await client.query(
              "INSERT INTO number_idx(workspace, r_id, r_version_id, parameter_name, parameter_url, start_value, end_value) VALUES($1, $2, $3, $4, $5, $6, $7)",
              [
                ctx.workspace,
                resource.id,
                resource.meta?.versionId,
                parameter.name,
                parameter.url,
                start,
                end,
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
  client: pg.Client,
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
  } finally {
    // Finally
    // client.release() when switching to pool
  }
}

async function deleteResource<CTX extends FHIRServerCTX>(
  client: pg.Client,
  ctx: CTX,
  resourceType: ResourceType,
  id: string
) {
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
}

type SearchParameterResource = ParsedParameter<string | number> & {
  type: "resource";
  searchParameter: SearchParameter;
  chainedParameters?: SearchParameter[][];
};

type SearchParameterResult = ParsedParameter<string | number> & {
  type: "result";
};

type ParameterType = SearchParameterResource | SearchParameterResult;

function searchParameterToTableName(searchParameter: SearchParameter) {
  return `${searchParameter.type}_idx`;
}

function buildParameterSQL(
  ctx: FHIRServerCTX,
  parameter: SearchParameterResource,
  index: number,
  values: any[],
  columns: string[] = ["DISTINCT(r_version_id)"]
): { index: number; query: string; values: any[] } {
  const searchParameter = parameter.searchParameter;
  const search_table = searchParameterToTableName(searchParameter);

  const rootSelect = `SELECT ${columns.join(
    ", "
  )} FROM ${search_table} WHERE parameter_url = $${index++} `;
  values = [...values, searchParameter.url];
  let parameterClause;
  switch (searchParameter.type) {
    case "token": {
      parameterClause = parameter.value
        .map((value) => {
          const parts = value.toString().split("|");
          if (parts.length === 1) {
            values = [...values, value];
            return `value = $${index++}`;
          }
          if (parts.length === 2) {
            if (parts[0] !== "" && parts[1] !== "") {
              values = [...values, parts[0], parts[1]];
              return `system = $${index++} AND value = $${index++}`;
            } else if (parts[0] !== "" && parts[1] === "") {
              values = [...values, parts[0]];
              return `system = $${index++}`;
            } else if (parts[0] === "" && parts[1] !== "") {
              values = [...values, parts[1]];
              return `value = $${index++}`;
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
          throw new OperationError(
            outcomeError(
              "not-supported",
              `prefix not supported yet for parameter '${searchParameter.name}' and value '${value}'`
            )
          );
        }
        if (parts.length === 3) {
          const [value, system, code] = parts;
          let clauses: string[] = [];
          if (value !== "") {
            values = [...values, value, value];
            clauses = [
              ...clauses,
              `start_value <= $${index++}`,
              `end_value >= $${index++}`,
            ];
          }
          if (system !== "") {
            values = [...values, system, system];
            clauses = [
              ...clauses,
              `start_system = $${index++}`,
              `end_system = $${index++}`,
            ];
          }
          if (code != "") {
            values = [...values, code, code];
            clauses = [
              ...clauses,
              `start_code = $${index++}`,
              `end_code = $${index++}`,
            ];
          }
          return clauses.join(" AND ");
        } else {
          throw new OperationError(
            outcomeError(
              "invalid",
              "Quantity search parameters must be specified as value|system|code"
            )
          );
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
        return `start_date <= $${index++} AND end_date >= $${index++}`;
      });
      break;
    }
    case "uri":
    case "number":
      parameterClause = parameter.value
        .map((value) => {
          values = [...values, value, value];
          return `start_value <= $${index++} AND end_value >= $${index++}`;
        })
        .join(" OR ");

      break;
    case "string": {
      switch (parameter.modifier) {
        case "exact":
          parameterClause = parameter.value
            .map((value) => `value = $${index++}`)
            .join(" OR ");
          values = [...values, ...parameter.value];
          break;
        case "contains":
          parameterClause = parameter.value
            .map((value) => `value ilike $${index++}`)
            .join(" OR ");
          values = [...values, ...parameter.value.map((v) => `%${v}%`)];
          break;
        default:
          parameterClause = parameter.value
            .map((value) => `value ilike $${index++}`)
            .join(" OR ");
          values = [...values, ...parameter.value.map((v) => `${v}%`)];
          break;
      }
      break;
    }
    case "reference": {
      // SUPPORT FOR PARAMETER CHAINS
      // Example: Observation?patient.general-practitioner.name=Adam

      if (
        parameter.chainedParameters &&
        parameter.chainedParameters.length > 0
      ) {
        const referenceParameters = [
          [parameter.searchParameter],
          ...parameter.chainedParameters.slice(0, -1),
        ];

        const sqlCHAIN = referenceParameters.reduce(
          (
            {
              index,
              values,
              query,
            }: { index: number; values: any[]; query: string[] },
            parameters
          ) => {
            const res = parameters.reduce(
              (
                {
                  index,
                  values,
                  query,
                }: { index: number; values: any[]; query: string[] },
                p
              ) => {
                const res = buildParameterSQL(
                  ctx,
                  {
                    type: "resource",
                    name: p.name,
                    searchParameter: p,
                    value: [],
                  },
                  index,
                  values,
                  ["r_id", "reference_id"]
                );
                return {
                  index: res.index,
                  values: res.values,
                  query: [...query, res.query],
                };
              },
              { index, values, query: [] }
            );
            return {
              index: res.index,
              values: res.values,
              query: [...query, `(${res.query.join(" UNION ")})`],
            };
          },
          { index, values, query: [] }
        );

        index = sqlCHAIN.index;
        values = sqlCHAIN.values;

        const lastParameters =
          parameter.chainedParameters[parameter.chainedParameters.length - 1];

        const lastResult = lastParameters.reduce(
          (
            {
              index,
              values,
              query,
            }: { index: number; values: any[]; query: string[] },
            p
          ) => {
            const res = buildParameterSQL(
              ctx,
              { ...parameter, searchParameter: p, chainedParameters: [] },
              index,
              values,
              ["r_id"]
            );
            return {
              index: res.index,
              values: res.values,
              query: [...query, res.query],
            };
          },
          { index, values, query: [] }
        );

        index = lastResult.index;
        values = lastResult.values;

        const referencesSQL = [
          ...sqlCHAIN.query,
          `(${lastResult.query.join(" UNION ")})`,
        ]
          // Reverse as we want to start from initial value and then chain up to the last reference ID.
          .reverse()
          .reduce((previousResult: string, query: string, index: number) => {
            const queryAlias = `query${index}`;
            // Previous result should include the list of ids for next reference_id.
            // Starting at the value this would be r_id
            return `(select r_id from ${query} as ${queryAlias} where ${queryAlias}.reference_id in ${previousResult})`;
            //return `(select * from ${previousResult} as p where p.reference_id in (select r_id from ${query} as chain${index}))`;
          });

        return {
          query: `(${rootSelect} AND workspace=$${lastResult.index++} and r_id in (select r_id from ${referencesSQL} as referencechain))`,
          index: lastResult.index,
          values: [...lastResult.values, ctx.workspace],
        };
      }

      parameterClause = parameter.value
        .map((value) => {
          const parts = value.toString().split("/");
          if (parts.length === 1) {
            values = [...values, parts[0]];
            return `reference_id = $${index++}`;
          } else if (parts.length === 2) {
            values = [...values, parts[0], parts[1]];
            return `reference_type = $${index++} AND reference_id = $${index++}`;
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
      throw new OperationError(
        outcomeError(
          "not-supported",
          `Parameter of type '${searchParameter.type}' is not yet supported.`
        )
      );
  }

  let query = `(${rootSelect} AND workspace=$${index++} ${
    parameterClause ? `AND ${parameterClause}` : ""
  })`;

  values = [...values, ctx.workspace];
  return {
    index,
    values,
    query,
  };
}

function buildParametersSQL(
  ctx: FHIRServerCTX,
  parameters: SearchParameterResource[],
  index: number,
  values: any[]
): { index: number; queries: string[]; values: any[] } {
  let queries = [];
  let i = 0;
  for (let parameter of parameters) {
    const res = buildParameterSQL(ctx, parameter, index, values);
    index = res.index;
    queries.push(res.query);
    values = res.values;
  }
  return { index, queries, values };
}

async function associateChainedParameters<CTX extends FHIRServerCTX>(
  ctx: CTX,
  parsedParameter: SearchParameterResource
): Promise<SearchParameterResource> {
  if (!parsedParameter.chains) return parsedParameter;

  // All middle chains should be references.
  let last = [parsedParameter.searchParameter];
  let chainedParameters: SearchParameter[][] = [];
  for (const chain of parsedParameter.chains) {
    const targets = last
      .map((l) => {
        if (l.type !== "reference")
          throw new OperationError(
            outcomeError(
              "invalid",
              `SearchParameter with name '${l.name}' is not a reference.`
            )
          );
        return l.target || [];
      })
      .flat();
    const chainParameter = await ctx.client.search_type(
      ctx,
      "SearchParameter",
      [
        { name: "name", value: [chain] },
        {
          name: "type",
          value: param_types_supported,
        },
        {
          name: "base",
          value: searchResources(targets as ResourceType[]),
        },
      ]
    );
    if (chainParameter.resources.length === 0)
      throw new OperationError(
        outcomeError(
          "not-found",
          `SearchParameter with name '${chain}' not found in chain.`
        )
      );
    last = chainParameter.resources;
    chainedParameters.push(chainParameter.resources);
  }

  return {
    ...parsedParameter,
    chainedParameters,
  };
}

//

function isSearchResultParameter(parameter: ParsedParameter<string | number>) {
  // List pulled from https://hl7.org/fhir/r4/search.htm
  // These parameters do not have associated search parameter and instead require hard logic.
  switch (parameter.name) {
    case "_count":
    // _offset not in param results so adding here.
    case "_offset":
    case "_total":
    case "_sort":
      return true;
    case "_include":
    case "_revinclude":
    case "_summary":
    case "_elements":
    case "_contained":
    case "_containedType": {
      throw new OperationError(
        outcomeError(
          "not-supported",
          `Parameter of type '${parameter.name}' is not yet supported.`
        )
      );
    }
    default:
      return false;
  }
}

async function paramWithMeta<CTX extends FHIRServerCTX>(
  ctx: CTX,
  resourceTypes: ResourceType[],
  parameters: ParsedParameter<string | number>[]
): Promise<ParameterType[]> {
  const result = await Promise.all(
    parameters.map(async (p) => {
      if (isSearchResultParameter(p)) {
        const param: SearchParameterResult = { ...p, type: "result" };
        return param;
      }
      const searchParameters = await ctx.client.search_type(
        ctx,
        "SearchParameter",
        [
          { name: "name", value: [p.name] },
          {
            name: "type",
            value: param_types_supported,
          },
          {
            name: "base",
            value: searchResources(resourceTypes),
          },
        ]
      );

      if (searchParameters.resources.length === 0)
        throw new OperationError(
          outcomeError(
            "not-found",
            `SearchParameter with name '${p.name}' not found.`
          )
        );

      if (searchParameters.resources.length > 1)
        throw new OperationError(
          outcomeError(
            "invalid",
            `SearchParameter with name '${p.name}' found multiple parameters.`
          )
        );

      const searchParameter = searchParameters.resources[0];
      const param: SearchParameterResource = {
        ...p,
        type: "resource",
        searchParameter: searchParameter,
      };
      return associateChainedParameters(ctx, param);
    })
  );

  return result;
}

type SORT_DIRECTION = "ascending" | "descending";

function getParameterSortColumn(
  direction: SORT_DIRECTION,
  parameter: SearchParameter
): string {
  switch (parameter.type) {
    case "quantity":
      return direction === "ascending" ? "end_value" : "start_value";
    case "date":
      return direction === "ascending" ? "end_date" : "start_date";
    case "reference":
      return "reference_id";
    default:
      return "value";
  }
  return `${direction === "descending" ? "-" : ""}${parameter.name}`;
}

async function deriveSortQuery(
  ctx: FHIRServerCTX,
  resourceTypes: ResourceType[],
  sortParameter: SearchParameterResult,
  query: string,
  index: number,
  values: any[]
) {
  const sortInformation = await Promise.all(
    sortParameter.value.map(
      async (
        paramName
      ): Promise<{
        direction: SORT_DIRECTION;
        parameter: SearchParameter;
      }> => {
        let direction: SORT_DIRECTION = "ascending";
        if (paramName.toString().startsWith("-")) {
          paramName = paramName.toString().substring(1);
          direction = "descending";
        }
        const searchParameter = await ctx.client.search_type(
          ctx,
          "SearchParameter",
          [
            { name: "name", value: [paramName] },
            {
              name: "type",
              value: param_types_supported,
            },
            {
              name: "base",
              value: searchResources(resourceTypes),
            },
          ]
        );
        if (searchParameter.resources.length === 0)
          throw new OperationError(
            outcomeError(
              "not-found",
              `SearchParameter with name '${paramName}' not found.`
            )
          );
        return {
          direction,
          parameter: searchParameter.resources[0],
        };
      }
    )
  );

  const resourceQueryAlias = "resource_result";

  // Need to create LEFT JOINS on the queries so we can orderby postgres.
  const sortQueries = sortInformation.map(
    ({ direction, parameter }, sortOrder: number) => {
      const table = searchParameterToTableName(parameter);
      const sort_table_name = `sort_${sortOrder}`;
      const column_name = getParameterSortColumn(direction, parameter);
      const query = ` LEFT JOIN 
      (SELECT r_id, MIN(${column_name}) AS ${sort_table_name} FROM ${table} WHERE workspace = $${index++} AND parameter_url=$${index++} GROUP BY r_id)
      AS ${sort_table_name} 
      ON ${sort_table_name}.r_id = ${resourceQueryAlias}.id`;
      values = [...values, ctx.workspace, parameter.url];

      return query;
    }
  );

  const sortQuery = `
  SELECT * FROM (
    (${query}) as ${resourceQueryAlias} ${sortQueries.join("\n")}
  )
  ORDER BY ${sortInformation
    .map(
      ({ direction }, i) =>
        `sort_${i} ${direction === "ascending" ? "ASC" : "DESC"} `
    )
    .join(",")}`;

  return { query: sortQuery, index, values };
}

async function executeSearchQuery(
  client: pg.Client,
  request: SystemSearchRequest | TypeSearchRequest,
  ctx: FHIRServerCTX
): Promise<{ total?: number; resources: Resource[] }> {
  let values: any[] = [];
  let index = 1;
  const parameters = await paramWithMeta(
    ctx,
    request.level === "type" ? [request.resourceType as ResourceType] : [],
    request.parameters
  );
  // Standard parameters
  const resourceParameters = parameters.filter(
    (v): v is SearchParameterResource => v.type === "resource"
  );

  const parametersResult = parameters.filter(
    (v): v is SearchParameterResult => v.type === "result"
  );

  let parameterQuery = buildParametersSQL(
    ctx,
    resourceParameters,
    index,
    values
  );

  values = parameterQuery.values;
  index = parameterQuery.index;

  values = [...values, ctx.workspace];
  let queryText = `
  SELECT * FROM (
     SELECT DISTINCT ON (resources.id) resources.id, resources.resource, deleted
     
     FROM resources 
     ${parameterQuery.queries
       .map(
         (q, i) =>
           `JOIN ${q} as query${i} ON query${i}.r_version_id=resources.version_id`
       )
       .join("\n     ")}
     
     WHERE resources.workspace = $${index++}
     AND`;

  // System vs type search filtering
  if (request.level === "type") {
    values.push(request.resourceType);
    queryText = `${queryText} resources.resource_type = $${index++}`;
  } else {
    queryText = `${queryText} resources.resource_type is not null`;
  }

  // Neccessary to pull latest version of resource
  // Afterwards check that the latest version is not deleted.
  queryText = `${queryText} ORDER BY resources.id, resources.version_id DESC) as latest_resources where latest_resources.deleted = false `;

  const sortBy = parametersResult.find((p) => p.name === "_sort");
  const countParam = parametersResult.find((p) => p.name === "_count");
  const offsetParam = parametersResult.find((p) => p.name === "_offset");
  const totalParam = parametersResult.find((p) => p.name === "_total");

  const limit =
    countParam &&
    !isNaN(parseInt((countParam.value && countParam.value[0]).toString()))
      ? Math.min(
          Math.max(
            parseInt((countParam.value && countParam.value[0]).toString()),
            0
          ),
          50
        )
      : 50;

  const offset =
    offsetParam &&
    !isNaN(parseInt((offsetParam.value && offsetParam.value[0]).toString()))
      ? Math.max(
          parseInt((offsetParam.value && offsetParam.value[0]).toString()),
          0
        )
      : 0;

  // Placing total before sort clauses for perf.
  const total = await calculateTotal(
    client,
    totalParam?.value[0] || "none",
    queryText,
    values
  );

  if (sortBy) {
    const res = await deriveSortQuery(
      ctx,
      request.level === "type" ? [request.resourceType as ResourceType] : [],
      sortBy,
      queryText,
      index,
      values
    );
    queryText = res.query;
    index = res.index;
    values = res.values;
  }

  if (process.env.LOG_SQL) {
    console.log(
      values.reduce((queryText, value, index) => {
        return queryText.replace(`$${index + 1}`, `'${value}'`);
      }, queryText)
    );
  }

  const res = await client.query(
    `${queryText} LIMIT $${index++} OFFSET $${index++}`,
    [...values, limit, offset]
  );

  return {
    total,
    resources: res.rows.map((row) => row.resource) as Resource[],
  };
}

async function calculateTotal(
  client: pg.Client,
  totalType: string | number,
  query: string,
  values: any[]
): Promise<number | undefined> {
  switch (totalType) {
    case "none":
      return undefined;
    case "accurate":
    case "estimate":
      // TODO SWITCH to count_estimate for estimate
      const result = await client.query(
        // Need to escape out quotations with double quote so can place as query text.
        `SELECT COUNT(qresult.resource) FROM (${query}) as qresult`,
        values
      );
      return parseInt(result.rows[0].count);
    default:
      throw new OperationError(
        outcomeError(
          "fatal",
          "Unknown total type received must be 'none', 'estimate' or 'accurate'"
        )
      );
  }
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
          throw new OperationError(
            outcomeError("not-supported", `Patch is not yet supported.`)
          );
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
        case "delete-request": {
          await deleteResource(
            client,
            args.ctx,
            request.resourceType as ResourceType,
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
  config: pg.ClientConfig
): FHIRClientAsync<CTX> {
  const client = new pg.Client(config);
  client.connect();
  return new AsynchronousClient<{ client: pg.Client }, CTX>(
    { client: client },
    createPostgresMiddleware()
  );
}
