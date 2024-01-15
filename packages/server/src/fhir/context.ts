import type { Logger } from "pino";

import { FHIRClientAsync } from "@iguhealth/client/interface";
import {
  AResource,
  AccessPolicy,
  CapabilityStatement,
  ResourceType,
  User,
  canonical,
  uri,
} from "@iguhealth/fhir-types/r4/types";

import { IGUHEALTH_ISSUER } from "../authN/token.js";
import type { IOCache } from "../cache/interface.js";
import type { EncryptionProvider } from "../encryption/provider/interface.js";
import type { Lock } from "../synchronization/interfaces.js";
import type { TerminologyProvider } from "../terminology/interface.js";
import { SUPER_ADMIN, USER } from "./roles.js";

declare const __tenant: unique symbol;
export type TenantId = string & { [__tenant]: string };
export interface Tenant {
  id: TenantId;
  userRole: SUPER_ADMIN | USER;
}

declare const __subject: unique symbol;
export type Subject = string & { [__subject]: string };
declare const __iss: unique symbol;
export type Issuer = string & { [__iss]: string };

export interface JWT {
  sub: Subject;
  iss: Issuer;
  [key: string]: unknown;
}

export interface FHIRServerInitCTX {
  // User information
  tenant: Readonly<Tenant>;
  user: {
    resource?: User | null;
    jwt: JWT;
    accessPolicies?: AccessPolicy[];
    accessToken?: string;
  };
}

export interface FHIRServerCTX extends FHIRServerInitCTX {
  // Server Information
  capabilities: CapabilityStatement;

  // FHIR Client
  client: FHIRClientAsync<FHIRServerCTX>;

  // Services
  logger: Logger<unknown>;
  lock: Lock<unknown>;

  cache: IOCache<FHIRServerCTX>;
  terminologyProvider: TerminologyProvider;
  encryptionProvider?: EncryptionProvider;

  // Contextual Information.
  // If this is set to true, then the current request is part of a transaction.
  inTransaction?: boolean;

  // Utilities
  resolveTypeToCanonical: (type: uri) => canonical | undefined;
  resolveCanonical: <T extends ResourceType>(
    type: T,
    url: string,
  ) => AResource<T> | undefined;
}

/**
 * For certain operations like parameter retrievals must treat context as a system user.
 * To bypass any access control checks, we can use this function to create a new context.
 * @param ctx The current context
 * @returns A new context with the user set to system.
 */
export function asSystemCTX(ctx: FHIRServerCTX): FHIRServerCTX {
  return {
    ...ctx,
    tenant: {
      ...ctx.tenant,
      userRole: "SUPER_ADMIN",
    },
    user: {
      jwt: {
        iss: IGUHEALTH_ISSUER,
        sub: "system",
      } as JWT,
    },
  };
}
