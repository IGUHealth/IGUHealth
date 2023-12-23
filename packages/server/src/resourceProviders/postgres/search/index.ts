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
  parametersWithMetaAssociated,
  deriveResourceTypeFilter,
  deriveLimit,
} from "../../utilities/search/parameters.js";

import { deriveSortQuery } from "./sort.js";
import { buildParameterSQL } from "./parameters/index.js";

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
