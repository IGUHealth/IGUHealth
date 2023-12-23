import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { FHIRServerCTX } from "../../../../ctx/types.js";
import { or } from "../../../utilities/sql.js";
import {
  SearchParameterResource,
  getDecimalPrecision,
} from "../../../utilities/search/parameters.js";
import { FilterSQLResult } from "./types.js";

export default function numberClauses(
  _ctx: FHIRServerCTX,
  parameter: SearchParameterResource,
  values: unknown[]
): FilterSQLResult {
  return parameter.value.reduce(
    (sql, value) => {
      const result = value
        .toString()
        .match(/^(?<prefix>eq|ne|gt|lt|ge|le|sa|eb|ap)?(?<value>.+)$/);

      if (!result) {
        throw new OperationError(
          outcomeError(
            "invalid",
            `Invalid input value '${parameter.value}' for parameter '${parameter.searchParameter.name}'`
          )
        );
      }
      const numericPortion = result?.groups?.value;
      const prefix = result?.groups?.prefix;

      if (!numericPortion) {
        throw new OperationError(
          outcomeError(
            "invalid",
            `A Number must be provided for parameter '${parameter.searchParameter.name}'`
          )
        );
      }

      const numberValue = parseFloat(numericPortion);
      if (isNaN(numberValue)) {
        throw new OperationError(
          outcomeError(
            "invalid",
            `Invalid number value '${parameter.value}' for parameter '${parameter.searchParameter.name}'`
          )
        );
      }

      const decimalPrecision = getDecimalPrecision(numberValue);
      switch (prefix) {
        // the range of the search value fully contains the range of the target value
        case "eq":
        case undefined: {
          let index = sql.values.length + 1;
          return {
            query: or(
              sql.query,
              `(value - 0.5 * 10 ^ $${index++})  <= $${index++} AND (value + 0.5 * 10 ^ $${index++}) >= $${index++}`
            ),
            values: [
              ...sql.values,
              -decimalPrecision,
              numberValue,
              -decimalPrecision,
              numberValue,
            ],
          };
        }

        // 	the range of the search value does not fully contain the range of the target value
        case "ne": {
          let index = sql.values.length + 1;
          return {
            query: or(
              sql.query,
              `(value - 0.5 * 10 ^ $${index++})  > $${index++} OR (value + 0.5 * 10 ^ $${index++}) < $${index++}`
            ),
            values: [
              ...sql.values,
              -decimalPrecision,
              numberValue,
              -decimalPrecision,
              numberValue,
            ],
          };
        }

        // the range above the search value intersects (i.e. overlaps) with the range of the target value
        case "gt": {
          let index = sql.values.length + 1;
          return {
            query: or(
              sql.query,
              `(value - 0.5 * 10 ^ $${index++}) > $${index++}`
            ),
            values: [...sql.values, -decimalPrecision, numberValue],
          };
        }
        //	the value for the parameter in the resource is less than the provided value
        case "lt": {
          // Start at upperbound to exclude the intersection.
          let index = sql.values.length + 1;
          return {
            query: or(
              sql.query,
              `(value + 0.5 * 10 ^ $${index++}) < $${index++}`
            ),
            values: [...sql.values, -decimalPrecision, numberValue],
          };
        }
        // the range above the search value intersects (i.e. overlaps) with the range of the target value,
        // or the range of the search value fully contains the range of the target value
        case "ge": {
          // Perform search as GT but use >= and start on upperbound.
          let index = sql.values.length + 1;
          return {
            query: or(
              sql.query,
              `(value + 0.5 * 10 ^ $${index++}) >= $${index++}`
            ),
            values: [...sql.values, -decimalPrecision, numberValue],
          };
        }
        case "le": {
          // Perform search as lt but use <= and start on lowerbound
          let index = sql.values.length + 1;
          return {
            query: or(
              sql.query,
              `(value - 0.5 * 10 ^ $${index++}) <= $${index++}`
            ),
            values: [...sql.values, -decimalPrecision, numberValue],
          };
        }
        case "sa":
        case "eb":
        case "ap":
        default:
          throw new OperationError(
            outcomeError(
              "not-supported",
              `Prefix '${prefix}' not supported for parameter '${parameter.searchParameter.name}'`
            )
          );
      }
    },
    { query: "", values }
  );
}
