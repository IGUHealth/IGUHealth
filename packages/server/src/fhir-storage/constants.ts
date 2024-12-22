type SEARCH_TYPES_SUPPORTED = SEARCH_TABLE_TYPES | "composite";

export type SEARCH_TABLE_TYPES =
  | "number"
  | "date"
  | "string"
  | "token"
  | "reference"
  | "quantity"
  | "uri";

export const search_table_types: SEARCH_TABLE_TYPES[] = [
  "quantity",
  "date",
  "string",
  "number",
  "token",
  "uri",
  "reference",
];

// composite is a special type that is not a table type.
export const search_types_supported: SEARCH_TYPES_SUPPORTED[] = [
  ...search_table_types,
  "composite",
];

// | "special";

export function isSearchTableType(type: string): type is SEARCH_TABLE_TYPES {
  return search_table_types.includes(type as SEARCH_TABLE_TYPES);
}

export function isSupportedSearchType(
  type: string,
): type is SEARCH_TYPES_SUPPORTED {
  return search_types_supported.includes(type as SEARCH_TYPES_SUPPORTED);
}
