import * as db from "zapatos/db";
import type * as s from "zapatos/schema";

import { FHIRServerCTX } from "../../../../../fhir-context/context.js";
import { SearchParameterResource } from "../../../../utilities/search/parameters.js";

export default function stringClauses(
  _ctx: FHIRServerCTX,
  parameter: SearchParameterResource,
): db.SQLFragment<boolean | null, never> {
  switch (parameter.modifier) {
    case "exact": {
      return db.conditions.or(
        ...parameter.value.map(
          (value): s.string_idx.Whereable => ({ value: value.toString() }),
        ),
      );
    }
    case "contains": {
      return db.conditions.or(
        ...parameter.value.map(
          (value): s.string_idx.Whereable => ({
            value: db.sql`${db.self} ilike ${db.param(`%${value}%`)}`,
          }),
        ),
      );
    }
    default: {
      return db.conditions.or(
        ...parameter.value.map(
          (value): s.string_idx.Whereable => ({
            value: db.sql`${db.self} ilike ${db.param(`${value}%`)}`,
          }),
        ),
      );
    }
  }
}
