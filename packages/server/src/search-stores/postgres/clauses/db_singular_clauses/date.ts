import * as db from "zapatos/db";
import type * as s from "zapatos/schema";

import { SearchParameterResource } from "@iguhealth/client/lib/url";
import { FHIR_VERSION } from "@iguhealth/fhir-types/versions";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { IGUHealthServerCTX } from "../../../../fhir-server/types.js";
import { parseValuePrefix } from "../../../parameters.js";
import { getDateRange } from "../../utilities.js";
import {
  SEARCH_INDEX_WHEREABLE,
  getSp1Column,
  missingModifier,
} from "./shared.js";

export default function dateClauses<Version extends FHIR_VERSION>(
  _ctx: IGUHealthServerCTX,
  fhirVersion: Version,
  parameter: SearchParameterResource<Version>,
): db.SQLFragment<boolean | null, unknown> {
  const columnName = getSp1Column(
    fhirVersion,
    "date",
    parameter.searchParameter.url,
  );

  switch (parameter.modifier) {
    case "missing": {
      return missingModifier(fhirVersion, parameter);
    }
    default: {
      return db.conditions.or(
        ...parameter.value.map(
          (parameterValue): SEARCH_INDEX_WHEREABLE | db.SQLFragment => {
            const { prefix, value } = parseValuePrefix(parameterValue);
            const [startValueRange, endValueRange] = getDateRange(value);

            switch (prefix) {
              // the range of the search value fully contains the range of the target value
              case "eq":
              case undefined: {
                return db.sql<s.r4_sp1_idx.SQL | s.r4b_sp1_idx.SQL>`
                 ${`${columnName}_start`} <= ${db.param(endValueRange)} AND 
                  ${`${columnName}_end`} >= ${db.param(startValueRange)}
                `;
              }

              //	the range of the search value does not fully contain the range of the target value
              case "ne": {
                return db.sql<s.r4_sp1_idx.SQL | s.r4b_sp1_idx.SQL>`
              ${`${columnName}_start`} > ${db.param(endValueRange)} OR
              ${`${columnName}_end`}   < ${db.param(startValueRange)}`;
              }

              // the range above the search value intersects (i.e. overlaps) with the range of the target value
              case "gt": {
                return db.sql<s.r4_sp1_idx.SQL | s.r4b_sp1_idx.SQL>`
                ${`${columnName}_end`} > ${db.param(endValueRange)}`;
              }

              // the range below the search value intersects (i.e. overlaps) with the range of the target value
              case "lt": {
                return db.sql<s.r4_sp1_idx.SQL | s.r4b_sp1_idx.SQL>`
                ${`${columnName}_start`} < ${db.param(startValueRange)}`;
              }

              //	the range above the search value intersects (i.e. overlaps) with the range of the target value,
              // or the range of the search value fully contains the range of the target value
              case "ge": {
                return db.sql<s.r4_sp1_idx.SQL | s.r4b_sp1_idx.SQL>`
                ${`${columnName}_end`} >= ${db.param(startValueRange)}`;
              }

              //the range below the search value intersects (i.e. overlaps) with the range of the target value or the range of the search value fully contains the range of the target value
              case "le": {
                return db.sql<s.r4_sp1_idx.SQL | s.r4b_sp1_idx.SQL>`
                ${`${columnName}_start`} <= ${db.param(endValueRange)}`;
              }

              case "sa":
              case "eb":
              case "ap":
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
