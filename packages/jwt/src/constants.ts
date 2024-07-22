import type { Issuer, TenantId } from "./types.js";

export const TENANT_ISSUER  = (url: string, tenant: TenantId): Issuer => new URL(`/w/${tenant}`, url).href as Issuer;

export const CUSTOM_CLAIMS = {
  RESOURCE_TYPE: <const>"https://iguhealth.app/resourceType",
  RESOURCE_ID: <const>"https://iguhealth.app/resourceId",
  TENANT: <const>"https://iguhealth.app/tenant",
  ROLE: <const>"https://iguhealth.app/role"
};