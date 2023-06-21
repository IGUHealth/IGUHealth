type FHIRSearchQuery = {
  level: "system" | "resource";
  resourceType?: string;
  parameters: SearchParameter<unknown>[];
};

type SearchParameter<T> = {
  name: string;
  value: T | T[];
  modifier?: string;
};

/*
 ** Given a query string create complex FHIR Query object.
 */
export function parseFHIRSearch(base: string, query: string): FHIRSearchQuery {
  const url = new URL(query, base);
  const [_, resourceType] = url.pathname.split("/");
  const fhirSearchQuery: FHIRSearchQuery = {
    level: resourceType ? "resource" : "system",
    parameters: Array.from(url.searchParams.entries()).map(([key, value]) => {
      let [name, modifier] = key.split(":");
      let searchParam = {
        name,
        modifier,
        value,
      };
      if (modifier) searchParam.modifier = modifier;
      return searchParam;
    }),
  };

  if (resourceType) fhirSearchQuery.resourceType = resourceType;
  return fhirSearchQuery;
}
