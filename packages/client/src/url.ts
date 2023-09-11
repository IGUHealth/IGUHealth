import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

export type ParsedParameter<T> = {
  name: string;
  value: T[];
  modifier?: string;
  chains?: string[];
};

/*
 ** Given a query string create complex FHIR Query object.
 */
export function parseQuery(
  queryParams: string
): ParsedParameter<string | number>[] {
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

/*
 ** Given a url string parsequery parameters.
 */
export default function parseUrl(
  url: string
): ParsedParameter<string | number>[] {
  const chunks = url.split("?");
  if (chunks.length > 2)
    throw new OperationError(outcomeError("invalid", "Invalid query string"));
  const [_, queryParams] = chunks;
  return parseQuery(queryParams);
}
