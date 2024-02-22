import dayjs from "dayjs";
import * as db from "zapatos/db";
import type * as s from "zapatos/schema";

import { FHIRServerCTX } from "../../../../../fhir-context/types.js";
import { SearchParameterResource } from "../../../../utilities/search/parameters.js";

export default function dateClauses(
  _ctx: FHIRServerCTX,
  parameter: SearchParameterResource,
): db.SQLFragment<boolean | null, unknown> {
  return db.conditions.or(
    ...parameter.value.map((value): s.date_idx.Whereable => {
      const formattedDate = dayjs(
        value,
        "YYYY-MM-DDThh:mm:ss+zz:zz",
      ).toISOString();
      return {
        start_date: db.sql`${db.self} <= ${db.param(formattedDate)}`,
        end_date: db.sql`${db.self} >= ${db.param(formattedDate)}`,
      };
    }),
  );
}
