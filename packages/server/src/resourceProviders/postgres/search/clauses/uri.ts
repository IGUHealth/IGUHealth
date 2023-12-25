import { FHIRServerCTX } from "../../../../ctx/types.js";
import * as db from "zapatos/db";
import type * as s from "zapatos/schema";

import { or } from "../../../utilities/sql.js";
import { SearchParameterResource } from "../../../utilities/search/parameters.js";
import { FilterSQLResult } from "./types.js";

const value = "5";

const authors = await db.sql<s.uri_idx.SQL, s.uri_idx.Selectable[]>`
  ${"value"} = ${db.vals(value)}`.compile();

console.log(authors);

export default function uriClauses(
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
