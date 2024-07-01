import jwksRsa from "jwks-rsa";
import Koa, { Middleware } from "koa";
import jwt from "koa-jwt";
import * as s from "zapatos/schema";

import { code, id } from "@iguhealth/fhir-types/r4/types";
import { R4 } from "@iguhealth/fhir-types/versions";
import {
  AccessTokenPayload,
  CUSTOM_CLAIMS,
  IGUHEALTH_AUDIENCE,
  IGUHEALTH_ISSUER,
  Subject,
  TenantClaim,
} from "@iguhealth/jwt";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { KoaExtensions, asRoot } from "../fhir-api/types.js";
import { getJWKS } from "./certifications.js";
import {
  authenticateClientCredentials,
  createClientCredentialToken,
  getBasicHeaderCredentials,
} from "./oidc/client_credentials_verification.js";

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
  Context extends KoaExtensions.DefaultContext,
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
    tokenKey: "access_token",
    secret: async (header: jwksRsa.TokenHeader) => {
      return IGUHEALTH_JWT_SECRET(header);
    },
    audience: IGUHEALTH_AUDIENCE,
    issuer: [IGUHEALTH_ISSUER],
    algorithms: ["RS256"],
  }) as unknown as Middleware<T, C>;
}

/**
 * Middleware that allows full system access to all tenants (used on public server)
 * @param ctx Koa.Context
 * @param next Koa.Next
 */
export const allowPublicAccessMiddleware: Koa.Middleware = async (
  ctx,
  next,
) => {
  const user: AccessTokenPayload<s.user_role> = {
    iss: IGUHEALTH_ISSUER,
    sub: "public-user" as Subject,
    access_token: "sec-public",
    [CUSTOM_CLAIMS.RESOURCE_TYPE]: "Membership",
    [CUSTOM_CLAIMS.RESOURCE_ID]: "public" as id,
    [CUSTOM_CLAIMS.TENANTS]: [
      {
        id: ctx.params.tenant,
        userRole: "admin",
      } as TenantClaim<s.user_role>,
    ],
  };
  ctx.state = {
    ...ctx.state,
    user,
  };
  await next();
};
