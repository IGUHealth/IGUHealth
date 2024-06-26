import dayjs from "dayjs";
import * as db from "zapatos/db";
import type * as s from "zapatos/schema";

import { date, dateTime } from "@iguhealth/fhir-types/r4/types";
import { FHIR_VERSION } from "@iguhealth/fhir-types/versions";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { FHIRServerCTX } from "../../../../../fhir-api/types.js";
import {
  SearchParameterResource,
  getDatePrecision,
  parseValuePrefix,
} from "../../../../utilities/search/parameters.js";
import { missingModifier } from "./shared.js";

function getValueRange(value: string): [string, string] {
  // yyyy-mm-ddThh:mm:ss[Z|(+|-)hh:mm]
  const formattedDate = dayjs(value, "YYYY-MM-DDThh:mm:ssZ");
  const precision = getDatePrecision(value as dateTime | date);

  switch (precision) {
    case "year":
    case "month":
    case "day":
    case "hour":
    case "minute":
    case "second": {
      return [
        dayjs(formattedDate).startOf(precision).toISOString(),
        dayjs(formattedDate).endOf(precision).toISOString(),
      ];
    }
  }
}

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
            const [startValueRange, endValueRange] = getValueRange(value);

            switch (prefix) {
              case "eq":
              case undefined: {
                return {
                  start_date: db.sql`${db.self} <= ${db.param(endValueRange)}`,
                  end_date: db.sql`${db.self} >= ${db.param(startValueRange)}`,
                };
              }
              case "ne": {
                return db.sql<s.r4_date_idx.SQL | s.r4b_date_idx.SQL>`
              ${"start_date"} > ${db.param(endValueRange)} OR
              ${"end_date"}   < ${db.param(startValueRange)}`;
              }

              case "gt": {
                return db.sql<s.r4_date_idx.SQL | s.r4b_date_idx.SQL>`
                ${"end_date"} > ${db.param(endValueRange)}`;
              }

              case "lt": {
                return db.sql<s.r4_date_idx.SQL | s.r4b_date_idx.SQL>`
                ${"start_date"} < ${db.param(startValueRange)}`;
              }

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
