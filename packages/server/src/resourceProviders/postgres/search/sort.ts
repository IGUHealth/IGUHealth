import * as db from "zapatos/db";
import type * as s from "zapatos/schema";

import { ResourceType, SearchParameter } from "@iguhealth/fhir-types/r4/types";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { FHIRServerCTX, asSystemCTX } from "../../../fhir/context.js";
import {
  SearchParameterResult,
  searchParameterToTableName,
  searchResources,
} from "../../utilities/search/parameters.js";
import { param_types_supported } from "../constants.js";

type SORT_DIRECTION = "ascending" | "descending";

function getParameterSortColumn(
  direction: SORT_DIRECTION,
  parameter: SearchParameter,
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

export async function deriveSortQuery(
  ctx: FHIRServerCTX,
  resourceTypes: ResourceType[],
  sortParameter: SearchParameterResult,
  query: db.SQLFragment,
): Promise<db.SQLFragment> {
  const sortInformation = await Promise.all(
    sortParameter.value.map(
      async (
        paramName,
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
          asSystemCTX(ctx),
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
      const table = searchParameterToTableName(parameter.type);
      const sort_column_name = getSortColumn(sortOrder);
      const column_name = db.raw(getParameterSortColumn(direction, parameter));
      return db.sql` LEFT JOIN 
        (SELECT ${"r_id"}, MIN(${column_name}) AS ${sort_column_name} FROM ${table} 
          WHERE ${"tenant"}=${db.param(ctx.tenant.id)} AND
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
