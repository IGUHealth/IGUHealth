type SUPPORTED_SEARCH_TYPES =
  | "number"
  | "date"
  | "string"
  | "token"
  | "reference"
  | "quantity"
  | "uri";

// Composite,  Special
export const param_types_supported: SUPPORTED_SEARCH_TYPES[] = [
  "quantity",
  "date",
  "string",
  "number",
  "token",
  "uri",
  "reference",
];

// | "composite"
// | "special";

export function isSupportedSearchType(
  type: string,
): type is SUPPORTED_SEARCH_TYPES {
  return param_types_supported.includes(type as SUPPORTED_SEARCH_TYPES);
}
