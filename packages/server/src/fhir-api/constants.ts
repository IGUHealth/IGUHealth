import path from "node:path";

import { uri } from "@iguhealth/fhir-types/r4/types";
import { FHIR_VERSION, R4, R4B } from "@iguhealth/fhir-types/versions";
import { TenantId } from "@iguhealth/jwt";

export function createTenantURL(tenant: TenantId): string {
  const base = new URL(process.env.API_URL);
  return new URL(path.join(base.pathname, "w", tenant), base.origin).href;
}

export function createFHIRURL(
  fhirVersion: FHIR_VERSION,
  tenant: TenantId,
  end: string,
): uri {
  const fhirSlug =
    fhirVersion === R4 ? "r4" : fhirVersion === R4B ? "r4b" : fhirVersion;
  const tenantURL = new URL(createTenantURL(tenant));

  return new URL(
    path.join(tenantURL.pathname, "api/v1/fhir", fhirSlug, end),
    tenantURL.origin,
  ).href as uri;
}
