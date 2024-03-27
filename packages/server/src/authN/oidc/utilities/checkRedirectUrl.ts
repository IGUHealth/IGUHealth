import { ClientApplication } from "@iguhealth/fhir-types/r4/types";

function getRegexForRedirect(urlPattern: string): RegExp {
  const regex = new RegExp(urlPattern.replaceAll("*", "(.+)"));
  return regex;
}

export function isInvalidRedirectUrl(
  redirectUrl: string | undefined,
  client: ClientApplication,
): boolean {
  return (
    !redirectUrl ||
    !client.redirectUri?.find((v) => getRegexForRedirect(v).test(redirectUrl))
  );
}
