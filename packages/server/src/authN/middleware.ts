import jwksRsa from "jwks-rsa";
import Koa, { Middleware } from "koa";
import jwt from "koa-jwt";
import * as s from "zapatos/schema";

import { AccessPolicyV2, code, id } from "@iguhealth/fhir-types/r4/types";
import { R4, Resource } from "@iguhealth/fhir-types/versions";
import { getJWKS, getSigningKey } from "@iguhealth/jwt/certifications";
import { createToken } from "@iguhealth/jwt/token";
import {
  ALGORITHMS,
  AccessTokenPayload,
  CUSTOM_CLAIMS,
  Subject,
  TenantId,
} from "@iguhealth/jwt/types";
import {
  OperationError,
  outcomeError,
  outcomeFatal,
} from "@iguhealth/operation-outcomes";

import {
  IGUHealthServerCTX,
  KoaExtensions,
  asRoot,
} from "../fhir-server/types.js";
import {
  authenticateClientCredentials,
  createClientCredentialToken,
  getBasicHeaderCredentials,
} from "./oidc/client_credentials_verification.js";
import { getIssuer } from "./oidc/constants.js";
import getHardCodedClients from "./oidc/hardcodedClients/index.js";
import { PUBLIC_APP } from "./oidc/hardcodedClients/public-app.js";

async function createLocalJWTSecret(
  certLocation: string,
): Promise<ReturnType<typeof jwksRsa.koaJwtSecret>> {
  const jwks = await getJWKS(certLocation);
  return jwksRsa.koaJwtSecret({
    jwksUri: "_not_used",
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 2,
    fetcher: async () => {
      return jwks;
    },
  });
}

interface ValidateUserJWTMiddlewareOptions {
  AUTH_LOCAL_CERTIFICATION_LOCATION: string;
}

/**
 * For Basic auth verify and inject a token into the request
 * Will only work for Client Application registered on tenant that allows basic.
 * @param ctx
 * @param next
 */
export async function verifyBasicAuth<
  State extends KoaExtensions.IGUHealth,
  Context extends KoaExtensions.KoaIGUHealthContext,
>(ctx: Koa.ParameterizedContext<State, Context>, next: Koa.Next) {
  const authHeader = ctx.req.headers.authorization;

  if (authHeader?.startsWith("Basic")) {
    const credentials = getBasicHeaderCredentials(ctx.request);
    if (!credentials) {
      throw new OperationError(
        outcomeError("invalid", "Could not find credentials in request."),
      );
    }

    const clientApplication = await ctx.state.iguhealth.client.read(
      asRoot(ctx.state.iguhealth),
      R4,
      "ClientApplication",
      credentials.client_id as id,
    );

    if (!clientApplication) {
      throw new OperationError(
        outcomeError("security", "Invalid credentials for client."),
      );
    }

    if (!clientApplication.grantType.includes("basic_auth" as code)) {
      throw new OperationError(
        outcomeError("security", "Client does not support basic auth."),
      );
    }

    if (!authenticateClientCredentials(clientApplication, credentials)) {
      throw new OperationError(
        outcomeError("security", "Invalid credentials for client."),
      );
    }

    const token = await createClientCredentialToken(
      ctx.state.iguhealth,
      clientApplication,
    );
    ctx.req.headers.authorization = "Bearer " + token;
  }
  await next();
}

/**
 *
 * @returns Koa middleware that validates the user JWT.
 */
export async function createValidateUserJWTMiddleware<T, C>({
  AUTH_LOCAL_CERTIFICATION_LOCATION,
}: ValidateUserJWTMiddlewareOptions): Promise<Koa.Middleware<T, C>> {
  const IGUHEALTH_JWT_SECRET = await createLocalJWTSecret(
    AUTH_LOCAL_CERTIFICATION_LOCATION,
  );

  return jwt({
    key: "__user__",
    tokenKey: "__access_token__",
    secret: async (header: jwksRsa.TokenHeader) => {
      return IGUHEALTH_JWT_SECRET(header);
    },
    algorithms: [ALGORITHMS.RS384],
  }) as unknown as Middleware<T, C>;
}

async function findResourceAndAccessPolicies<
  Type extends "Membership" | "OperationDefinition" | "ClientApplication",
>(
  ctx: IGUHealthServerCTX,
  memberType: Type,
  memberId: id,
  memberVersionId: id,
  accessPolicyVersionIds: id[],
): Promise<{
  resource?: Resource<R4, Type>;
  accessPolicies: AccessPolicyV2[];
}> {
  const clients = getHardCodedClients();

  // For hardcoded clients access check is needed
  // IE iguhealth system app and worker app.
  const hardCodedClient = clients.find(
    (client) => client.id === memberId && memberType === client.resourceType,
  );
  if (hardCodedClient)
    return {
      resource: hardCodedClient as Resource<R4, Type>,
      accessPolicies: [],
    };

  const [member, ...accessPolicies] = await ctx.store.read(asRoot(ctx), R4, [
    memberVersionId,
    ...accessPolicyVersionIds,
  ]);

  if (member?.resourceType !== memberType) {
    throw new OperationError(
      outcomeError("security", "Resource type does not match the version id."),
    );
  }

  return {
    resource: member as Resource<R4, Type>,
    accessPolicies: accessPolicies as AccessPolicyV2[],
  };
}

/**
 * Retrieve the user resource and access policies.
 *
 * @param context IGUHealthServerCTX
 * @param user User AccessToken Claims.
 * @returns User resource and access policy
 */
async function userResourceAndAccessPolicies(
  context: IGUHealthServerCTX,
  user: AccessTokenPayload<s.user_role>,
): Promise<ReturnType<typeof findResourceAndAccessPolicies>> {
  switch (user[CUSTOM_CLAIMS.RESOURCE_TYPE]) {
    case "Membership":
    case "ClientApplication":
    case "OperationDefinition": {
      return findResourceAndAccessPolicies(
        asRoot({ ...context, tenant: user[CUSTOM_CLAIMS.TENANT] }),
        user[CUSTOM_CLAIMS.RESOURCE_TYPE],
        user[CUSTOM_CLAIMS.RESOURCE_ID],
        user[CUSTOM_CLAIMS.RESOURCE_VERSION_ID],
        user[CUSTOM_CLAIMS.ACCESS_POLICY_VERSION_IDS],
      );
    }

    default:
      throw new OperationError(
        outcomeFatal(
          "invalid",
          `Invalid resource type set on JWT '${user[CUSTOM_CLAIMS.RESOURCE_TYPE]}'`,
        ),
      );
  }
}

/**
 * Move the user JWT to the IGUHealth context and retrieve access policies.
 * @param ctx Koa Context
 * @param next Next Middleware
 */
export const associateUserToIGUHealth: Koa.Middleware<
  KoaExtensions.IGUHealthServices,
  KoaExtensions.KoaIGUHealthContext
> = async (ctx, next) => {
  if (!ctx.state.__user__) {
    throw new OperationError(
      outcomeError("security", "No user found in context."),
    );
  }

  const { resource, accessPolicies } = await userResourceAndAccessPolicies(
    asRoot(ctx.state.iguhealth),
    ctx.state.__user__,
  );

  if (!resource) {
    throw new OperationError(
      outcomeError("security", "User resource not found."),
    );
  }

  ctx.state.iguhealth.user = {
    resource,
    accessPolicies,
    payload: ctx.state.__user__,
    accessToken: ctx.state.__access_token__,
  };

  await next();
};

/**
 * Middleware that allows full system access to all tenants (used on public server)
 * @param ctx Koa.Context
 * @param next Koa.Next
 */
export const allowPublicAccessMiddleware: Koa.Middleware<
  KoaExtensions.IGUHealthServices,
  KoaExtensions.KoaIGUHealthContext
> = async (ctx, next) => {
  const user: AccessTokenPayload<s.user_role> = {
    iss: getIssuer(ctx.params.tenant as TenantId),
    aud: "iguhealth",
    sub: "public-user" as Subject,
    scope: "user/*.*",
    [CUSTOM_CLAIMS.RESOURCE_TYPE]: PUBLIC_APP.resourceType,
    [CUSTOM_CLAIMS.RESOURCE_ID]: PUBLIC_APP.id as id,
    [CUSTOM_CLAIMS.RESOURCE_VERSION_ID]: PUBLIC_APP.meta?.versionId as id,
    [CUSTOM_CLAIMS.ACCESS_POLICY_VERSION_IDS]: [],
    [CUSTOM_CLAIMS.TENANT]: ctx.params.tenant as TenantId,
    [CUSTOM_CLAIMS.ROLE]: "admin",
  };

  const token = await createToken({
    signingKey: await getSigningKey(
      process.env.AUTH_LOCAL_CERTIFICATION_LOCATION,
      process.env.AUTH_LOCAL_SIGNING_KEY,
    ),
    payload: user,
  });

  ctx.state = {
    ...ctx.state,
    __user__: user,
    __access_token__: token,
  };
  await next();
};
