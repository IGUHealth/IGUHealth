export type FHIRURL = {
  resourceType?: string;
  id?: string;
  versionId?: string;
  parameters: Record<string, ParsedParameter<unknown>>;
};

export type ParsedParameter<T> = {
  name: string;
  value: T | T[];
  modifier?: string;
};

/*
 ** Given a query string create complex FHIR Query object.
 */
export default function parseURL(url: URL): FHIRURL {
  console.log(url.pathname, Array.from(url.searchParams.entries()));
  const [_, resourceType, id, versionId] = url.pathname.split("/");
  const fhirURL: FHIRURL = {
    parameters: Array.from(url.searchParams.entries()).reduce(
      (parameters, [key, value]): Record<string, ParsedParameter<unknown>> => {
        let [name, modifier] = key.split(":");
        let searchParam = {
          name,
          modifier,
          value,
        };
        if (modifier) searchParam.modifier = modifier;
        return { ...parameters, [searchParam.name]: searchParam };
      },
      {}
    ),
  };
  if (resourceType) fhirURL.resourceType = resourceType;
  if (id) fhirURL.id = id;
  if (versionId) fhirURL.versionId = versionId;

  return fhirURL;
}
