import { AllInteractions, FHIRResponse } from "@iguhealth/client/types";
import { BundleEntry, uri } from "@iguhealth/fhir-types/r4/types";
import {
  AllResourceTypes,
  FHIR_VERSION,
  R4,
  Resource,
} from "@iguhealth/fhir-types/versions";
import { TenantId } from "@iguhealth/jwt/types";

import { ConfigProvider } from "../../config/provider/interface.js";
import { fhirResponseToHTTPResponse } from "../../fhir-http/index.js";
import { createFHIRURL } from "../../fhir-server/constants.js";

export async function fhirResourceToBundleEntry<Version extends FHIR_VERSION>(
  config: ConfigProvider,
  version: Version,
  tenant: TenantId,
  resource: Resource<Version, AllResourceTypes>,
): Promise<NonNullable<Resource<Version, "Bundle">["entry"]>[number]> {
  return {
    fullUrl: await createFHIRURL(
      config,
      version,
      tenant,
      `${resource.resourceType}/${resource.id}`,
    ),
    resource: resource,
  } as NonNullable<Resource<Version, "Bundle">["entry"]>[number];
}

export async function fhirResponseToBundleEntry(
  config: ConfigProvider,
  tenant: TenantId,
  fhirResponse: FHIRResponse<FHIR_VERSION, AllInteractions | "error">,
): Promise<BundleEntry> {
  const httpResponse = fhirResponseToHTTPResponse(fhirResponse);
  return {
    response: {
      status: httpResponse.status ? httpResponse.status?.toString() : "200",
      location: (httpResponse.headers?.Location ??
        httpResponse.headers?.["Content-Location"]) as uri | undefined,
    },
    fullUrl: await createFHIRURL(
      config,
      fhirResponse.fhirVersion,
      tenant,
      httpResponse.headers?.Location ?? "",
    ),
    resource: httpResponse.body
      ? (httpResponse.body as Resource<R4, AllResourceTypes>)
      : undefined,
  };
}
