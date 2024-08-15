import { uri } from "@iguhealth/fhir-types/r4/types";
import { FHIR_VERSION, R4, R4B } from "@iguhealth/fhir-types/versions";
import { TenantId } from "@iguhealth/jwt";

export function createTenantURL(tenant: TenantId) {
  return `${process.env.API_URL}/w/${tenant}`;
}

export function createFHIRURL(
  fhirVersion: FHIR_VERSION,
  tenant: TenantId,
  end: string,
): uri | undefined {
  const fhirSlug =
    fhirVersion === R4 ? "r4" : fhirVersion === R4B ? "r4b" : fhirVersion;
  return `${createTenantURL(tenant)}/api/v1/fhir/${fhirSlug}/${end}` as
    | uri
    | undefined;
}
