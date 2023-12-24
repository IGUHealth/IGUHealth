import { SearchParameter, code } from "@iguhealth/fhir-types/r4/types";

import { FHIRServerCTX } from "../../../../ctx/types.js";
import {
  SearchParameterResource,
  searchParameterToTableName,
} from "../../../utilities/search/parameters.js";
import { FilterSQLResult } from "./types.js";
import { buildParameterSQL } from "./index.js";
import { or } from "../../../utilities/sql.js";

/*
 ** This function allows resolution based on canonical references.
 ** Performs a search on the uri table to find the reference_id for the canonical reference.
 */
function generateCanonicalReferenceSearch(
  ctx: FHIRServerCTX,
  parameter: SearchParameterResource,
  values: unknown[]
): FilterSQLResult {
  let index = values.length + 1;
  const uriTablename = searchParameterToTableName("uri" as code);
  const targets = `(${(parameter.searchParameter.target || [])
    .map((target) => {
      values = [...values, target];
      return `$${index++}`;
    })
    .join(",")})`;
  return {
    query: `(SELECT DISTINCT ON (r_id) r_id FROM ${uriTablename} WHERE resource_type in ${targets} AND workspace=$${index++} AND value = $${index++})`,
    values: [...values, ctx.workspace, parameter.value[0]],
  };
}

function isChainParameter(
  parameter: SearchParameterResource
): parameter is SearchParameterResource & {
  chainedParameters: SearchParameter[][];
} {
  if (parameter.chainedParameters && parameter.chainedParameters.length > 0)
    return true;
  return false;
}

function chainSQL(
  ctx: FHIRServerCTX,
  parameter: SearchParameterResource & {
    chainedParameters: SearchParameter[][];
  },
  values: unknown[],
  index: number
): FilterSQLResult {
  const referenceParameters = [
    [parameter.searchParameter],
    ...parameter.chainedParameters.slice(0, -1),
  ];

  const sqlCHAIN = referenceParameters.reduce(
    (
      {
        index,
        values,
        query,
      }: { index: number; values: unknown[]; query: string[] },
      parameters
    ) => {
      const res = parameters.reduce(
        (
          {
            index,
            values,
            query,
          }: { index: number; values: unknown[]; query: string[] },
          p
        ) => {
          const res = buildParameterSQL(
            ctx,
            {
              type: "resource",
              name: p.name,
              searchParameter: p,
              value: [],
            },
            index,
            values,
            ["r_id", "reference_id"]
          );
          return {
            index: res.index,
            values: res.values,
            query: [...query, res.query],
          };
        },
        { index, values, query: [] }
      );
      return {
        index: res.index,
        values: res.values,
        query: [...query, `(${res.query.join(" UNION ")})`],
      };
    },
    { index, values, query: [] }
  );

  index = sqlCHAIN.index;
  values = sqlCHAIN.values;

  const lastParameters =
    parameter.chainedParameters[parameter.chainedParameters.length - 1];

  const lastResult = lastParameters.reduce(
    (
      {
        index,
        values,
        query,
      }: { index: number; values: unknown[]; query: string[] },
      p
    ) => {
      const res = buildParameterSQL(
        ctx,
        { ...parameter, searchParameter: p, chainedParameters: [] },
        index,
        values,
        ["r_id"]
      );
      return {
        index: res.index,
        values: res.values,
        query: [...query, res.query],
      };
    },
    { index, values, query: [] }
  );

  const referencesSQL = [
    ...sqlCHAIN.query,
    `(${lastResult.query.join(" UNION ")})`,
  ]
    // Reverse as we want to start from initial value and then chain up to the last reference ID.
    .reverse()
    .reduce((previousResult: string, query: string, index: number) => {
      const queryAlias = `query${index}`;
      // Previous result should include the list of ids for next reference_id.
      // Starting at the value this would be r_id
      return `(select r_id from ${query} as ${queryAlias} where ${queryAlias}.reference_id in ${previousResult})`;
    });

  return {
    query: `r_id in (select r_id from ${referencesSQL} as referencechain)`,
    values: lastResult.values,
  };
}

function sqlParameterValue(
  ctx: FHIRServerCTX,
  sql: FilterSQLResult,
  parameter: SearchParameterResource,
  parameterValue: string | number
) {
  const canonicalSQL = generateCanonicalReferenceSearch(
    ctx,
    parameter,
    sql.values
  );

  const referenceSQL = or(sql.query, `reference_id in ${canonicalSQL.query}`);

  const referenceValue = parameterValue.toString();
  const parts = referenceValue.split("/");

  if (parts.length === 1) {
    return {
      query: `${referenceSQL} OR reference_id = $${
        canonicalSQL.values.length + 1
      }`,
      values: [...canonicalSQL.values, parts[0]],
    };
  } else if (parts.length === 2) {
    return {
      query: `${referenceSQL} OR (reference_type = $${
        canonicalSQL.values.length + 1
      } AND reference_id = $${canonicalSQL.values.length + 2})`,
      values: [...canonicalSQL.values, parts[0], parts[1]],
    };
  } else {
    return {
      query: referenceSQL,
      values: canonicalSQL.values,
    };
  }
}

export default function referenceClauses(
  ctx: FHIRServerCTX,
  parameter: SearchParameterResource,
  values: unknown[]
): FilterSQLResult {
  const index = values.length + 1;

  if (isChainParameter(parameter))
    return chainSQL(ctx, parameter, values, index);
  else {
    return parameter.value.reduce(
      (sql: FilterSQLResult, value, i): FilterSQLResult =>
        sqlParameterValue(ctx, sql, parameter, value),
      { values, query: "" }
    );
  }
}
