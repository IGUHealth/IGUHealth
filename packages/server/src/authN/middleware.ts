import Koa, { Middleware } from "koa";

import jwt from "koa-jwt";
import jwksRsa from "jwks-rsa";

import { createCertsIfNoneExists, getJWKS } from "./certifications.js";
import { IGUHEALTH_ISSUER } from "./token.js";
import { Tenant } from "../fhir/context.js";

export async function createValidateUserJWTMiddleware<T, C>(): Promise<
  Koa.Middleware<T, C>
> {
  let IGUHEALTH_JWT_SECRET: ReturnType<typeof jwksRsa.koaJwtSecret> | undefined;
  if (process.env.AUTH_SIGNING_KEY && process.env.AUTH_CERTIFICATION_LOCATION) {
    if (process.env.NODE_ENV === "development")
      await createCertsIfNoneExists(
        process.env.AUTH_CERTIFICATION_LOCATION,
        process.env.AUTH_SIGNING_KEY
      );

    const jwks = await getJWKS(process.env.AUTH_CERTIFICATION_LOCATION);

    IGUHEALTH_JWT_SECRET = jwksRsa.koaJwtSecret({
      jwksUri: "_not_used",
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 2,
      fetcher: async (_uri) => {
        return jwks;
      },
    });
  }

  const EXTERNAL_JWT_SECRET = jwksRsa.koaJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 2,
    jwksUri: process.env.AUTH_JWK_URI as string,
  });

  return jwt({
    tokenKey: "access_token",
    secret: async (header: jwksRsa.TokenHeader, payload: { iss: string }) => {
      switch (payload.iss) {
        case process.env.AUTH_JWT_ISSUER: {
          return EXTERNAL_JWT_SECRET(header);
        }
        case IGUHEALTH_ISSUER: {
          if (IGUHEALTH_JWT_SECRET) return IGUHEALTH_JWT_SECRET(header);
          throw new Error("IGUHealth issuer is not configured");
        }
        default:
          throw new Error(`Unknown issuer '${payload.iss}'`);
      }
    },
    audience: process.env.AUTH_JWT_AUDIENCE,
    issuer: process.env.AUTH_JWT_ISSUER
      ? [process.env.AUTH_JWT_ISSUER, IGUHEALTH_ISSUER]
      : [IGUHEALTH_ISSUER],
    algorithms: [
      process.env.AUTH_JWT_ALGORITHM ? process.env.AUTH_JWT_ALGORITHM : "RS256",
    ],
  }) as unknown as Middleware<T, C>;
}

export const allowPublicAccessMiddleware: Koa.Middleware = async (
  ctx,
  next
) => {
  ctx.state = {
    ...ctx.state,
    user: {
      iss: IGUHEALTH_ISSUER,
      sub: "public-user",
      access_token: "sec-public",
      "https://iguhealth.app/tenants": [
        { id: ctx.params.tenant, userRole: "SUPER_ADMIN" } as Tenant,
      ],
    },
  };
  await next();
};
