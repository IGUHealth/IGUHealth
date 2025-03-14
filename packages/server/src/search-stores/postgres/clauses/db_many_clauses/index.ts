import * as db from "zapatos/db";
import type * as s from "zapatos/schema";

import { SearchParameterResource } from "@iguhealth/client/lib/url";
import { FHIR_VERSION } from "@iguhealth/fhir-types/versions";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { IGUHealthServerCTX } from "../../../../fhir-server/types.js";
import { isSearchTableType } from "../../../constants.js";
import { searchParameterToTableName } from "../../../parameters.js";
import { intersect } from "../../../sql.js";
import dateClauses from "./date.js";
import numberClauses from "./number.js";
import quantityClauses from "./quantity.js";
import referenceClauses from "./reference.js";
import stringClauses from "./string.js";
import tokenClauses from "./token.js";
import uriClauses from "./uri.js";

const PARAMETER_CLAUSES: Record<
  string,
  <Version extends FHIR_VERSION>(
    ctx: IGUHealthServerCTX,
    fhirVersion: Version,
    parameter: SearchParameterResource<Version>,
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

export function buildClausesManySQL<Version extends FHIR_VERSION>(
  ctx: IGUHealthServerCTX,
  fhirVersion: Version,
  parameters: SearchParameterResource<Version>[],
  columns: s.Column[] = [],
): db.SQLFragment | undefined {
  if (parameters.length === 0) {
    return undefined;
  }

  const selects: db.SQLFragment[] = [];

  const parameterType = parameters[0].searchParameter.type as string;

  if (!isSearchTableType(parameterType)) {
    throw new OperationError(
      outcomeError(
        "not-supported",
        `Parameter of type '${parameterType}' is not yet supported.`,
      ),
    );
  }

  const search_table = searchParameterToTableName(fhirVersion, parameterType);

  for (const parameter of parameters) {
    const searchParameter = parameter.searchParameter;

    const condition = db.conditions.and(
      { tenant: ctx.tenant, parameter_url: searchParameter.url },
      PARAMETER_CLAUSES[searchParameter.type](ctx, fhirVersion, parameter),
    );

    selects.push(db.sql<
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
      WHERE ${condition}
      `);
  }

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
  >`SELECT ${
    columns.length === 0 ? db.raw("DISTINCT(r_version_id)") : db.cols(columns)
  } 
  FROM (${intersect(selects)})`;
}
