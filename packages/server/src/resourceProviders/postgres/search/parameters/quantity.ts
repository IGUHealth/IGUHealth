import dayjs from "dayjs";

import { FHIRServerCTX } from "../../../../ctx/types.js";
import { and, or } from "../../../utilities/sql.js";
import { SearchParameterResource } from "../types.js";
import { FilterSQLResult } from "./types.js";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

export default function quantityClauses(
  _ctx: FHIRServerCTX,
  parameter: SearchParameterResource,
  values: unknown[]
): FilterSQLResult {
  return parameter.value.reduce(
    (sql: FilterSQLResult, value) => {
      const parts = value.toString().split("|");

      if (parts.length === 4) {
        throw new OperationError(
          outcomeError(
            "not-supported",
            `prefix not supported yet for parameter '${parameter.searchParameter.name}' and value '${value}'`
          )
        );
      }

      let index = sql.values.length + 1;

      if (parts.length === 3) {
        const [value, system, code] = parts;
        let clauses: string[] = [];
        let values = sql.values;

        if (value !== "") {
          values = [...values, value, value];
          clauses = [
            ...clauses,
            `start_value <= $${index++}`,
            `end_value >= $${index++}`,
          ];
        }
        if (system !== "") {
          values = [...values, system, system];
          clauses = [
            ...clauses,
            `start_system = $${index++}`,
            `end_system = $${index++}`,
          ];
        }
        if (code != "") {
          values = [...values, code, code];
          clauses = [
            ...clauses,
            `start_code = $${index++}`,
            `end_code = $${index++}`,
          ];
        }

        return {
          query: or(sql.query, and(...clauses)),
          values,
        };
      } else {
        throw new OperationError(
          outcomeError(
            "invalid",
            "Quantity search parameters must be specified as value|system|code"
          )
        );
      }
    },
    { query: "", values }
  );
}
