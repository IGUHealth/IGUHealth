import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { FHIRServerCTX } from "../../../../ctx/types.js";
import { searchParameterToTableName } from "../../../utilities/search/parameters.js";
import { SearchParameterResource } from "../../../types.js";
import dateClauses from "./date.js";
import numberClauses from "./number.js";
import quantityClauses from "./quantity.js";
import referenceClauses from "./reference.js";
import stringClauses from "./string.js";
import tokenClauses from "./token.js";
import uriClauses from "./uri.js";
import { and } from "../../../utilities/sql.js";

const PARAMETER_CLAUSES = {
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
  index: number,
  values: unknown[],
  columns: string[] = ["DISTINCT(r_version_id)"]
): { index: number; query: string; values: unknown[] } {
  const searchParameter = parameter.searchParameter;
  const search_table = searchParameterToTableName(searchParameter.type);

  const rootSelect = `SELECT ${columns.join(
    ", "
  )} FROM ${search_table} WHERE parameter_url = $${index++} `;
  values = [...values, searchParameter.url];

  switch (searchParameter.type) {
    case "number":
    case "string":
    case "uri":
    case "date":
    case "token":
    case "reference":
    case "quantity": {
      const result = PARAMETER_CLAUSES[searchParameter.type](
        ctx,
        parameter,
        values
      );
      index = result.values.length + 1;
      const query = `(${and(
        rootSelect,
        `workspace=$${index++}`,
        result.query
      )})`;

      values = [...result.values, ctx.workspace];
      return {
        index,
        values,
        query,
      };
    }
    default:
      throw new OperationError(
        outcomeError(
          "not-supported",
          `Parameter of type '${searchParameter.type}' is not yet supported.`
        )
      );
  }
}
