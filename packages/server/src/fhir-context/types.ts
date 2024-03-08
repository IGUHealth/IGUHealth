import type { Logger } from "pino";
import * as db from "zapatos/db";
import * as s from "zapatos/schema";

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
  code,
  uri,
} from "@iguhealth/fhir-types/r4/types";

import { AuthorizationCodeManagement } from "../authN/db/code/interface.js";
import { UserManagement } from "../authN/db/users/interface.js";
import { IGUHEALTH_ISSUER, JWT } from "../authN/token.js";
import type { IOCache } from "../cache/interface.js";
import { EmailProvider } from "../email/interface.js";
import type { EncryptionProvider } from "../encryption/provider/interface.js";
import type { TerminologyProvider } from "../fhir-terminology/interface.js";
import type { Lock } from "../synchronization/interfaces.js";

export namespace KoaContext {
  export type OIDC = {
    oidc: {
      userManagement: UserManagement;
      codeManagement: AuthorizationCodeManagement;
      context: { scope: "global" } | { scope: "tenant"; tenant: TenantId };
      client?: ClientApplication;
      parameters: {
        state?: string;
        responseType?: code;
        response_type?: string;
        client_id?: string;
        redirect_uri?: string;
        scope?: string;
      };
    };
  };

  export type FHIR<C> = C &
    OIDC &
    FHIRServices & {
      FHIRContext: Omit<FHIRServerCTX, "user"> | FHIRServerCTX;
    };

  export type FHIRServices = {
    emailProvider?: EmailProvider;
    postgres: db.Queryable;
    FHIRContext: Omit<FHIRServerCTX, "user" | "tenant">;
  };

  /**
   * Verifies whether ctx is FHIRServerCTX with user.
   * @param ctx CTX that should be verified as user associated
   * @returns  Verifies whether ctx is FHIRServerCTX with user
   */
  export function isFHIRServerAuthorizedUserCTX(
    ctx: FHIRServerCTX | Omit<FHIRServerCTX, "user">,
  ): ctx is FHIRServerCTX {
    return (ctx as FHIRServerCTX).user !== undefined;
  }
}

declare const __tenant: unique symbol;
export type TenantId = string & { [__tenant]: string };
export interface TenantClaim {
  id: TenantId;
  userRole: s.user_role;
}

export interface UserContext {
  role: s.user_role;
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
  db: db.Queryable;
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
      role: "admin",
      jwt: {
        iss: IGUHEALTH_ISSUER,
        sub: "system",
      } as JWT,
    },
  };
}
