import { FHIRServerCTX } from "../../../../ctx/types.js";
import { or } from "../../../utilities/sql.js";
import { SearchParameterResource } from "../../../utilities/search/parameters.js";
import { FilterSQLResult } from "./types.js";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

function missingModifier(
  _ctx: FHIRServerCTX,
  parameter: SearchParameterResource,
  values: unknown[]
): FilterSQLResult {
  return parameter.value.reduce(
    (sql: FilterSQLResult, value) => {
      if (value !== "true" && value !== "false") {
        throw new OperationError(
          outcomeError(
            "invalid",
            `Invalid value for modifier 'missing' must be 'true' or 'false'`
          )
        );
      }
      if (value === "true") {
        throw new OperationError(
          outcomeError(
            "not-supported",
            "For modifier 'missing' value of 'true' is not yet supported"
          )
        );
      }
      // Currently only supporting false for now. (which means value must exist)
      return {
        query: or(sql.query, `value IS NOT NULL`),
        values: sql.values,
      };
    },
    { query: "", values }
  );
}

export default function tokenClauses(
  ctx: FHIRServerCTX,
  parameter: SearchParameterResource,
  values: unknown[]
): FilterSQLResult {
  switch (parameter.modifier) {
    case "missing":
      return missingModifier(ctx, parameter, values);
    default: {
      let index = values.length + 1;
      return parameter.value.reduce(
        (sql: FilterSQLResult, value) => {
          const parts = value.toString().split("|");
          if (parts.length === 1) {
            return {
              query: or(sql.query, `value = $${index++}`),
              values: [...values, value],
            };
          }
          if (parts.length === 2) {
            if (parts[0] !== "" && parts[1] !== "") {
              return {
                query: or(
                  sql.query,
                  `system = $${index++} AND value = $${index++}`
                ),
                values: [...values, parts[0], parts[1]],
              };
            } else if (parts[0] !== "" && parts[1] === "") {
              return {
                query: or(sql.query, `system = $${index++}`),
                values: [...values, parts[0]],
              };
            } else if (parts[0] === "" && parts[1] !== "") {
              return {
                query: or(sql.query, `value = $${index++}`),
                values: [...values, parts[1]],
              };
            }
          }
          throw new Error(`Invalid token value found '${value}'`);
        },
        { query: "", values }
      );
    }
  }
}
