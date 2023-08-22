import { SearchParameter, ResourceType } from "@iguhealth/fhir-types";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { FHIRServerCTX } from "../../../fhirServer.js";
import { searchResources, searchParameterToTableName } from "../utilities.js";
import { param_types_supported } from "../constants.js";
import type { SearchParameterResult } from "./types.js";

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
}

export async function deriveSortQuery(
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
      const table = searchParameterToTableName(parameter.type);
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
