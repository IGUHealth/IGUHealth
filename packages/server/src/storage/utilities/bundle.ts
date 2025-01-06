import { FHIRResponse } from "@iguhealth/client/types";
import { BundleEntry, uri } from "@iguhealth/fhir-types/r4/types";
import {
  AllResourceTypes,
  FHIR_VERSION,
  R4,
  Resource,
} from "@iguhealth/fhir-types/versions";
import { TenantId } from "@iguhealth/jwt/types";

import { createFHIRURL } from "../../fhir-api/constants.js";
import { fhirResponseToHTTPResponse } from "../../fhir-http/index.js";

export function fhirResourceToBundleEntry<Version extends FHIR_VERSION>(
  version: Version,
  tenant: TenantId,
  resource: Resource<Version, AllResourceTypes>,
): NonNullable<Resource<Version, "Bundle">["entry"]>[number] {
  return {
    fullUrl: createFHIRURL(
      version,
      tenant,
      `${resource.resourceType}/${resource.id}`,
    ),
    resource: resource,
  } as NonNullable<Resource<Version, "Bundle">["entry"]>[number];
}

export function fhirResponseToBundleEntry(
  tenant: TenantId,
  fhirResponse: FHIRResponse,
): BundleEntry {
  const httpResponse = fhirResponseToHTTPResponse(fhirResponse);
  return {
    response: {
      status: httpResponse.status ? httpResponse.status?.toString() : "200",
      location: (httpResponse.headers?.Location ??
        httpResponse.headers?.["Content-Location"]) as uri | undefined,
    },
    fullUrl: createFHIRURL(
      fhirResponse.fhirVersion,
      tenant,
      httpResponse.headers?.Location ?? "",
    ),
    resource: httpResponse.body
      ? (httpResponse.body as Resource<R4, AllResourceTypes>)
      : undefined,
  };
}
