import dayjs from "dayjs";

import { FHIRServerCTX } from "../../../../ctx/types.js";
import { or } from "../../../utilities/sql.js";
import { SearchParameterResource } from "../../../types.js";
import { FilterSQLResult } from "./types.js";

export default function dateClauses(
  _ctx: FHIRServerCTX,
  parameter: SearchParameterResource,
  values: unknown[]
): FilterSQLResult {
  return parameter.value.reduce(
    (sql: FilterSQLResult, value) => {
      let index = sql.values.length + 1;
      const formattedDate = dayjs(
        value,
        "YYYY-MM-DDThh:mm:ss+zz:zz"
      ).toISOString();

      // Check the range for date
      return {
        query: or(
          sql.query,
          `start_date <= $${index++} AND end_date >= $${index++}`
        ),
        values: [...sql.values, formattedDate, formattedDate],
      };
    },
    { query: "", values }
  );
}
