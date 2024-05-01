import * as db from "zapatos/db";
import type * as s from "zapatos/schema";

import { FHIR_VERSION } from "@iguhealth/fhir-types/versions";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { FHIRServerCTX } from "../../../../../fhir-api/types.js";
import {
  SearchParameterResource,
  searchParameterToTableName,
} from "../../../../utilities/search/parameters.js";
import dateClauses from "./date.js";
import numberClauses from "./number.js";
import quantityClauses from "./quantity.js";
import referenceClauses from "./reference.js";
import stringClauses from "./string.js";
import tokenClauses from "./token.js";
import uriClauses from "./uri.js";

const PARAMETER_CLAUSES: Record<
  string,
  (
    ctx: FHIRServerCTX,
    fhirVersion: FHIR_VERSION,
    parameter: SearchParameterResource,
  ) => db.SQLFragment<boolean | null, unknown>
> = {
  token: tokenClauses,
  date: dateClauses,
  uri: uriClauses,
  string: stringClauses,
  number: numberClauses,
  quantity: quantityClauses,
  reference: referenceClauses,
};

export function buildParameterSQL<Version extends FHIR_VERSION>(
  ctx: FHIRServerCTX,
  fhirVersion: Version,
  parameter: SearchParameterResource,
  columns: s.Column[] = [],
): db.SQLFragment {
  const searchParameter = parameter.searchParameter;
  const search_table = searchParameterToTableName(
    fhirVersion,
    searchParameter.type,
  );

  switch (searchParameter.type) {
    case "number":
    case "string":
    case "uri":
    case "date":
    case "token":
    case "reference":
    case "quantity": {
      return db.sql<
        | s.r4_number_idx.SQL
        | s.r4_string_idx.SQL
        | s.r4_uri_idx.SQL
        | s.r4_date_idx.SQL
        | s.r4_token_idx.SQL
        | s.r4_reference_idx.SQL
        | s.r4_quantity_idx.SQL
        | s.r4b_number_idx.SQL
        | s.r4b_string_idx.SQL
        | s.r4b_uri_idx.SQL
        | s.r4b_date_idx.SQL
        | s.r4b_token_idx.SQL
        | s.r4b_reference_idx.SQL
        | s.r4b_quantity_idx.SQL
      >`
      SELECT ${
        columns.length === 0
          ? db.raw("DISTINCT(r_version_id)")
          : db.cols(columns)
      } 
      FROM ${search_table} 
      WHERE ${db.conditions.and(
        { parameter_url: searchParameter.url, tenant: ctx.tenant },
        PARAMETER_CLAUSES[searchParameter.type](ctx, fhirVersion, parameter),
      )}
      `;
    }
    default:
      throw new OperationError(
        outcomeError(
          "not-supported",
          `Parameter of type '${searchParameter.type}' is not yet supported.`,
        ),
      );
  }
}
