import { ParsedParameter } from "@iguhealth/client/lib/url.js";
import { SearchParameter } from "@iguhealth/fhir-types";

export type SearchParameterResource = ParsedParameter<string | number> & {
  type: "resource";
  searchParameter: SearchParameter;
  chainedParameters?: SearchParameter[][];
};

export type SearchParameterResult = ParsedParameter<string | number> & {
  type: "result";
};

export type ParameterType = SearchParameterResource | SearchParameterResult;
