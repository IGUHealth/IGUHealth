import jwksRsa from "jwks-rsa";
import Koa, { Middleware } from "koa";
import jwt from "koa-jwt";
import * as s from "zapatos/schema";

import { code, id } from "@iguhealth/fhir-types/r4/types";
import { R4 } from "@iguhealth/fhir-types/versions";
import {
  CUSTOM_CLAIMS,
  IGUHEALTH_AUDIENCE,
  IGUHEALTH_ISSUER,
  TenantClaim,
} from "@iguhealth/jwt";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { KoaContext, asSystemCTX } from "../fhir-api/types.js";
import { getJWKS } from "./certifications.js";
import {
  authenticateClientCredentials,
  createClientCredentialToken,
  getBasicHeaderCredentials,
} from "./client_credentials_verification.js";

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
 * For Basic auth verify and inject a token into the request
 * Will only work for Client Application registered on tenant that allows basic.
 * @param ctx
 * @param next
 */
export async function verifyBasicAuth<
  State extends Koa.DefaultState,
  Context extends KoaContext.FHIR<Koa.DefaultContext>,
>(ctx: Koa.ParameterizedContext<State, Context>, next: Koa.Next) {
  const authHeader = ctx.req.headers.authorization;

  if (authHeader?.startsWith("Basic")) {
    const credentials = getBasicHeaderCredentials(ctx.request);
    if (!credentials) {
      throw new OperationError(
        outcomeError("invalid", "Could not find credentials in request."),
      );
    }

    const clientApplication = await ctx.FHIRContext.client.read(
      asSystemCTX(ctx.FHIRContext),
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
      ctx.FHIRContext.tenant,
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
  ctx.state = {
    ...ctx.state,
    user: {
      iss: IGUHEALTH_ISSUER,
      sub: "public-user",
      access_token: "sec-public",
      [CUSTOM_CLAIMS.RESOURCE_TYPE]: "Membership",
      [CUSTOM_CLAIMS.RESOURCE_ID]: "public",
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
