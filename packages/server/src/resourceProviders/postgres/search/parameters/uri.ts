import { FHIRServerCTX } from "../../../../ctx/types.js";
import { or } from "../../../utilities/sql.js";
import { SearchParameterResource } from "../types.js";
import { FilterSQLResult } from "./types.js";

export default function uriParameter(
  _ctx: FHIRServerCTX,
  parameter: SearchParameterResource,
  values: unknown[]
): FilterSQLResult {
  let index = values.length + 1;
  return {
    query: or(...parameter.value.map((_value) => `value = $${index++}`)),
    values: [...values, ...parameter.value],
  };
}
