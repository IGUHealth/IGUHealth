import * as db from "zapatos/db";
import type * as s from "zapatos/schema";

import {
  FHIR_VERSION,
  Resource,
  ResourceType,
} from "@iguhealth/fhir-types/versions";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { getSp1Name } from "../../../cli/generate/sp1-parameters.js";
import { IGUHealthServerCTX, asRoot } from "../../../fhir-api/types.js";
import { isSearchTableType, search_table_types } from "../../constants.js";
import {
  SearchParameterResult,
  searchParameterToTableName,
  searchResources,
} from "../../utilities/search/parameters.js";
import { getSp1Column } from "./clauses/db_singular_clauses/shared.js";
import { isSearchParameterInSingularTable } from "./utilities.js";

type SORT_DIRECTION = "ascending" | "descending";

function getParameterManySortColumn(
  direction: SORT_DIRECTION,
  parameter: Resource<FHIR_VERSION, "SearchParameter">,
):
  | s.r4b_number_idx.Column
  | s.r4b_uri_idx.Column
  | s.r4b_string_idx.Column
  | s.r4b_token_idx.Column
  | s.r4b_date_idx.Column
  | s.r4b_quantity_idx.Column
  | s.r4b_reference_idx.Column
  | s.r4_number_idx.Column
  | s.r4_uri_idx.Column
  | s.r4_string_idx.Column
  | s.r4_token_idx.Column
  | s.r4_date_idx.Column
  | s.r4_quantity_idx.Column
  | s.r4_reference_idx.Column {
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

function getParameterSingularSortColumn(
  fhirVersion: FHIR_VERSION,
  direction: SORT_DIRECTION,
  parameter: Resource<FHIR_VERSION, "SearchParameter">,
): s.r4_sp1_idx.Column | s.r4b_sp1_idx.Column {
  const type = parameter.type;
  switch (type) {
    case "uri":
    case "string":
    case "number": {
      return getSp1Column(
        fhirVersion,
        type as "string" | "number" | "uri",
        parameter.url,
      );
    }
    case "token": {
      const column = getSp1Column(fhirVersion, "token", parameter.url);
      return `${column}_value`;
    }
    case "date": {
      const column = getSp1Column(fhirVersion, "date", parameter.url);
      return direction === "ascending" ? `${column}_end` : `${column}_start`;
    }
    case "quantity": {
      const column = getSp1Column(fhirVersion, "quantity", parameter.url);
      return direction === "ascending"
        ? `${column}_end_value`
        : `${column}_start_value`;
    }
    default: {
      throw new OperationError(
        outcomeError(
          "not-supported",
          `Parameter of type '${parameter.type}' is not supported for singular parameters.`,
        ),
      );
    }
  }
}

function getSortColumn(index: number): db.DangerousRawString {
  return db.raw(`sort_${index}`);
}

/**
 * Join on the singular table for sorting with aliases
 * @param resourceTableIdentifier Resoure table identifier used for left join.
 * @param fhirVersion The fhir version of the request.
 * @param singularSortColumns The singular columns that are used with their aliases.
 * @returns SQL fragment for joining on the singular table for sorting.
 */
function singularSortColumnsToSQL<Version extends FHIR_VERSION>(
  ctx: IGUHealthServerCTX,
  resourceTableIdentifier: db.DangerousRawString,
  fhirVersion: Version,
  singularSortColumns: {
    column: s.r4_sp1_idx.Column | s.r4b_sp1_idx.Column;
    as: db.DangerousRawString;
  }[],
): db.SQLFragment | undefined {
  if (singularSortColumns.length > 0) {
    const tableName = getSp1Name(fhirVersion);
    const sortColumns = [
      ...singularSortColumns.map(
        ({ column, as }) =>
          db.sql<s.r4_sp1_idx.SQL | s.r4b_sp1_idx.SQL>`${column} AS ${as}`,
      ),
    ];

    return db.sql<s.r4_sp1_idx.SQL | s.r4b_sp1_idx.SQL>`LEFT JOIN 
    (SELECT ${"r_version_id"}, ${db.mapWithSeparator(sortColumns, db.sql` `, (c) => c)} 
     FROM ${tableName} 
     WHERE ${"tenant"}=${db.param(ctx.tenant)}) as sp1 
    ON sp1.${"r_version_id"} = ${resourceTableIdentifier}.${"r_version_id"}`;
  }

  return undefined;
}

/**
 *
 * @param ctx Server context.
 * @param fhirVersion Fhir verison fo request
 * @param resourceTypes Resource types of request
 * @param sortParameter The sort parameter.
 * @param query The sql fragment to inject sort queries on.
 * @returns
 */
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

  const singularSortColumns: {
    column: s.r4_sp1_idx.Column | s.r4b_sp1_idx.Column;
    as: db.DangerousRawString;
  }[] = [];

  const manySortColumns: db.SQLFragment[] = [];

  for (let sortOrder = 0; sortOrder < sortInformation.length; sortOrder++) {
    const { parameter, direction } = sortInformation[sortOrder];
    if (isSearchParameterInSingularTable(fhirVersion, parameter)) {
      singularSortColumns.push({
        column: getParameterSingularSortColumn(
          fhirVersion,
          direction,
          parameter,
        ),
        as: getSortColumn(sortOrder),
      });
    } else {
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
      const column_name = db.raw(
        getParameterManySortColumn(direction, parameter),
      );

      manySortColumns.push(db.sql` LEFT JOIN 
        (SELECT ${"r_version_id"}, MIN(${column_name}) AS ${sort_column_name} FROM ${table} 
          WHERE ${"tenant"}=${db.param(ctx.tenant)} AND
          parameter_url=${db.param(parameter.url)} GROUP BY ${"r_version_id"}
        )
        AS ${sort_column_name} 
        ON ${sort_column_name}.r_version_id = ${resourceQueryAlias}.${"r_version_id"}`);
    }
  }

  const singular = singularSortColumnsToSQL(
    ctx,
    resourceQueryAlias,
    fhirVersion,
    singularSortColumns,
  );

  return db.sql`
    SELECT * FROM (
      (${query}) as ${resourceQueryAlias} 
      ${singular ?? db.sql``}
      ${db.mapWithSeparator(manySortColumns, db.sql` `, (c) => c)}
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
