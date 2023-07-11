import { ResourceType } from "@iguhealth/fhir-types/r4/types";

export type FHIRURL = {
  resourceType?: ResourceType;
  id?: string;
  versionId?: string;
  parameters: Parameters<string | number>;
};

export type ParsedParameter<T> = {
  name: string;
  value: T[];
  modifier?: string;
};

export type Parameters<T> = Record<string, ParsedParameter<T>>;

/*
 ** Given a query string create complex FHIR Query object.
 */
export default function parseURL(url: string): FHIRURL {
  const [path, queryParams] = url.split("?");
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
            ): Record<string, ParsedParameter<string>> => {
              let [name, modifier] = key.split(":");
              let searchParam = {
                name,
                modifier,
                value: value.split(","),
              };
              if (modifier) searchParam.modifier = modifier;
              return { ...parameters, [searchParam.name]: searchParam };
            },
            {}
          ),
  };
  if (resourceType) fhirURL.resourceType = resourceType as ResourceType;
  if (id) fhirURL.id = id;
  if (versionId) fhirURL.versionId = versionId;

  return fhirURL;
}
