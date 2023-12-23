import { FHIRServerCTX } from "../../../../ctx/types.js";
import { SearchParameterResource } from "../../../utilities/search/parameters.js";

export type FilterSQLResult = {
  query: string;
  values: unknown[];
};

export type ParameterFilter = (
  ctx: FHIRServerCTX,
  parameter: SearchParameterResource,
  values: unknown[]
) => FilterSQLResult;
