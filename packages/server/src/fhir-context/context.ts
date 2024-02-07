import type { Logger } from "pino";
import * as db from "zapatos/db";

import { FHIRClientAsync } from "@iguhealth/client/interface";
import {
  AResource,
  AccessPolicy,
  CapabilityStatement,
  ClientApplication,
  Membership,
  OperationDefinition,
  ResourceType,
  canonical,
  uri,
} from "@iguhealth/fhir-types/r4/types";

import { IGUHEALTH_ISSUER, JWT } from "../authN/token.js";
import type { IOCache } from "../cache/interface.js";
import type { EncryptionProvider } from "../encryption/provider/interface.js";
import type { TerminologyProvider } from "../fhir-terminology/interface.js";
import type { Lock } from "../synchronization/interfaces.js";
import { ROLE } from "./roles.js";

declare const __tenant: unique symbol;
export type TenantId = string & { [__tenant]: string };
export interface TenantClaim {
  id: TenantId;
  userRole: ROLE;
}

export interface UserContext {
  role: ROLE;
  jwt: JWT;
  resource?: Membership | ClientApplication | OperationDefinition | null;
  accessPolicies?: AccessPolicy[];
  accessToken?: string;
}

export interface FHIRServerCTX {
  // Server Information
  capabilities: CapabilityStatement;
  tenant: TenantId;
  user: UserContext;

  // FHIR Client
  client: FHIRClientAsync<FHIRServerCTX>;

  // Services
  logger: Logger<string>;
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
export function asSystemCTX(ctx: Omit<FHIRServerCTX, "user">): FHIRServerCTX {
  return {
    ...ctx,
    tenant: ctx.tenant,
    user: {
      role: "SUPER_ADMIN",
      jwt: {
        iss: IGUHEALTH_ISSUER,
        sub: "system",
      } as JWT,
    },
  };
}
