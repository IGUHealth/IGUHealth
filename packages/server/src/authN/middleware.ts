import jwksRsa from "jwks-rsa";
import Koa, { Middleware } from "koa";
import jwt from "koa-jwt";
import * as s from "zapatos/schema";

import {
  CUSTOM_CLAIMS,
  IGUHEALTH_AUDIENCE,
  IGUHEALTH_ISSUER,
  TenantClaim,
} from "@iguhealth/jwt";

import { getJWKS } from "./certifications.js";

async function createLocalJWTSecret(
  AUTH_LOCAL_CERTIFICATION_LOCATION: string | undefined,
  AUTH_LOCAL_SIGNING_KEY: string | undefined,
): Promise<ReturnType<typeof jwksRsa.koaJwtSecret> | undefined> {
  if (AUTH_LOCAL_SIGNING_KEY && AUTH_LOCAL_CERTIFICATION_LOCATION) {
    const jwks = await getJWKS(AUTH_LOCAL_CERTIFICATION_LOCATION);
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

  return undefined;
}

function createExternalJWTSecret(
  AUTH_EXTERNAL_JWT_ISSUER: string | undefined,
  AUTH_EXTERNAL_JWK_URI: string | undefined,
): (ReturnType<typeof jwksRsa.koaJwtSecret> & { issuer: string }) | undefined {
  if (AUTH_EXTERNAL_JWT_ISSUER && AUTH_EXTERNAL_JWK_URI) {
    const secret = jwksRsa.koaJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 2,
      jwksUri: AUTH_EXTERNAL_JWK_URI,
    });
    return Object.assign(secret, { issuer: AUTH_EXTERNAL_JWT_ISSUER });
  }
  return undefined;
}

interface ValidateUserJWTMiddlewareOptions {
  AUTH_LOCAL_CERTIFICATION_LOCATION?: string;
  AUTH_LOCAL_SIGNING_KEY?: string;
  AUTH_EXTERNAL_JWK_URI?: string;
  AUTH_EXTERNAL_JWT_ISSUER?: string;
}

/**
 *
 * @returns Koa middleware that validates the user JWT.
 */
export async function createValidateUserJWTMiddleware<T, C>({
  AUTH_LOCAL_CERTIFICATION_LOCATION,
  AUTH_LOCAL_SIGNING_KEY,
  AUTH_EXTERNAL_JWT_ISSUER,
  AUTH_EXTERNAL_JWK_URI,
}: ValidateUserJWTMiddlewareOptions): Promise<Koa.Middleware<T, C>> {
  const IGUHEALTH_JWT_SECRET = await createLocalJWTSecret(
    AUTH_LOCAL_CERTIFICATION_LOCATION,
    AUTH_LOCAL_SIGNING_KEY,
  );

  const EXTERNAL_JWT_SECRET = createExternalJWTSecret(
    AUTH_EXTERNAL_JWT_ISSUER,
    AUTH_EXTERNAL_JWK_URI,
  );

  return jwt({
    tokenKey: "access_token",
    secret: async (header: jwksRsa.TokenHeader, payload: { iss: string }) => {
      switch (true) {
        case EXTERNAL_JWT_SECRET &&
          EXTERNAL_JWT_SECRET?.issuer === payload.iss: {
          if (!EXTERNAL_JWT_SECRET) {
            throw new Error("External JWT secret is not configured");
          }
          return EXTERNAL_JWT_SECRET(header);
        }
        case payload.iss === IGUHEALTH_ISSUER: {
          if (IGUHEALTH_JWT_SECRET) return IGUHEALTH_JWT_SECRET(header);
          throw new Error("IGUHealth issuer is not configured");
        }
        default:
          throw new Error(`Unknown issuer '${payload.iss}'`);
      }
    },
    audience: IGUHEALTH_AUDIENCE,
    issuer: process.env.AUTH_EXTERNAL_JWT_ISSUER
      ? [process.env.AUTH_EXTERNAL_JWT_ISSUER, IGUHEALTH_ISSUER]
      : [IGUHEALTH_ISSUER],
    algorithms: [
      process.env.AUTH_JWT_ALGORITHM ? process.env.AUTH_JWT_ALGORITHM : "RS256",
    ],
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
  ctx.state = {
    ...ctx.state,
    user: {
      iss: IGUHEALTH_ISSUER,
      sub: "public-user",
      access_token: "sec-public",
      [CUSTOM_CLAIMS.RESOURCE_TYPE]: "Membership",
      [CUSTOM_CLAIMS.TENANTS]: [
        {
          id: ctx.params.tenant,
          userRole: "admin",
        } as TenantClaim<s.user_role>,
      ],
    },
  };
  await next();
};
