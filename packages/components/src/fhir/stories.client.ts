import createHTTPClient from "@iguhealth/client/http";

const OPEN_URL = "https://open-api.iguhealth.app/w/system/api/v1/fhir/r4/";
export function createStorybookClient() {
  const client = createHTTPClient({
    url: OPEN_URL,
  });

  return client;
}
