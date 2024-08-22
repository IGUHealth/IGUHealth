import * as db from "zapatos/db";
import type * as s from "zapatos/schema";

import {
  R4BSystemSearchRequest,
  R4BTypeSearchRequest,
  R4SystemSearchRequest,
  R4TypeSearchRequest,
} from "@iguhealth/client/types";
import { id } from "@iguhealth/fhir-types/r4/types";
import {
  AllResourceTypes,
  FHIR_VERSION,
  Resource,
  ResourceType,
} from "@iguhealth/fhir-types/versions";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { IGUHealthServerCTX, asRoot } from "../../../../fhir-api/types.js";
import {
  ParameterType,
  SearchParameterResource,
  SearchParameterResult,
  deriveLimit,
  deriveResourceTypeFilter,
  findSearchParameter,
  parametersWithMetaAssociated,
  searchParameterToTableName,
} from "../../../utilities/search/parameters.js";
import * as sqlUtils from "../../../utilities/sql.js";
import { toDBFHIRVersion } from "../../../utilities/version.js";
import { buildParameterSQL } from "./clauses/index.js";
import { deriveSortQuery } from "./sort.js";

type FHIRSearchRequest =
  | R4SystemSearchRequest
  | R4TypeSearchRequest
  | R4BSystemSearchRequest
  | R4BTypeSearchRequest;

type InteralSearchRequest<Version extends FHIR_VERSION> = {
  resourceTypes: ResourceType<Version>[];
  fhirVersion: Version;
  parameters: ParameterType[];
};

/**
 * Performs request processing to get the correct parameters and resource types and returns object with metadata.
 * @param ctx Server context
 * @param request A FHIR Search Request
 * @returns Object with parameter metadata and derived resourcetype filters.
 */
async function fhirSearchRequesttoInteralRequest<
  Request extends FHIRSearchRequest,
>(
  ctx: IGUHealthServerCTX,
  request: Request,
): Promise<InteralSearchRequest<Request["fhirVersion"]>> {
  const queryParameters = request.parameters;
  const resourceTypes = deriveResourceTypeFilter(request);

  const parameters = await parametersWithMetaAssociated(
    async (resourceTypes, name) =>
      await findSearchParameter(
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

function buildParametersSQL<Version extends FHIR_VERSION>(
  ctx: IGUHealthServerCTX,
  fhirVersion: Version,
  parameters: SearchParameterResource[],
): db.SQLFragment[] {
  return parameters.map((p) => buildParameterSQL(ctx, fhirVersion, p));
}

/**
 * Returns Parameter for _id search parameter that is not missing (allows filter for latest).
 * @param ctx Server context (should be system as this is returning Parameter for latest)
 * @param resourceTypes The resource Types to search for
 * @param resourceParameters Current search parameters
 * @returns
 */
async function getParameterForLatestId<Version extends FHIR_VERSION>(
  ctx: IGUHealthServerCTX,
  fhirVersion: Version,
  resourceTypes: ResourceType<Version>[],
): Promise<SearchParameterResource[]> {
  const idParameter = (
    await parametersWithMetaAssociated(
      async (resourceTypes, code) =>
        await findSearchParameter(
          ctx.client,
          ctx,
          fhirVersion,
          resourceTypes,
          code,
        ),
      resourceTypes,
      [{ name: "_id", modifier: "missing", value: ["false"] }],
    )
  ).filter((v): v is SearchParameterResource => v.type === "resource");

  return idParameter;
}

const getIds: (
  resources: Resource<FHIR_VERSION, AllResourceTypes>[],
) => id[] = (resources) =>
  resources.map((r) => r.id).filter((r): r is id => r !== undefined);

async function processRevInclude<Version extends FHIR_VERSION>(
  ctx: IGUHealthServerCTX,
  fhirVersion: Version,
  param: SearchParameterResult,
  results: Resource<Version, AllResourceTypes>[],
): Promise<Resource<Version, AllResourceTypes>[]> {
  if (param.value.length > 1)
    throw new OperationError(
      outcomeError(
        "too-costly",
        "Too many revinclude parameters only allow up to 1 at this time.",
      ),
    );

  const ids = getIds(results);
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
  ).flat();
}

async function processInclude<Version extends FHIR_VERSION>(
  client: db.Queryable,
  ctx: IGUHealthServerCTX,
  fhirVersion: Version,
  param: SearchParameterResult,
  results: Resource<Version, AllResourceTypes>[],
): Promise<Resource<Version, AllResourceTypes>[]> {
  if (param.value.length > 1)
    throw new OperationError(
      outcomeError(
        "too-costly",
        "Too many revinclude parameters only allow up to 1 at this time.",
      ),
    );

  const ids = getIds(results);
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
  ).flat();
}

/**
 * Returns columns for search query on resources.
 * @param totalParameter _total parameter value.
 */
function resourceSearchColumns(totalParameterValue: string): string[] {
  switch (totalParameterValue) {
    case "none": {
      return ["*"];
    }
    case "accurate":
    case "estimate": {
      return ["*", "count(*) OVER () AS total_count"];
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
    (s.resources.Selectable & {
      total_count?: string;
    })[]
  >
> {
  const resourceParameters = request.parameters
    .filter((v): v is SearchParameterResource => v.type === "resource")
    .concat(
      await getParameterForLatestId(
        asRoot(ctx),
        request.fhirVersion,
        request.resourceTypes,
      ),
    );

  const parametersResult = request.parameters.filter(
    (v): v is SearchParameterResult => v.type === "result",
  );

  const parameterClauses = buildParametersSQL(
    ctx,
    request.fhirVersion,
    resourceParameters,
  );

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
  const cols = resourceSearchColumns(totalParamValue);

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
      
      WHERE ${"resources"}.${"tenant"} = ${db.param(ctx.tenant)}
      AND ${"resources"}.${"fhir_version"} = ${db.param(toDBFHIRVersion(request.fhirVersion))}
      AND ${"resources"}.${"resource_type"} ${
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
    s.resources.SQL,
    s.resources.Selectable[]
  >`${sql} LIMIT ${db.param(limit)} OFFSET ${db.param(offset)}`;

  return sql;
}

export async function executeSearchQuery<Request extends FHIRSearchRequest>(
  ctx: IGUHealthServerCTX,
  fhirRequest: Request,
): Promise<{
  total?: number;
  resources: Resource<Request["fhirVersion"], AllResourceTypes>[];
}> {
  const request = await fhirSearchRequesttoInteralRequest(ctx, fhirRequest);
  const searchSQL = await deriveResourceSearchSQL(ctx, request);

  if (process.env.LOG_SQL) {
    const v = searchSQL.compile();
    ctx.logger.info(v.text);
  }

  const result = await searchSQL.run(ctx.db);

  const total =
    // In case where nothing returned means that total_count col will not be present.
    result[0] === undefined
      ? 0
      : result[0]?.total_count !== undefined
        ? parseInt(result[0]?.total_count)
        : undefined;

  let resources: Resource<typeof request.fhirVersion, AllResourceTypes>[] =
    result.map(
      (r) =>
        r.resource as unknown as Resource<
          typeof request.fhirVersion,
          AllResourceTypes
        >,
    );

  const includeParam = request.parameters.find(
    (p) => p.name === "_include" && p.type === "result",
  ) as SearchParameterResult | undefined;
  const revIncludeParam = request.parameters.find(
    (p) => p.name === "_revinclude" && p.type === "result",
  ) as SearchParameterResult | undefined;
  if (revIncludeParam) {
    resources = resources.concat(
      await processRevInclude(
        ctx,
        request.fhirVersion,
        revIncludeParam,
        result.map(
          (r) =>
            r.resource as unknown as Resource<
              typeof request.fhirVersion,
              AllResourceTypes
            >,
        ),
      ),
    );
  }
  if (includeParam) {
    resources = resources.concat(
      await processInclude(
        ctx.db,
        ctx,
        request.fhirVersion,
        includeParam,
        result.map(
          (r) =>
            r.resource as unknown as Resource<
              typeof request.fhirVersion,
              AllResourceTypes
            >,
        ),
      ),
    );
  }

  return {
    total,
    resources: resources as Resource<
      Request["fhirVersion"],
      AllResourceTypes
    >[],
  };
}
