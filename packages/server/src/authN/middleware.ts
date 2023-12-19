import Koa from "koa";
import type Router from "@koa/router";

import jwt from "koa-jwt";
import jwksRsa from "jwks-rsa";

import { createCertsIfNoneExists, getJWKS } from "./certifications.js";
import { IGUHEALTH_ISSUER } from "./token.js";

export async function createValidateUserJWTMiddleware(): Promise<
  Koa.Middleware<Koa.DefaultState, Koa.DefaultContext, unknown>
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
  }) as unknown as Koa.Middleware<
    Koa.DefaultState,
    Koa.DefaultContext,
    unknown
  >;
}

export const allowPublicAccessMiddleware: Router.Middleware<
  Koa.DefaultState,
  Koa.DefaultContext,
  unknown
> = async (ctx, next) => {
  ctx.state = {
    ...ctx.state,
    user: {
      sub: "public-user",
      access_token: "sec-public",
      "https://iguhealth.app/workspaces": [ctx.params.workspace],
    },
  };
  await next();
};
