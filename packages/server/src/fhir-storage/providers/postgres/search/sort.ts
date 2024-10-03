import * as db from "zapatos/db";
import type * as s from "zapatos/schema";

import {
  FHIR_VERSION,
  Resource,
  ResourceType,
} from "@iguhealth/fhir-types/versions";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { IGUHealthServerCTX, asRoot } from "../../../../fhir-api/types.js";
import {
  SearchParameterResult,
  searchParameterToTableName,
  searchResources,
} from "../../../utilities/search/parameters.js";
import { isSearchTableType, search_table_types } from "../constants.js";

type SORT_DIRECTION = "ascending" | "descending";

function getParameterSortColumn(
  direction: SORT_DIRECTION,
  parameter: Resource<FHIR_VERSION, "SearchParameter">,
): s.Column {
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
}

function getSortColumn(index: number): db.DangerousRawString {
  return db.raw(`sort_${index}`);
}

export async function deriveSortQuery<Version extends FHIR_VERSION>(
  ctx: IGUHealthServerCTX,
  fhirVersion: Version,
  resourceTypes: ResourceType<Version>[],
  sortParameter: SearchParameterResult,
  query: db.SQLFragment,
): Promise<db.SQLFragment> {
  const sortInformation = await Promise.all(
    sortParameter.value.map(
      async (
        paramName,
      ): Promise<{
        direction: SORT_DIRECTION;
        parameter: Resource<Version, "SearchParameter">;
      }> => {
        let direction: SORT_DIRECTION = "ascending";
        if (paramName.toString().startsWith("-")) {
          paramName = paramName.toString().substring(1);
          direction = "descending";
        }
        const searchParameter = await ctx.client.search_type(
          await asRoot(ctx),
          fhirVersion,
          "SearchParameter",
          [
            { name: "code", value: [paramName] },
            {
              name: "type",
              // Don't include composite parameters
              value: search_table_types,
            },
            {
              name: "base",
              value: searchResources(resourceTypes),
            },
          ],
        );
        if (searchParameter.resources.length === 0)
          throw new OperationError(
            outcomeError(
              "not-found",
              `SearchParameter with name '${paramName}' not found.`,
            ),
          );
        return {
          direction,
          parameter: searchParameter.resources[0],
        };
      },
    ),
  );

  const resourceQueryAlias = db.raw("resource_result");

  // Need to create LEFT JOINS on the queries so we can orderby postgres.
  const sortQueries = db.mapWithSeparator(
    sortInformation.map(({ direction, parameter }, sortOrder: number) => {
      const parameterType = parameter.type as string;
      if (!isSearchTableType(parameterType)) {
        throw new OperationError(
          outcomeError(
            "not-supported",
            `Parameter of type '${parameter.type}' is not yet supported.`,
          ),
        );
      }
      const table = searchParameterToTableName(fhirVersion, parameterType);
      const sort_column_name = getSortColumn(sortOrder);
      const column_name = db.raw(getParameterSortColumn(direction, parameter));
      return db.sql` LEFT JOIN 
        (SELECT ${"r_id"}, MIN(${column_name}) AS ${sort_column_name} FROM ${table} 
          WHERE ${"tenant"}=${db.param(ctx.tenant)} AND
          parameter_url=${db.param(parameter.url)} GROUP BY ${"r_id"}
        )
        AS ${sort_column_name} 
        ON ${sort_column_name}.r_id = ${resourceQueryAlias}.id`;
    }),
    db.sql` `,
    (c) => c,
  );

  return db.sql`
    SELECT * FROM (
      (${query}) as ${resourceQueryAlias} ${sortQueries}
    )
    ORDER BY ${db.mapWithSeparator(
      sortInformation.map(
        ({ direction }, i) =>
          db.sql`${getSortColumn(i)} ${db.raw(
            direction === "ascending" ? "ASC" : "DESC",
          )} `,
      ),
      db.sql`, `,
      (c) => c,
    )}`;
}
