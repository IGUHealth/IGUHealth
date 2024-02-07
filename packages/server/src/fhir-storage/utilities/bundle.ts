import { FHIRResponse } from "@iguhealth/client/types";
import { BundleEntry, Resource, uri } from "@iguhealth/fhir-types/r4/types";

import { fhirResponseToHTTPResponse } from "../../fhir-http/index.js";

export function fhirResponseToBundleEntry(
  fhirResponse: FHIRResponse,
): BundleEntry {
  const koaResponse = fhirResponseToHTTPResponse(fhirResponse);
  return {
    response: {
      status: koaResponse.status ? koaResponse.status?.toString() : "200",
      location: (koaResponse.headers?.Location ??
        koaResponse.headers?.["Content-Location"]) as uri | undefined,
    },
    resource: koaResponse.body ? (koaResponse.body as Resource) : undefined,
  };
}
