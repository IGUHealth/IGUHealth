import jwksRsa from "jwks-rsa";
import Koa, { Middleware } from "koa";
import jwt from "koa-jwt";
import * as s from "zapatos/schema";

import { code, id } from "@iguhealth/fhir-types/r4/types";
import { R4 } from "@iguhealth/fhir-types/versions";
import {
  AccessTokenPayload,
  CUSTOM_CLAIMS,
  Subject,
  TenantId,
  createToken,
} from "@iguhealth/jwt";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { KoaExtensions, asRoot } from "../fhir-api/types.js";
import {
  getCertKey,
  getCertLocation,
  getJWKS,
  getSigningKey,
} from "./certifications.js";
import {
  authenticateClientCredentials,
  createClientCredentialToken,
  getBasicHeaderCredentials,
} from "./oidc/client_credentials_verification.js";
import { getIssuer } from "./oidc/constants.js";

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
      ctx.state.iguhealth.tenant,
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
    algorithms: ["RS256"],
  }) as unknown as Middleware<T, C>;
}

/**
 * Move the user JWT to the IGUHealth context
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

  ctx.state.iguhealth.user = {
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
    [CUSTOM_CLAIMS.RESOURCE_TYPE]: "Membership",
    [CUSTOM_CLAIMS.RESOURCE_ID]: "public" as id,
    [CUSTOM_CLAIMS.TENANT]: ctx.params.tenant as TenantId,
    [CUSTOM_CLAIMS.ROLE]: "admin",
  };

  const token = await createToken({
    signingKey: await getSigningKey(getCertLocation(), getCertKey()),
    payload: user,
  });

  ctx.state = {
    ...ctx.state,
    __user__: user,
    __access_token__: token,
  };
  await next();
};
