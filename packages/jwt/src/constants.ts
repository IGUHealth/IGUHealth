import type { Issuer } from "./types.js"

export const IGUHEALTH_ISSUER: Issuer = "https://iguhealth.app/" as Issuer;
export const IGUHEALTH_AUDIENCE = "https://iguhealth.com/api";
export const CUSTOM_CLAIMS = {
  TENANTS: <const>"https://iguhealth.app/tenants",
  RESOURCE_TYPE: <const>"https://iguhealth.app/resourceType",
};
