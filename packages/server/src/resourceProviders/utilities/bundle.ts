import { Resource, BundleEntry } from "@iguhealth/fhir-types/r4/types";
import { FHIRResponse } from "@iguhealth/client/types";

import { fhirResponseToHTTPResponse } from "../../http/index.js";

export function fhirResponseToBundleEntry(
  fhirResponse: FHIRResponse
): BundleEntry {
  const koaResponse = fhirResponseToHTTPResponse(fhirResponse);
  return {
    response: {
      status: koaResponse.status ? koaResponse.status?.toString() : "200",
      location:
        koaResponse.headers?.Location ??
        koaResponse.headers?.["Content-Location"],
    },
    resource: koaResponse.body ? (koaResponse.body as Resource) : undefined,
  };
}
