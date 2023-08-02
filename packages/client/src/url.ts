export type ParsedParameter<T> = {
  name: string;
  value: T[];
  modifier?: string;
  chains?: string[];
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
            const chains = key.split(".");

            let [name, modifier] = chains[0].split(":");

            let searchParam: ParsedParameter<string | number> = {
              name,
              modifier,
              value: value.split(","),
            };

            if (chains.length > 1) searchParam.chains = chains.slice(1);
            if (modifier) searchParam.modifier = modifier;

            return { ...parameters, [searchParam.name]: searchParam };
          },
          {}
        );

  return Object.values(parameters);
}
