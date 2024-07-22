import type { RouterParamContext } from "@koa/router";
import type Koa from "koa";
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
  id,
  uri,
} from "@iguhealth/fhir-types/r4/types";
import {
  AllResourceTypes,
  FHIR_VERSION,
  Resource,
} from "@iguhealth/fhir-types/versions";
import {
  AccessToken,
  AccessTokenPayload,
  CUSTOM_CLAIMS,
  JWT,
  Subject,
  TENANT_ISSUER,
  TenantId,
} from "@iguhealth/jwt";

import { AuthorizationCodeManagement } from "../authN/db/code/interface.js";
import { UserManagement } from "../authN/db/users/interface.js";
import { User } from "../authN/db/users/types.js";
import { OIDCRouteHandler } from "../authN/oidc/index.js";
import { sessionLogin, sessionLogout } from "../authN/oidc/session/index.js";
import type { IOCache } from "../cache/interface.js";
import { EmailProvider } from "../email/interface.js";
import type { EncryptionProvider } from "../encryption/provider/interface.js";
import type { TerminologyProvider } from "../fhir-terminology/interface.js";
import type { Lock } from "../synchronization/interfaces.js";

type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [P in K]?: T[P];
};

export namespace KoaExtensions {
  export type KoaIGUHealthContext = Koa.ParameterizedContext<
    KoaExtensions.IGUHealth,
    RouterParamContext<KoaExtensions.IGUHealth, KoaIGUHealthContext>
  >;

  export type OIDC = {
    oidc: {
      sessionLogin: typeof sessionLogin;
      sessionLogout: typeof sessionLogout;
      isAuthenticated: (
        ctx: Parameters<OIDCRouteHandler>[0],
      ) => Promise<boolean>;

      user?: User;
      userManagement: UserManagement;
      codeManagement: AuthorizationCodeManagement;
      client?: ClientApplication;
      parameters: {
        code_verifier?: string;
        code_challenge_method?: string;
        code_challenge?: string;
        state?: string;
        responseType?: code;
        response_type?: string;
        client_id?: string;
        redirect_uri?: string;
        scope?: string;
      };
    };
  };

  export type IGUHealth = OIDC &
    IGUHealthServices & {
      iguhealth: MakeOptional<IGUHealthServerCTX, "user">;
    };

  export type IGUHealthServices = {
    allowSignup?: boolean;
    __user__?: AccessTokenPayload<s.user_role>;
    __access_token__?: AccessToken<s.user_role>;
    iguhealth: MakeOptional<IGUHealthServerCTX, "user" | "tenant">;
  };

  /**
   * Verifies whether ctx is IGUHealthServerCTX with user.
   * @param ctx CTX that should be verified as user associated
   * @returns  Verifies whether ctx is IGUHealthServerCTX with user
   */
  export function isFHIRServerAuthorizedUserCTX(
    ctx: IGUHealthServerCTX | Omit<IGUHealthServerCTX, "user">,
  ): ctx is IGUHealthServerCTX {
    return (ctx as IGUHealthServerCTX).user !== undefined;
  }
}

export interface UserContext {
  payload: AccessTokenPayload<s.user_role>;
  accessToken?: JWT<AccessTokenPayload<s.user_role>>;
  resource?: Membership | ClientApplication | OperationDefinition | null;
  accessPolicies?: AccessPolicy[];
}

export interface IGUHealthServerCTX {
  // Server Information
  tenant: TenantId;
  user: UserContext;

  // FHIR Client
  client: FHIRClientAsync<IGUHealthServerCTX>;

  // Services
  db: db.Queryable;
  logger: Logger<string>;
  lock: Lock<unknown>;
  cache: IOCache<Pick<IGUHealthServerCTX, "tenant">>;
  terminologyProvider?: TerminologyProvider;
  encryptionProvider?: EncryptionProvider;
  emailProvider?: EmailProvider;

  // Utilities
  resolveTypeToCanonical: (
    fhirVersion: FHIR_VERSION,
    type: uri,
  ) => Promise<canonical | undefined>;

  resolveCanonical: <
    FHIRVersion extends FHIR_VERSION,
    Type extends AllResourceTypes,
  >(
    fhirVersion: FHIRVersion,
    type: Type,
    url: canonical,
  ) => Promise<Resource<FHIRVersion, Type> | undefined>;
}

export function rootClaims(tenant: TenantId): AccessTokenPayload<s.user_role> {
  return {
    iss: TENANT_ISSUER(process.env.API_URL, tenant),
    aud: "iguhealth",
    [CUSTOM_CLAIMS.RESOURCE_TYPE]: "Membership",
    [CUSTOM_CLAIMS.RESOURCE_ID]: "system" as id,
    [CUSTOM_CLAIMS.ROLE]: "admin",
    [CUSTOM_CLAIMS.TENANT]: tenant,
    sub: "system" as Subject,
  };
}

/**
 * For certain operations like parameter retrievals must treat context as a system user.
 * To bypass any access control checks, we can use this function to create a new context.
 * @param ctx The current context
 * @returns A new context with the user set to system.
 */
export function asRoot(
  ctx: Omit<IGUHealthServerCTX, "user">,
): IGUHealthServerCTX {
  return {
    ...ctx,
    tenant: ctx.tenant,
    user: {
      payload: rootClaims(ctx.tenant),
    },
  };
}
