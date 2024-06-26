import { FHIRResponse } from "@iguhealth/client/types";
import { BundleEntry, uri } from "@iguhealth/fhir-types/r4/types";
import {
  AllResourceTypes,
  FHIR_VERSION,
  R4,
  R4B,
  Resource,
} from "@iguhealth/fhir-types/versions";
import { TenantId } from "@iguhealth/jwt";

import { fhirResponseToHTTPResponse } from "../../fhir-http/index.js";

export function fullUrl(
  fhirVersion: FHIR_VERSION,
  tenant: string,
  end: string,
): uri | undefined {
  const fhirSlug =
    fhirVersion === R4 ? "r4" : fhirVersion === R4B ? "r4b" : fhirVersion;
  return `${process.env.API_URL}/w/${tenant}/api/v1/fhir/${fhirSlug}/${end}` as
    | uri
    | undefined;
}

export function fhirResourceToBundleEntry<Version extends FHIR_VERSION>(
  version: Version,
  tenant: TenantId,
  resource: Resource<Version, AllResourceTypes>,
): NonNullable<Resource<Version, "Bundle">["entry"]>[number] {
  return {
    fullUrl: fullUrl(
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
    fullUrl: fullUrl(
      fhirResponse.fhirVersion,
      tenant,
      httpResponse.headers?.Location ?? "",
    ),
    resource: httpResponse.body
      ? (httpResponse.body as Resource<R4, AllResourceTypes>)
      : undefined,
  };
}
