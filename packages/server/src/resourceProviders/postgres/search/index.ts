import pg from "pg";
import dayjs from "dayjs";

import {
  SystemSearchRequest,
  TypeSearchRequest,
} from "@iguhealth/client/types";
import { Resource, ResourceType } from "@iguhealth/fhir-types/r4/types";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { FHIRServerCTX } from "../../../ctx/types.js";

import {
  findSearchParameter,
  SearchParameterResource,
  SearchParameterResult,
  searchParameterToTableName,
  parametersWithMetaAssociated,
  deriveResourceTypeFilter,
  deriveLimit,
} from "../../utilities/search/parameters.js";

import { deriveSortQuery } from "./sort.js";
import referenceParameter from "./parameters/reference.js";
import numberParameter from "./parameters/number.js";
import stringParameter from "./parameters/string.js";
import uriParameter from "./parameters/uri.js";
import dateParameter from "./parameters/date.js";

export function buildParameterSQL(
  ctx: FHIRServerCTX,
  parameter: SearchParameterResource,
  index: number,
  values: unknown[],
  columns: string[] = ["DISTINCT(r_version_id)"]
): { index: number; query: string; values: unknown[] } {
  const searchParameter = parameter.searchParameter;
  const search_table = searchParameterToTableName(searchParameter.type);

  const rootSelect = `SELECT ${columns.join(
    ", "
  )} FROM ${search_table} WHERE parameter_url = $${index++} `;
  values = [...values, searchParameter.url];
  let parameterClause: string;

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
              if (value === "true") {
                throw new OperationError(
                  outcomeError(
                    "not-supported",
                    "For modifier 'missing' value of 'true' is not yet supported"
                  )
                );
              }
              // Currently only supporting false for now. (which means value must exist)
              return `value IS NOT NULL`;
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
      parameterClause = parameter.value
        .map((value) => {
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
        })
        .join("OR");
      break;
    }
    case "date": {
      const result = dateParameter(ctx, parameter, values);
      parameterClause = result.query;
      values = result.values;
      index = result.values.length + 1;
      break;
    }
    case "uri": {
      const result = uriParameter(ctx, parameter, values);
      parameterClause = result.query;
      values = result.values;
      index = result.values.length + 1;
      break;
    }

    case "string": {
      const result = stringParameter(ctx, parameter, values);
      parameterClause = result.query;
      values = result.values;
      index = result.values.length + 1;
      break;
    }
    case "number": {
      const result = numberParameter(ctx, parameter, values);
      parameterClause = result.query;
      values = result.values;
      index = result.values.length + 1;
      break;
    }
    case "reference": {
      // SUPPORT FOR PARAMETER CHAINS
      // Example: Observation?patient.general-practitioner.name=Adam
      const result = referenceParameter(ctx, parameter, values);
      parameterClause = result.query;
      values = result.values;
      index = result.values.length + 1;
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

  const query = `(${rootSelect} AND workspace=$${index++} ${
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
  values: unknown[]
): { index: number; queries: string[]; values: unknown[] } {
  return parameters.reduce(
    (
      acc: { queries: string[]; index: number; values: unknown[] },
      parameter
    ) => {
      const res = buildParameterSQL(ctx, parameter, index, values);
      index = res.index;
      values = res.values;
      return { queries: [...acc.queries, res.query], index, values };
    },
    { queries: [], index, values }
  );
}

async function calculateTotal(
  client: pg.PoolClient,
  totalType: string | number,
  query: string,
  values: unknown[]
): Promise<number | undefined> {
  switch (totalType) {
    case "none":
      return undefined;
    case "accurate":
    case "estimate": {
      // TODO SWITCH to count_estimate for estimate
      const result = await client.query(
        // Need to escape out quotations with double quote so can place as query text.
        `SELECT COUNT(qresult.resource) FROM (${query}) as qresult`,
        values
      );
      return parseInt(result.rows[0].count);
    }
    default:
      throw new OperationError(
        outcomeError(
          "fatal",
          "Unknown total type received must be 'none', 'estimate' or 'accurate'"
        )
      );
  }
}

/* Filter to the latest version of the resource only.
 ** Scenarios where you search for a resource type but no parameters are provided
 ** This scenario need to filter to ensure only the latest is included.
 ** Approach I take is to use _id parameter which all resources would have
 ** that are current.
 */
async function ensureLatest(
  ctx: FHIRServerCTX,
  resourceTypes: ResourceType[],
  resourceParameters: SearchParameterResource[]
) {
  const idParameter = (
    await parametersWithMetaAssociated(
      async (resourceTypes, name) =>
        await findSearchParameter(ctx, resourceTypes, name),
      resourceTypes,
      [{ name: "_id", modifier: "missing", value: ["false"] }]
    )
  ).filter((v): v is SearchParameterResource => v.type === "resource");

  return resourceParameters.concat(idParameter);
}

export async function executeSearchQuery(
  client: pg.PoolClient,
  request: SystemSearchRequest | TypeSearchRequest,
  ctx: FHIRServerCTX
): Promise<{ total?: number; resources: Resource[] }> {
  let values: unknown[] = [];
  let index = 1;

  const resourceTypes = deriveResourceTypeFilter(request);
  // Remove _type as using on derived resourceTypeFilter
  request.parameters = request.parameters.filter((p) => p.name !== "_type");

  const parameters = await parametersWithMetaAssociated(
    async (resourceTypes, name) =>
      await findSearchParameter(ctx, resourceTypes, name),
    resourceTypes,
    request.parameters
  );

  const resourceParameters = await ensureLatest(
    ctx,
    resourceTypes,
    parameters.filter(
      (v): v is SearchParameterResource => v.type === "resource"
    )
  );

  const parametersResult = parameters.filter(
    (v): v is SearchParameterResult => v.type === "result"
  );

  const parameterQuery = buildParametersSQL(
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
         resourceTypes.length > 0
           ? (() => {
               values = [...values, ...resourceTypes];
               return `in (${resourceTypes
                 .map((t) => `$${index++}`)
                 .join(", ")})`;
             })()
           : `is not null`
       } `;

  // Neccessary to pull latest version of resource
  // Afterwards check that the latest version is not deleted.

  const sortBy = parametersResult.find((p) => p.name === "_sort");
  const countParam = parametersResult.find((p) => p.name === "_count");
  const offsetParam = parametersResult.find((p) => p.name === "_offset");
  const totalParam = parametersResult.find((p) => p.name === "_total");

  const limit = deriveLimit([0, 50], countParam);

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
      resourceTypes,
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
    ctx.logger.info(
      values.reduce((queryText: string, value, index) => {
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
