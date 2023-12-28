import pg from "pg";
import type * as s from "zapatos/schema";
import * as db from "zapatos/db";

import {
  SystemSearchRequest,
  TypeSearchRequest,
} from "@iguhealth/client/types";
import { Resource, ResourceType } from "@iguhealth/fhir-types/r4/types";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { FHIRServerCTX } from "../../../ctx/types.js";
import {
  SearchParameterResource,
  SearchParameterResult,
  findSearchParameter,
  parametersWithMetaAssociated,
  deriveResourceTypeFilter,
  deriveLimit,
} from "../../utilities/search/parameters.js";
import * as sqlUtils from "../../utilities/sql.js";

import { deriveSortQuery } from "./sort.js";
import { buildParameterSQL } from "./clauses/index.js";

function buildParametersSQL(
  ctx: FHIRServerCTX,
  parameters: SearchParameterResource[]
): db.SQLFragment[] {
  return parameters.map((p) => buildParameterSQL(ctx, p));
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

  const parameterClauses = buildParametersSQL(ctx, resourceParameters);

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

  const totalParamValue = totalParam?.value[0]?.toString() || "none";
  let cols: string[] = ["*"];

  switch (totalParamValue) {
    case "none": {
      break;
    }
    case "accurate":
    case "estimate": {
      cols = ["*", "count(*) OVER () AS total_count"];
      break;
    }
    default:
      throw new OperationError(
        outcomeError(
          "invalid",
          "Unknown total type received must be 'none', 'estimate' or 'accurate'"
        )
      );
  }

  let sql = db.sql<
    s.resources.SQL,
    (s.resources.Selectable & { total_count?: string })[]
  >`
      SELECT ${db.mapWithSeparator(cols, db.sql`, `, (c) => db.raw(c))}
      FROM ${"resources"} 
      ${parameterClauses.map((q, i) => {
        const queryAlias = db.raw(`query${i}`);
        return db.sql` JOIN (${q}) as ${queryAlias} ON ${queryAlias}.${"r_version_id"}=${"resources"}.${"version_id"}`;
      })}
      
      WHERE ${"resources"}.${"workspace"} = ${db.param(ctx.workspace)}
      AND ${"resources"}.${"resource_type"} ${
    resourceTypes.length > 0
      ? db.sql`in (${sqlUtils.paramsWithComma(resourceTypes)})`
      : db.sql`is not null`
  }`;

  if (sortBy) sql = await deriveSortQuery(ctx, resourceTypes, sortBy, sql);

  sql = db.sql<
    s.resources.SQL,
    s.resources.Selectable[]
  >`${sql} LIMIT ${db.param(limit)} OFFSET ${db.param(offset)}`;

  if (process.env.LOG_SQL) {
    const v = sql.compile();
    ctx.logger.info(v.text);
  }

  const res = await sql.run(client);

  const total =
    // In case where nothing returned means that total_count col will not be present.
    res[0] === undefined
      ? 0
      : res[0]?.total_count !== undefined
      ? parseInt(res[0]?.total_count)
      : undefined;

  return {
    total,
    resources: res.map((r) => r.resource as unknown as Resource),
  };
}
