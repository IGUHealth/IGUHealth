import * as db from "zapatos/db";
import type * as s from "zapatos/schema";

import { splitParameter } from "@iguhealth/client/url";
import { FHIR_VERSION } from "@iguhealth/fhir-types/versions";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { FHIRServerCTX } from "../../../../../fhir-api/types.js";
import { SearchParameterResource } from "../../../../utilities/search/parameters.js";
import { missingModifier } from "./shared.js";

// /[^\\]\|/g

export default function quantityClauses(
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
        ...parameter.value.map((value) => {
          const parts = splitParameter(value.toString(), "|");
          const clauses: s.r4_quantity_idx.Whereable = {};

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
              clauses["start_value"] = db.sql`${db.self} <= ${db.param(
                parseFloat(value),
              )}`;
              clauses["end_value"] = db.sql`${db.self} >= ${db.param(
                parseFloat(value),
              )}`;
            }
            if (system !== "") {
              clauses["start_system"] = system;
              clauses["end_system"] = system;
            }
            if (code != "") {
              clauses["start_code"] = code;
              clauses["end_code"] = code;
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
