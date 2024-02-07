import * as jose from "jose";

import {
  ClientApplication,
  OperationDefinition,
  Membership,
} from "@iguhealth/fhir-types/lib/r4/types";

import { TenantClaim, TenantId } from "../fhir-context/context.js";
import { ROLE } from "../fhir-context/roles.js";

declare const __subject: unique symbol;
export type Subject = string & { [__subject]: string };
declare const __iss: unique symbol;
export type Issuer = string & { [__iss]: string };

export const IGUHEALTH_ISSUER: Issuer = "https://iguhealth.app/" as Issuer;
export const IGUHEALTH_AUDIENCE = "https://iguhealth.com/api";
export const CUSTOM_CLAIMS = {
  TENANTS: <const>"https://iguhealth.app/tenants",
  RESOURCE_TYPE: <const>"https://iguhealth.app/resourceType",
};
export type JWT_RESOURCE_TYPES = OperationDefinition["resourceType"] | ClientApplication["resourceType"] | Membership["resourceType"]

export interface JWT {
  sub: Subject;
  iss: Issuer;
  [CUSTOM_CLAIMS.RESOURCE_TYPE]: JWT_RESOURCE_TYPES;
  [CUSTOM_CLAIMS.TENANTS]: TenantClaim[];
  [key: string]: unknown;
}

/**
 * Creates a JWT token using the provided private key and payload.
 */
export async function createToken(
  privatekey: { kid: string; key: jose.KeyLike },
  payload: {
    tenant: TenantId;
    role: ROLE;
    resourceType: JWT_RESOURCE_TYPES;
    sub: OperationDefinition["id"] | ClientApplication["id"] | Membership["id"];
    scope: string;
  },
): Promise<string> {
  const signedJWT = await new jose.SignJWT({
    iss: IGUHEALTH_ISSUER,
    aud: IGUHEALTH_AUDIENCE,
    [CUSTOM_CLAIMS.TENANTS]: [
      {
        id: payload.tenant,
        userRole: payload.role,
      } as TenantClaim,
    ],
    [CUSTOM_CLAIMS.RESOURCE_TYPE]: payload.resourceType,
    sub: payload.sub as string as Subject,
    scope: payload.scope,
  } as JWT)
    .setProtectedHeader({ kid: privatekey.kid, alg: "RS256" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(privatekey.key);

  return signedJWT;
}
