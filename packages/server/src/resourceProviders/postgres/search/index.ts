import pg from "pg";
import dayjs from "dayjs";

import { ParsedParameter } from "@iguhealth/client/lib/url.js";
import {
  SystemSearchRequest,
  TypeSearchRequest,
} from "@iguhealth/client/lib/types";
import {
  Resource,
  ResourceType,
  SearchParameter,
} from "@iguhealth/fhir-types/r4/types";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { FHIRServerCTX } from "../../../fhirServer.js";
import { param_types_supported } from "../constants.js";
import {
  searchResources,
  getDecimalPrecision,
  searchParameterToTableName,
} from "../utilities.js";
import type {
  SearchParameterResource,
  SearchParameterResult,
  ParameterType,
} from "./types.js";
import { deriveSortQuery } from "./sort.js";

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
      switch (parameter.modifier) {
        case "missing":
          parameterClause = parameter.value
            .map((value) => {
              if (value !== "true" && value !== "false") {
                throw new OperationError(
                  outcomeError(
                    "invalid",
                    `Invalid value for modifier 'missing' must be 'true' or 'false'`
                  )
                );
              }
              return `value IS ${value === "true" ? "NULL" : "NOT NULL"}`;
            })
            .join(" OR ");
          break;
        default:
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
          const result = value
            .toString()
            .match(
              /^(?<prefix>eq|ne|gt|lt|ge|le|sa|eb|ap)?(?<value>(-)?[0-9]+(.[0-9]*)?)$/
            );

          if (!result) {
            throw new OperationError(
              outcomeError(
                "invalid",
                `Invalid input value '${parameter.value}' for parameter '${searchParameter.name}'`
              )
            );
          }
          const numericPortion = result?.groups?.value;
          const prefix = result?.groups?.prefix;

          if (!numericPortion) {
            throw new OperationError(
              outcomeError(
                "invalid",
                `A Number must be provided for parameter '${searchParameter.name}'`
              )
            );
          }

          const numberValue = parseFloat(numericPortion);
          if (isNaN(numberValue)) {
            throw new OperationError(
              outcomeError(
                "invalid",
                `Invalid number value '${parameter.value}' for parameter '${searchParameter.name}'`
              )
            );
          }

          const decimalPrecision = getDecimalPrecision(numberValue);
          switch (prefix) {
            // the range of the search value fully contains the range of the target value
            case "eq":
            case undefined:
              values = [
                ...values,
                -decimalPrecision,
                numberValue,
                -decimalPrecision,
                numberValue,
              ];
              return `(value - 0.5 * 10 ^ $${index++})  <= $${index++} AND (value + 0.5 * 10 ^ $${index++}) >= $${index++}`;
            // 	the range of the search value does not fully contain the range of the target value
            case "ne":
              values = [
                ...values,
                -decimalPrecision,
                numberValue,
                -decimalPrecision,
                numberValue,
              ];
              return `(value - 0.5 * 10 ^ $${index++})  > $${index++} OR (value + 0.5 * 10 ^ $${index++}) < $${index++}`;
            // the range above the search value intersects (i.e. overlaps) with the range of the target value
            case "gt":
              // Start at lowerbound to exclude the intersection.
              values = [...values, -decimalPrecision, numberValue];
              return `(value - 0.5 * 10 ^ $${index++}) > $${index++}`;
            //	the value for the parameter in the resource is less than the provided value
            case "lt":
              // Start at upperbound to exclude the intersection.
              values = [...values, -decimalPrecision, numberValue];
              return `(value + 0.5 * 10 ^ $${index++}) < $${index++}`;
            // the range above the search value intersects (i.e. overlaps) with the range of the target value,
            // or the range of the search value fully contains the range of the target value
            case "ge":
              // Perform search as GT but use >= and start on upperbound.
              values = [...values, -decimalPrecision, numberValue];
              return `(value + 0.5 * 10 ^ $${index++}) >= $${index++}`;
            case "le":
              // Perform search as lt but use <= and start on lowerbound
              values = [...values, -decimalPrecision, numberValue];
              return `(value - 0.5 * 10 ^ $${index++}) <= $${index++}`;
            case "sa":
            case "eb":
            case "ap":
            default:
              throw new OperationError(
                outcomeError(
                  "not-supported",
                  `Prefix '${prefix}' not supported for parameter '${searchParameter.name}'`
                )
              );
          }
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

// OLD METHOD FOR Filters to the latest value used on end user search query
// Note for subscription we avoid this as all values should be pushed through
// Note this matters for empty resourcetype queries otherwise parameters would only pick the latest.
// MIGRATED TO USE _id:missing=false as a filter instead.
function filterToLatest(query: string): string {
  return `SELECT * FROM (SELECT DISTINCT ON (id) id, * FROM (${query}) as all_resources 
       ORDER BY all_resources.id, all_resources.version_id DESC) 
       as latest_resources where latest_resources.deleted = false`;
}

export async function executeSearchQuery(
  client: pg.Client,
  request: SystemSearchRequest | TypeSearchRequest,
  ctx: FHIRServerCTX,
  onlyLatest: boolean = true
): Promise<{ total?: number; resources: Resource[] }> {
  let values: any[] = [];
  let index = 1;

  const parameters = await paramWithMeta(
    ctx,
    request.level === "type" ? [request.resourceType as ResourceType] : [],
    request.parameters
  );
  // Standard parameters
  let resourceParameters = parameters.filter(
    (v): v is SearchParameterResource => v.type === "resource"
  );
  // Scenarios where you search for a resource type but no parameters are provided
  // This scenario need to filter to ensure only the latest is included.
  // Approach I take is to use _id parameter which all resources would have
  // that are current.
  if (onlyLatest) {
    const idParameter = (
      await paramWithMeta(
        ctx,
        request.level === "type" ? [request.resourceType as ResourceType] : [],
        [{ name: "_id", modifier: "missing", value: ["false"] }]
      )
    ).filter((v): v is SearchParameterResource => v.type === "resource");
    resourceParameters = resourceParameters.concat(idParameter);
  }

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
       SELECT * 
       FROM resources 
       ${parameterQuery.queries
         .map(
           (q, i) =>
             `JOIN ${q} as query${i} ON query${i}.r_version_id=resources.version_id`
         )
         .join("\n     ")}
       
       WHERE resources.workspace = $${index++}
       AND resources.resource_type ${
         request.level === "type"
           ? (() => {
               values = [...values, request.resourceType];
               return `= $${index++}`;
             })()
           : `is not null`
       } `;

  // Neccessary to pull latest version of resource
  // Afterwards check that the latest version is not deleted.

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
