import type { Logger } from "pino";
import type pg from "pg";

import {
  ResourceType,
  AResource,
  CapabilityStatement,
  User,
  AccessPolicy,
  canonical,
  uri,
} from "@iguhealth/fhir-types/r4/types";
import { FHIRClientAsync } from "@iguhealth/client/interface";

import { Lock } from "../synchronization/interfaces.ts";
import { IOCache } from "../cache/interface.ts";
import { TerminologyProvider } from "../terminology/interface.ts";
import { EncryptionProvider } from "../encryption/provider/interface.ts";
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

export interface FHIRServerState {
  pool: pg.Pool;
  cache: IOCache<FHIRServerCTX>;
  logger: Logger<unknown>;
  lock: Lock<unknown>;
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
    url: string
  ) => AResource<T> | undefined;
}
