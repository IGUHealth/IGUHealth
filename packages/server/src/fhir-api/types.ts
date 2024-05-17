import type { Logger } from "pino";
import * as db from "zapatos/db";
import * as s from "zapatos/schema";

import { FHIRClientAsync } from "@iguhealth/client/interface";
import {
  AccessPolicy,
  ClientApplication,
  Membership,
  OperationDefinition,
  canonical,
  code,
  uri,
} from "@iguhealth/fhir-types/r4/types";
import {
  AllResourceTypes,
  FHIR_VERSION,
  Resource,
} from "@iguhealth/fhir-types/versions";
import { AccessTokenPayload, IGUHEALTH_ISSUER, TenantId } from "@iguhealth/jwt";

import { AuthorizationCodeManagement } from "../authN/db/code/interface.js";
import { UserManagement } from "../authN/db/users/interface.js";
import { User } from "../authN/db/users/types.js";
import { ManagementRouteHandler } from "../authN/oidc/index.js";
import { sessionLogin, sessionLogout } from "../authN/oidc/session/index.js";
import type { IOCache } from "../cache/interface.js";
import { EmailProvider } from "../email/interface.js";
import type { EncryptionProvider } from "../encryption/provider/interface.js";
import type { TerminologyProvider } from "../fhir-terminology/interface.js";
import type { Lock } from "../synchronization/interfaces.js";

export namespace KoaContext {
  export type OIDC = {
    oidc: {
      sessionLogin: typeof sessionLogin;
      sessionLogout: typeof sessionLogout;
      isAuthenticated: (
        ctx: Parameters<ManagementRouteHandler>[0],
      ) => Promise<boolean>;

      user?: User;
      tenant?: TenantId;
      userManagement: UserManagement;
      codeManagement: AuthorizationCodeManagement;
      client?: ClientApplication;
      allowSignup?: boolean;
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

export interface UserContext {
  role: s.user_role;
  jwt: AccessTokenPayload<s.user_role>;
  resource?: Membership | ClientApplication | OperationDefinition | null;
  accessPolicies?: AccessPolicy[];
  accessToken?: string;
}

export interface FHIRServerCTX {
  // Server Information
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
  emailProvider?: EmailProvider;

  // Contextual Information.
  // If this is set to true, then the current request is part of a transaction.
  inTransaction?: boolean;

  // Utilities
  resolveTypeToCanonical: (
    fhirVersion: FHIR_VERSION,
    type: uri,
  ) => canonical | undefined;
  resolveCanonical: <
    FHIRVersion extends FHIR_VERSION,
    Type extends AllResourceTypes,
  >(
    fhirVersion: FHIRVersion,
    type: Type,
    url: canonical,
  ) => Resource<FHIRVersion, Type> | undefined;
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
      } as AccessTokenPayload<s.user_role>,
    },
  };
}
