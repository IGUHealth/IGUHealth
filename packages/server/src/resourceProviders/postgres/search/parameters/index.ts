import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { FHIRServerCTX } from "../../../../ctx/types.js";
import { searchParameterToTableName } from "../../../utilities/search/parameters.js";
import { SearchParameterResource } from "../types.js";
import dateParameter from "./date.js";
import numberParameter from "./number.js";
import quantityParameter from "./quantity.js";
import referenceParameter from "./reference.js";
import stringParameter from "./string.js";
import tokenParameter from "./token.js";
import uriParameter from "./uri.js";

const PARAMETER_FILTERS = {
  token: tokenParameter,
  date: dateParameter,
  uri: uriParameter,
  string: stringParameter,
  number: numberParameter,
  quantity: quantityParameter,
  reference: referenceParameter,
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
      const result = PARAMETER_FILTERS[searchParameter.type](
        ctx,
        parameter,
        values
      );
      index = result.values.length + 1;
      const query = `(${rootSelect} AND workspace=$${index++} AND ${
        result.query
      })`;

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
