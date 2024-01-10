import pg from "pg";
import type * as s from "zapatos/schema";
import * as db from "zapatos/db";

import {
  SystemSearchRequest,
  TypeSearchRequest,
} from "@iguhealth/client/types";
import { Resource, ResourceType, id } from "@iguhealth/fhir-types/r4/types";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { FHIRServerCTX, asSystemCTX } from "../../../fhir/context.js";
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

/**
 * Returns Parameter for _id search parameter that is not missing (allows filter for latest).
 * @param ctx Server context (should be system as this is returning Parameter for latest)
 * @param resourceTypes The resource Types to search for
 * @param resourceParameters Current search parameters
 * @returns
 */
async function getParameterForLatestId(
  ctx: FHIRServerCTX,
  resourceTypes: ResourceType[]
): Promise<SearchParameterResource[]> {
  const idParameter = (
    await parametersWithMetaAssociated(
      async (resourceTypes, name) =>
        await findSearchParameter(ctx.client, ctx, resourceTypes, name),
      resourceTypes,
      [{ name: "_id", modifier: "missing", value: ["false"] }]
    )
  ).filter((v): v is SearchParameterResource => v.type === "resource");

  return idParameter;
}

const getIds: (resources: Resource[]) => id[] = (resources) =>
  resources.map((r) => r.id).filter((r): r is id => r !== undefined);

async function processRevInclude(
  ctx: FHIRServerCTX,
  param: SearchParameterResult,
  results: Resource[]
): Promise<Resource[]> {
  if (param.value.length > 1)
    throw new OperationError(
      outcomeError(
        "too-costly",
        "Too many revinclude parameters only allow up to 1 at this time."
      )
    );

  const ids = getIds(results);
  if (ids.length === 0) return [];

  return (
    await Promise.all(
      param.value.map(async (v) => {
        const revInclude = v.toString().split(":");
        if (revInclude.length !== 2)
          throw new OperationError(
            outcomeError("invalid", "Invalid _revinclude parameter")
          );
        const resourceType = revInclude[0] as ResourceType;
        const searchParameterRevInclude = revInclude[1];
        const revIncludeResults = await ctx.client.search_type(
          ctx,
          resourceType,
          [
            {
              name: searchParameterRevInclude,
              value: ids,
            },
          ]
        );
        return revIncludeResults.resources;
      })
    )
  ).flat();
}

async function processInclude(
  client: pg.PoolClient,
  ctx: FHIRServerCTX,
  param: SearchParameterResult,
  results: Resource[]
): Promise<Resource[]> {
  if (param.value.length > 1)
    throw new OperationError(
      outcomeError(
        "too-costly",
        "Too many revinclude parameters only allow up to 1 at this time."
      )
    );

  const ids = getIds(results);
  if (ids.length === 0) return [];

  return (
    await Promise.all(
      param.value.map(async (v) => {
        const include = v.toString().split(":");
        if (include.length !== 2)
          throw new OperationError(
            outcomeError("invalid", "Invalid _include parameter")
          );
        const resourceType = include[0] as ResourceType;
        const includeParameterName = include[1];
        const includeParameterSearchParam = await ctx.client.search_type(
          asSystemCTX(ctx),
          "SearchParameter",
          [
            { name: "name", value: [includeParameterName] },
            { name: "type", value: ["reference"] },
            { name: "base", value: [resourceType] },
          ]
        );
        if (includeParameterSearchParam.resources.length === 0)
          throw new OperationError(
            outcomeError(
              "not-found",
              `Include parameter not found with name '${includeParameterName}'`
            )
          );
        if (includeParameterSearchParam.resources.length > 1)
          throw new OperationError(
            outcomeError(
              "conflict",
              `Include parameter found multiple instances with same name '${includeParameterName}'`
            )
          );

        // Derive the id and type from the reference_idx table for the given param for the resources.
        const idResult = await db.sql<
          s.reference_idx.SQL,
          s.reference_idx.Selectable[]
        >`
        SELECT ${"reference_id"}, ${"reference_type"}
        FROM ${"reference_idx"} 
        WHERE ${"r_id"} IN (${sqlUtils.paramsWithComma(ids)}) AND
        ${"parameter_url"} = ${db.param(
          includeParameterSearchParam.resources[0].url
        )}
        `.run(client);

        const types: string[] = [
          ...new Set(idResult.map((r) => r.reference_type)),
        ];

        return ctx.client
          .search_system(ctx, [
            { name: "_type", value: types },
            {
              name: "_id",
              value: idResult.map((id) => id.reference_id),
            },
          ])
          .then((r) => r.resources);
      })
    )
  ).flat();
}

export async function executeSearchQuery(
  client: pg.PoolClient,
  ctx: FHIRServerCTX,
  request: SystemSearchRequest | TypeSearchRequest
): Promise<{ total?: number; resources: Resource[] }> {
  const resourceTypes = deriveResourceTypeFilter(request);
  // Remove _type as using on derived resourceTypeFilter
  request.parameters = request.parameters.filter((p) => p.name !== "_type");

  const parameters = await parametersWithMetaAssociated(
    async (resourceTypes, name) =>
      await findSearchParameter(
        ctx.client,
        asSystemCTX(ctx),
        resourceTypes,
        name
      ),
    resourceTypes,
    request.parameters
  );

  const resourceParameters = parameters
    .filter((v): v is SearchParameterResource => v.type === "resource")
    .concat(await getParameterForLatestId(asSystemCTX(ctx), resourceTypes));

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
  const includeParam = parametersResult.find((p) => p.name === "_include");
  const revIncludeParam = parametersResult.find(
    (p) => p.name === "_revinclude"
  );

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
      
      WHERE ${"resources"}.${"tenant"} = ${db.param(ctx.tenant.id)}
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

  const result = await sql.run(client);

  const total =
    // In case where nothing returned means that total_count col will not be present.
    result[0] === undefined
      ? 0
      : result[0]?.total_count !== undefined
      ? parseInt(result[0]?.total_count)
      : undefined;

  let resources: Resource[] = result.map(
    (r) => r.resource as unknown as Resource
  );

  if (revIncludeParam) {
    resources = resources.concat(
      await processRevInclude(
        ctx,
        revIncludeParam,
        result.map((r) => r.resource as unknown as Resource)
      )
    );
  }

  if (includeParam) {
    resources = resources.concat(
      await processInclude(
        client,
        ctx,
        includeParam,
        result.map((r) => r.resource as unknown as Resource)
      )
    );
  }

  return {
    total,
    resources,
  };
}
