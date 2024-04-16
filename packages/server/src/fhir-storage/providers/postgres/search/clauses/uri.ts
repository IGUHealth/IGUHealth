import * as db from "zapatos/db";
import type * as s from "zapatos/schema";

import { FHIRServerCTX } from "../../../../../fhir-context/types.js";
import { SearchParameterResource } from "../../../../utilities/search/parameters.js";

export default function uriClauses(
  _ctx: FHIRServerCTX,
  parameter: SearchParameterResource,
): db.SQLFragment<boolean | null, unknown> {
  return db.conditions.or(
    ...parameter.value.map(
      (value): s.r4_uri_idx.Whereable => ({ value: value.toString() }),
    ),
  );
}
