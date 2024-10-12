import * as db from "zapatos/db";
import type * as s from "zapatos/schema";

import { splitParameter } from "@iguhealth/client/url";
import { FHIR_VERSION } from "@iguhealth/fhir-types/versions";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { IGUHealthServerCTX } from "../../../../../../fhir-api/types.js";
import { SearchParameterResource } from "../../../../../utilities/search/parameters.js";
import { getColumn, missingModifier } from "./shared.js";

export default function quantityClauses(
  _ctx: IGUHealthServerCTX,
  fhirVersion: FHIR_VERSION,
  parameter: SearchParameterResource,
): db.SQLFragment<boolean | null, unknown> {
  const columnName = getColumn(
    fhirVersion,
    "quantity",
    parameter.searchParameter.url,
  );

  switch (parameter.modifier) {
    case "missing": {
      return missingModifier(fhirVersion, parameter);
    }
    default: {
      return db.conditions.or(
        ...parameter.value.map((value) => {
          const parts = splitParameter(value.toString(), "|");
          const clauses: s.r4_sp1_idx.Whereable | s.r4b_sp1_idx.Whereable = {};

          if (parts.length === 4) {
            throw new OperationError(
              outcomeError(
                "not-supported",
                `prefix not supported yet for parameter '${parameter.searchParameter.name}' and value '${value}'`,
              ),
            );
          }

          if (parts.length === 3) {
            const [value, system, code] = parts;

            if (value !== "") {
              if (isNaN(parseFloat(value))) {
                throw new OperationError(
                  outcomeError(
                    "invalid",
                    `Invalid value for parameter '${parameter.searchParameter.name}' and value '${value}'`,
                  ),
                );
              }
              clauses[`${columnName}_start_value`] =
                db.sql`${db.self} <= ${db.param(parseFloat(value))}`;
              clauses[`${columnName}_end_value`] =
                db.sql`${db.self} >= ${db.param(parseFloat(value))}`;
            }
            if (system !== "") {
              clauses[`${columnName}_start_system`] = system;
              clauses[`${columnName}_end_system`] = system;
            }
            if (code != "") {
              clauses[`${columnName}_start_code`] = code;
              clauses[`${columnName}_end_code`] = code;
            }

            return clauses;
          } else {
            throw new OperationError(
              outcomeError(
                "invalid",
                "Quantity search parameters must be specified as value|system|code",
              ),
            );
          }
        }),
      );
    }
  }
}
