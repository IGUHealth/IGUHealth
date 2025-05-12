import type { RouterParamContext } from "@koa/router";
import type Koa from "koa";
import type { Logger } from "pino";
import * as s from "zapatos/schema";

import { FHIRClientAsync } from "@iguhealth/client/interface";
import {
  AccessPolicyV2,
  ClientApplication,
  IdentityProvider,
  Membership,
  OperationDefinition,
  canonical,
  code,
  id,
} from "@iguhealth/fhir-types/r4/types";
import {
  FHIR_VERSION,
  Resource,
  ResourceType,
} from "@iguhealth/fhir-types/versions";
import {
  AccessToken,
  AccessTokenPayload,
  CUSTOM_CLAIMS,
  JWT,
  Subject,
  TenantId,
} from "@iguhealth/jwt/types";

import { getIssuer } from "../authN/oidc/constants.js";
import { SYSTEM_APP } from "../authN/oidc/hardcodedClients/system-app.js";
import { OIDCRouteHandler } from "../authN/oidc/index.js";
import { Scope } from "../authN/oidc/scopes/parse.js";
import {
  sessionCredentialsLogin,
  sessionLogout,
} from "../authN/oidc/session/index.js";
import type { IOCache } from "../cache/interface.js";
import { EmailProvider } from "../email/interface.js";
import type { EncryptionProvider } from "../encryption/provider/interface.js";
import type { TerminologyProvider } from "../fhir-terminology/interface.js";
import {
  IQueue,
  IQueueBatch,
} from "../queue/implementations/providers/interface.js";
import { SearchEngine } from "../search-stores/interface.js";
import { User } from "../storage/interfaces/authAdmin/authAdmin.js";
import { PostgresStore } from "../storage/postgres/index.js";
import type { LockProvider } from "../synchronization/interfaces.js";

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
      sessionLogin: typeof sessionCredentialsLogin;
      sessionLogout: typeof sessionLogout;
      isAuthenticated: (
        ctx: Parameters<OIDCRouteHandler>[0],
      ) => Promise<boolean>;
      user?: User;
      client?: ClientApplication;
      identityProviders?: IdentityProvider[];
      parameters: {
        client_id?: string;
        client_secret?: string;

        code_verifier?: string;
        code_challenge_method?: string;
        code_challenge?: string;
        state?: string;
        responseType?: code;
        response_type?: string;
        redirect_uri?: string;
        scope?: string;
      };
      launch?: Record<string, id>;
      scopes?: Scope[];
    };
  };

  export type IGUHealth = OIDC &
    IGUHealthServices & {
      iguhealth: MakeOptional<IGUHealthServerCTX, "user">;
    };

  export type IGUHealthServices = {
    allowSignup?: boolean;
    __user__: AccessTokenPayload<s.user_role>;
    __access_token__: AccessToken<s.user_role>;
    corsNonce: string;
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
  resource: Membership | ClientApplication | OperationDefinition;
  accessPolicies?: AccessPolicyV2[];
  scope?: Scope[];
}

export interface IGUHealthServerCTX {
  environment: string;
  // Server Information
  tenant: TenantId;
  user: UserContext;

  queue: IQueue | IQueueBatch;

  // FHIR Client
  client: FHIRClientAsync<IGUHealthServerCTX>;

  // Storage
  search: SearchEngine<IGUHealthServerCTX>;
  store: PostgresStore<IGUHealthServerCTX>;

  // Services
  cache?: IOCache<Pick<IGUHealthServerCTX, "tenant">>;
  lock: LockProvider<Pick<IGUHealthServerCTX, "store">>;

  logger: Logger<string>;
  terminologyProvider?: TerminologyProvider;
  encryptionProvider?: EncryptionProvider;
  emailProvider?: EmailProvider;

  // Utilities
  resolveCanonical: <
    Version extends FHIR_VERSION,
    Type extends ResourceType<Version>,
  >(
    ctx: this,
    fhirVersion: Version,
    type: Type,
    url: canonical[],
  ) => Promise<Resource<Version, Type>[]>;
}

function createRootClaims(
  tenant: TenantId,
  clientApp: ClientApplication,
): AccessTokenPayload<s.user_role> {
  return {
    scope: "system/*.*",
    iss: getIssuer(tenant),
    sub: clientApp.id as string as Subject,
    aud: clientApp.id as id,
    [CUSTOM_CLAIMS.RESOURCE_ID]: clientApp.id as id,
    [CUSTOM_CLAIMS.RESOURCE_TYPE]: clientApp.resourceType,
    [CUSTOM_CLAIMS.ROLE]: "owner",
    [CUSTOM_CLAIMS.TENANT]: tenant,
    [CUSTOM_CLAIMS.ACCESS_POLICY_VERSION_IDS]: [],
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
  const rootClaims = createRootClaims(ctx.tenant, SYSTEM_APP);

  return {
    ...ctx,
    tenant: ctx.tenant,
    user: {
      resource: SYSTEM_APP,
      payload: rootClaims,
    },
  };
}
