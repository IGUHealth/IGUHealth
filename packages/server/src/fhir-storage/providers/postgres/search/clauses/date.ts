import dayjs from "dayjs";
import * as db from "zapatos/db";
import type * as s from "zapatos/schema";

import { FHIR_VERSION } from "@iguhealth/fhir-types/versions";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { FHIRServerCTX } from "../../../../../fhir-api/types.js";
import {
  SearchParameterResource,
  parseValuePrefix,
} from "../../../../utilities/search/parameters.js";
import { missingModifier } from "./shared.js";

export default function dateClauses(
  _ctx: FHIRServerCTX,
  fhirVersion: FHIR_VERSION,
  parameter: SearchParameterResource,
): db.SQLFragment<boolean | null, unknown> {
  switch (parameter.modifier) {
    case "missing": {
      return missingModifier(_ctx, parameter);
    }
    default: {
      return db.conditions.or(
        ...parameter.value.map(
          (parameterValue): s.r4_date_idx.Whereable | db.SQLFragment => {
            const { prefix, value } = parseValuePrefix(parameterValue);
            const formattedDate = db.param(
              dayjs(value, "YYYY-MM-DDThh:mm:ss+zz:zz").toISOString(),
            );

            switch (prefix) {
              case "eq":
              case undefined: {
                return {
                  start_date: db.sql`${db.self} <= ${formattedDate}`,
                  end_date: db.sql`${db.self} >= ${formattedDate}`,
                };
              }
              case "ne": {
                return db.sql<s.r4_date_idx.SQL | s.r4b_date_idx.SQL>`
              ${"start_date"} > ${formattedDate} OR
              ${"end_date"}   < ${formattedDate}`;
              }

              // case "gt": {
              //   return db.sql<s.r4_date_idx.SQL | s.r4b_date_idx.SQL>`
              //   `;
              // }

              default: {
                throw new OperationError(
                  outcomeError(
                    "not-supported",
                    `Prefix ${prefix} not supported for parameter '${parameter.searchParameter.name}' and value '${parameterValue}'`,
                  ),
                );
              }
            }
          },
        ),
      );
    }
  }
}
