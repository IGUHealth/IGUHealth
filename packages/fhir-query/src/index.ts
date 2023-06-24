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
export default function parseURL(url: string): FHIRURL {
  const [path, queryParams] = url.split("?");
  console.log(path, queryParams, url);
  const [resourceType, id, versionId] = path.split("/");
  const fhirURL: FHIRURL = {
    parameters: !queryParams
      ? []
      : queryParams
          .split("&")
          .map((param) => param.split("="))
          .reduce(
            (
              parameters,
              [key, value]
            ): Record<string, ParsedParameter<unknown>> => {
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
