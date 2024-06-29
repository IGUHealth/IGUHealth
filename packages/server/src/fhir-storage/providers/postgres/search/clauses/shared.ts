import * as db from "zapatos/db";
import type * as s from "zapatos/schema";

import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { IGUHealthServerCTX } from "../../../../../fhir-api/types.js";
import { SearchParameterResource } from "../../../../utilities/search/parameters.js";

export type SEARCH_INDEX_WHEREABLE =
  | s.r4_date_idx.Whereable
  | s.r4_quantity_idx.Whereable
  | s.r4_reference_idx.Whereable
  | SEARCH_INDEX_VALUE_BASED;

export type SEARCH_INDEX_VALUE_BASED =
  | s.r4_string_idx.Whereable
  | s.r4_number_idx.Whereable
  | s.r4_token_idx.Whereable
  | s.r4_uri_idx.Whereable;

export function missingModifier(
  _ctx: IGUHealthServerCTX,
  parameter: SearchParameterResource,
): db.SQLFragment<boolean | null, unknown> {
  return db.conditions.or(
    ...parameter.value.map((value): SEARCH_INDEX_WHEREABLE => {
      if (value !== "true" && value !== "false") {
        throw new OperationError(
          outcomeError(
            "invalid",
            `Invalid value for modifier 'missing' must be 'true' or 'false'`,
          ),
        );
      }
      if (value === "true") {
        throw new OperationError(
          outcomeError(
            "not-supported",
            "For modifier 'missing' value of 'true' is not yet supported",
          ),
        );
      }
      switch (parameter.searchParameter.type) {
        case "string":
        case "number":
        case "token":
        case "uri": {
          const where: SEARCH_INDEX_VALUE_BASED = {
            value: db.sql`${db.self} IS NOT NULL` as db.SQLFragment,
          };
          return where;
        }

        case "date": {
          const where: s.r4_date_idx.Whereable = {
            start_date: db.sql`${db.self} IS NOT NULL` as db.SQLFragment,
            end_date: db.sql`${db.self} IS NOT NULL` as db.SQLFragment,
          };
          return where;
        }

        case "reference": {
          const where: s.r4_reference_idx.Whereable = {
            reference_id: db.sql`${db.self} IS NOT NULL` as db.SQLFragment,
          };
          return where;
        }
        case "quantity": {
          const where: s.r4_quantity_idx.Whereable = {
            start_value: db.sql`${db.self} IS NOT NULL` as db.SQLFragment,
          };
          return where;
        }
        default:
          throw new OperationError(
            outcomeError(
              "not-supported",
              `Parameter of type '${parameter.searchParameter.type}' is not yet supported for missing modifier.`,
            ),
          );
      }
    }),
  );
}
