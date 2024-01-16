import * as db from "zapatos/db";
import type * as s from "zapatos/schema";

import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { FHIRServerCTX } from "../../../../fhir/context.js";
import {
  SearchParameterResource,
  searchParameterToTableName,
} from "../../../utilities/search/parameters.js";
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

export function buildParameterSQL(
  ctx: FHIRServerCTX,
  parameter: SearchParameterResource,
  columns: s.Column[] = [],
): db.SQLFragment {
  const searchParameter = parameter.searchParameter;
  const search_table = searchParameterToTableName(searchParameter.type);

  switch (searchParameter.type) {
    case "number":
    case "string":
    case "uri":
    case "date":
    case "token":
    case "reference":
    case "quantity": {
      return db.sql<
        | s.number_idx.SQL
        | s.string_idx.SQL
        | s.uri_idx.SQL
        | s.date_idx.SQL
        | s.token_idx.SQL
        | s.reference_idx.SQL
        | s.quantity_idx.SQL
      >`
      SELECT ${
        columns.length === 0
          ? db.raw("DISTINCT(r_version_id)")
          : db.cols(columns)
      } 
      FROM ${search_table} 
      WHERE ${db.conditions.and(
        { parameter_url: searchParameter.url, tenant: ctx.tenant },
        PARAMETER_CLAUSES[searchParameter.type](ctx, parameter),
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
