import type { Issuer } from "./types.js";

export const IGUHEALTH_ISSUER: Issuer = "https://iguhealth.app/" as Issuer;
export const IGUHEALTH_AUDIENCE = "https://iguhealth.com/api";
export const CUSTOM_CLAIMS = {
  RESOURCE_TYPE: <const>"https://iguhealth.app/resourceType",
  RESOURCE_ID: <const>"https://iguhealth.app/resourceId",
  TENANT: <const>"https://iguhealth.app/tenant",
  ROLE: <const>"https://iguhealth.app/role",
};
