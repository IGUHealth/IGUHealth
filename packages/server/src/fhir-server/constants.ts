import path from "node:path";

import { uri } from "@iguhealth/fhir-types/r4/types";
import { FHIR_VERSION, R4, R4B } from "@iguhealth/fhir-types/versions";
import { TenantId } from "@iguhealth/jwt/types";

import { ConfigProvider } from "../config/provider/interface.js";

export async function createTenantURL(
  config: ConfigProvider,
  tenant: TenantId,
): Promise<string> {
  const base = new URL(await config.get("API_URL"));
  return new URL(path.join(base.pathname, "w", tenant), base.origin).href;
}

export async function createFHIRURL(
  config: ConfigProvider,
  fhirVersion: FHIR_VERSION,
  tenant: TenantId,
  end: string,
): Promise<uri> {
  const fhirSlug =
    fhirVersion === R4 ? "r4" : fhirVersion === R4B ? "r4b" : fhirVersion;
  const tenantURL = new URL(await createTenantURL(config, tenant));

  return new URL(
    path.join(tenantURL.pathname, "api/v1/fhir", fhirSlug, end),
    tenantURL.origin,
  ).href as uri;
}
