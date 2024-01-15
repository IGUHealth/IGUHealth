import * as db from "zapatos/db";
import type * as s from "zapatos/schema";

import { FHIRServerCTX } from "../../../../fhir/context.js";
import { SearchParameterResource } from "../../../utilities/search/parameters.js";

export default function uriClauses(
  _ctx: FHIRServerCTX,
  parameter: SearchParameterResource,
): db.SQLFragment<boolean | null, unknown> {
  return db.conditions.or(
    ...parameter.value.map(
      (value): s.uri_idx.Whereable => ({ value: value.toString() }),
    ),
  );
}
