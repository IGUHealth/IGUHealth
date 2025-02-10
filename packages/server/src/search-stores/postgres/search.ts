import * as db from "zapatos/db";
import type * as s from "zapatos/schema";

import {
  MetaParameter,
  SearchParameterResource,
  SearchParameterResult,
} from "@iguhealth/client/lib/url";
import { id } from "@iguhealth/fhir-types/r4/types";
import { FHIR_VERSION, ResourceType } from "@iguhealth/fhir-types/versions";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { getSp1Name } from "../../cli/generate/sp1-parameters.js";
import { IGUHealthServerCTX, asRoot } from "../../fhir-server/types.js";
import { FHIRSearchRequest, SearchResult } from "../interface.js";
import { toSQLString } from "../log-sql.js";
import {
  deriveLimit,
  deriveResourceTypeFilter,
  findSearchParameter,
  parametersWithMetaAssociated,
  searchParameterToTableName,
} from "../parameters.js";
import * as sqlUtils from "../sql.js";
import { singularSQLClauses } from "./clauses/db_singular_clauses/index.js";
import buildParametersSQL, { splitSingular } from "./clauses/index.js";
import { deriveSortQuery } from "./sort.js";

type InteralSearchRequest<Version extends FHIR_VERSION> = {
  resourceTypes: ResourceType<Version>[];
  fhirVersion: Version;
  parameters: MetaParameter<Version>[];
};

/**
 * Performs request processing to get the correct parameters and resource types and returns object with metadata.
 * @param ctx Server context
 * @param request A FHIR Search Request
 * @returns Object with parameter metadata and derived resourcetype filters.
 */
async function fhirSearchRequesttoInternalRequest<
  Request extends FHIRSearchRequest,
>(
  ctx: IGUHealthServerCTX,
  request: Request,
): Promise<InteralSearchRequest<Request["fhirVersion"]>> {
  const queryParameters = request.parameters;
  const resourceTypes = deriveResourceTypeFilter(request);

  const parameters = await parametersWithMetaAssociated(
    async (resourceTypes, name) =>
      findSearchParameter(
        ctx.client,
        asRoot(ctx),
        request.fhirVersion,
        resourceTypes,
        name,
      ),
    resourceTypes,
    // Used for resource type filtering.
    queryParameters.filter((p) => p.name !== "_type"),
  );

  return {
    resourceTypes,
    fhirVersion: request.fhirVersion,
    parameters,
  };
}

async function processRevInclude<Version extends FHIR_VERSION>(
  ctx: IGUHealthServerCTX,
  fhirVersion: Version,
  param: SearchParameterResult,
  ids: id[],
): Promise<SearchResult[]> {
  if (param.value.length > 1)
    throw new OperationError(
      outcomeError(
        "too-costly",
        "Too many revinclude parameters only allow up to 1 at this time.",
      ),
    );

  if (ids.length === 0) return [];

  return (
    await Promise.all(
      param.value.map(async (v) => {
        const revInclude = v.toString().split(":");
        if (revInclude.length !== 2)
          throw new OperationError(
            outcomeError("invalid", "Invalid _revinclude parameter"),
          );
        const resourceType = revInclude[0] as ResourceType<Version>;
        const searchParameterRevInclude = revInclude[1];
        const revIncludeResults = await ctx.client.search_type(
          ctx,
          fhirVersion,
          resourceType,
          [
            {
              name: searchParameterRevInclude,
              value: ids,
            },
          ],
        );
        return revIncludeResults.resources;
      }),
    )
  )
    .flat()
    .map((r) => ({
      version_id: r.meta?.versionId as id,
      id: r.id as id,
      type: r.resourceType,
    }));
}

async function processInclude<Version extends FHIR_VERSION>(
  client: db.Queryable,
  ctx: IGUHealthServerCTX,
  fhirVersion: Version,
  param: SearchParameterResult,
  ids: id[],
): Promise<SearchResult[]> {
  if (param.value.length > 1)
    throw new OperationError(
      outcomeError(
        "too-costly",
        "Too many revinclude parameters only allow up to 1 at this time.",
      ),
    );

  if (ids.length === 0) return [];

  return (
    await Promise.all(
      param.value.map(async (v) => {
        const include = v.toString().split(":");
        if (include.length !== 2)
          throw new OperationError(
            outcomeError("invalid", "Invalid _include parameter"),
          );
        const resourceType = include[0] as ResourceType<Version>;
        const includeParameterName = include[1];
        const includeParameterSearchParam = await ctx.client.search_type(
          asRoot(ctx),
          fhirVersion,
          "SearchParameter",
          [
            { name: "code", value: [includeParameterName] },
            { name: "type", value: ["reference"] },
            { name: "base", value: [resourceType] },
          ],
        );

        if (includeParameterSearchParam.resources.length === 0)
          throw new OperationError(
            outcomeError(
              "not-found",
              `Include parameter not found with name '${includeParameterName}'`,
            ),
          );
        if (includeParameterSearchParam.resources.length > 1)
          throw new OperationError(
            outcomeError(
              "conflict",
              `Include parameter found multiple instances with same name '${includeParameterName}'`,
            ),
          );

        // Derive the id and type from the reference_idx table for the given param for the resources.
        const idResult = await db.sql<
          s.r4_reference_idx.SQL | s.r4b_reference_idx.SQL,
          (s.r4_reference_idx.Selectable | s.r4b_reference_idx.Selectable)[]
        >`
          SELECT ${"reference_id"}, ${"reference_type"}
          FROM ${searchParameterToTableName(fhirVersion, "reference")} 
          WHERE ${"r_id"} IN (${sqlUtils.paramsWithComma(ids)}) AND
          ${"parameter_url"} = ${db.param(
            includeParameterSearchParam.resources[0].url,
          )}
          `.run(client);

        const types: string[] = [
          ...new Set(idResult.map((r) => r.reference_type)),
        ];

        return ctx.client
          .search_system(ctx, fhirVersion, [
            { name: "_type", value: types },
            {
              name: "_id",
              value: idResult.map((id) => id.reference_id),
            },
          ])
          .then((r) => r.resources);
      }),
    )
  )
    .flat()
    .map((r) => ({
      version_id: r.meta?.versionId as id,
      id: r.id as id,
      type: r.resourceType,
    }));
}

/**
 * Returns columns for search query on resources.
 * @param totalParameter _total parameter value.
 */
function resourceSearchColumns(
  table: ReturnType<typeof getSp1Name>,
  totalParameterValue: string,
): string[] {
  const columns = [
    `${table}.r_version_id`,
    `${table}.r_id`,
    `${table}.resource_type`,
  ];
  switch (totalParameterValue) {
    case "none": {
      return columns;
    }
    case "accurate":
    case "estimate": {
      return [...columns, "count(*) OVER () AS total_count"];
    }
    default:
      throw new OperationError(
        outcomeError(
          "invalid",
          "Unknown total type received must be 'none', 'estimate' or 'accurate'",
        ),
      );
  }
}

async function deriveResourceSearchSQL<Version extends FHIR_VERSION>(
  ctx: IGUHealthServerCTX,
  request: InteralSearchRequest<Version>,
): Promise<
  db.SQLFragment<
    ((s.r4_sp1_idx.Selectable | s.r4b_sp1_idx.Selectable) & {
      total_count?: string;
    })[]
  >
> {
  const resourceParameters = request.parameters.filter(
    (v): v is SearchParameterResource<Version> => v.type === "resource",
  );

  const parametersResult = request.parameters.filter(
    (v): v is SearchParameterResult => v.type === "result",
  );

  const { singular, many } = splitSingular(
    request.fhirVersion,
    resourceParameters,
  );

  const singularClauses = singularSQLClauses(
    ctx,
    request.fhirVersion,
    singular,
  );

  const manyClauses = buildParametersSQL(ctx, request.fhirVersion, many);

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
          0,
        )
      : 0;

  const totalParamValue = totalParam?.value[0]?.toString() || "none";
  const root_table_name = getSp1Name(request.fhirVersion);
  const cols = resourceSearchColumns(root_table_name, totalParamValue);

  let sql = db.sql<
    s.r4_sp1_idx.SQL | s.r4b_sp1_idx.SQL,
    ((s.r4_sp1_idx.Selectable | s.r4b_sp1_idx.Selectable) & {
      total_count?: string;
    })[]
  >`
      SELECT ${db.mapWithSeparator(cols, db.sql`, `, (c) => db.raw(c))}
      FROM ${root_table_name} 
      ${manyClauses.map((q, i) => {
        const queryAlias = db.raw(`query${i}`);
        return db.sql` JOIN (${q}) as ${queryAlias} ON ${queryAlias}.${"r_version_id"}=${root_table_name}.${"r_version_id"}`;
      })}
      
      WHERE ${db.conditions.and({ tenant: ctx.tenant }, ...singularClauses)}
      AND ${root_table_name}.${"resource_type"} ${
        request.resourceTypes.length > 0
          ? db.sql`in (${sqlUtils.paramsWithComma(request.resourceTypes)})`
          : db.sql`is not null`
      }`;

  if (sortBy) {
    sql = await deriveSortQuery(
      ctx,
      request.fhirVersion,
      request.resourceTypes,
      sortBy,
      sql,
    );
  }

  sql = db.sql<
    s.r4_sp1_idx.SQL | s.r4b_sp1_idx.SQL,
    ((s.r4_sp1_idx.Selectable | s.r4b_sp1_idx.Selectable) & {
      total_count?: string;
    })[]
  >`${sql} LIMIT ${db.param(limit)} OFFSET ${db.param(offset)}`;

  return sql;
}

export async function executeSearchQuery<Request extends FHIRSearchRequest>(
  pg: db.Queryable,
  ctx: IGUHealthServerCTX,
  fhirRequest: Request,
): Promise<{
  total?: number;
  result: SearchResult[];
}> {
  const request = await fhirSearchRequesttoInternalRequest(ctx, fhirRequest);
  const searchSQL = await deriveResourceSearchSQL(ctx, request);

  if (process.env.LOG_SQL) {
    ctx.logger.info(toSQLString(searchSQL));
  }

  const result = await searchSQL.run(pg);

  const total =
    // In case where nothing returned means that total_count col will not be present.
    result[0] === undefined
      ? 0
      : result[0]?.total_count !== undefined
        ? parseInt(result[0]?.total_count)
        : undefined;

  let searchResults: SearchResult[] = result.map(
    (r): SearchResult => ({
      version_id: r.r_version_id.toString() as id,
      id: r.r_id.toString() as id,
      type: r.resource_type as ResourceType<FHIR_VERSION>,
    }),
  );

  const includeParam = request.parameters.find(
    (p) => p.name === "_include" && p.type === "result",
  ) as SearchParameterResult | undefined;
  const revIncludeParam = request.parameters.find(
    (p) => p.name === "_revinclude" && p.type === "result",
  ) as SearchParameterResult | undefined;

  if (revIncludeParam) {
    searchResults = searchResults.concat(
      await processRevInclude(
        ctx,
        request.fhirVersion,
        revIncludeParam,
        searchResults.map((r) => r.id) as id[],
      ),
    );
  }
  if (includeParam) {
    searchResults = searchResults.concat(
      await processInclude(
        pg,
        ctx,
        request.fhirVersion,
        includeParam,
        result.map((r) => r.r_id) as id[],
      ),
    );
  }

  return {
    total,
    result: searchResults,
  };
}
