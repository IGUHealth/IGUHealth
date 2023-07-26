export type ParsedParameter<T> = {
  name: string;
  value: T[];
  modifier?: string;
};

/*
 ** Given a query string create complex FHIR Query object.
 */
export default function parseParameters(
  url: string
): ParsedParameter<string | number>[] {
  const [_, queryParams] = url.split("?");
  const parameters = !queryParams
    ? {}
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
        );

  return Object.values(parameters);
}
