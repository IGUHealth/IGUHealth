import Koa, { DefaultContext, DefaultState, Middleware } from "koa";
import Router from "@koa/router";
import ratelimit from "koa-ratelimit";
import { bodyParser } from "@koa/bodyparser";
import cors from "@koa/cors";
import Redis from "ioredis";
import pg from "pg";
import jwt from "koa-jwt";
import jwksRsa from "jwks-rsa";
import dotEnv from "dotenv";

import {
  isOperationError,
  issueSeverityToStatusCodes,
  outcomeError,
} from "@iguhealth/operation-outcomes";

import { IGUHEALTH_ISSUER } from "./auth/token.js";
import { LIB_VERSION } from "./version.js";
import * as Sentry from "./monitoring/sentry.js";
import type { FHIRServerCTX } from "./ctx/types.js";
import { deriveCTX, logger } from "./ctx/index.js";
import {
  KoaRequestToFHIRRequest,
  fhirResponseToKoaResponse,
} from "./koaParsing/index.js";
import { createCertsIfNoneExists, getJWKS } from "./auth/certifications.js";

dotEnv.config();

async function createCheckJWT(): Promise<
  Middleware<DefaultState, DefaultContext, unknown>
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
      fetcher: async (uri) => {
        return jwks;
      },
    });

    // console.log(
    //   await createToken(
    //     await getSigningKey(
    //       process.env.AUTH_CERTIFICATION_LOCATION,
    //       process.env.AUTH_SIGNING_KEY
    //     ),
    //     {
    //       "https://iguhealth.app/workspaces": ["system"],
    //       sub: "iguhealth-system",
    //       aud: ["https://iguhealth.com/api"],
    //       scope: "openid profile email offline_access",
    //     }
    //   )
    // );
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
  }) as unknown as Middleware<DefaultState, DefaultContext, unknown>;
}

async function workspaceCheck(
  ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>,
  next: Koa.Next
) {
  if (!ctx.params.workspace) {
    ctx.throw(400, "workspace is required");
  }
  if (
    !ctx.state.user["https://iguhealth.app/workspaces"]?.includes(
      ctx.params.workspace
    )
  ) {
    ctx.throw(403, "workspace is not authorized");
  }

  return next();
}

async function workspaceMiddleware(
  pool: pg.Pool,
  getCTX: (
    arg: Pick<FHIRServerCTX, "workspace" | "author" | "user_access_token"> & {
      pg: pg.PoolClient;
    }
  ) => FHIRServerCTX
): Promise<Router.Middleware<Koa.DefaultState, Koa.DefaultContext, unknown>[]> {
  if (!process.env.AUTH_JWT_ISSUER)
    logger.warn("[WARNING] Server is publicly accessible.");

  return [
    Sentry.tracingMiddleWare(process.env.SENTRY_SERVER_DSN),
    process.env.AUTH_JWT_ISSUER
      ? await createCheckJWT()
      : async (ctx, next) => {
          ctx.state = {
            ...ctx.state,
            user: {
              sub: "public-user",
              access_token: "sec-public",
              "https://iguhealth.app/workspaces": [ctx.params.workspace],
            },
          };
          await next();
        },
    workspaceCheck,
    async (ctx, next) => {
      let span;
      const transaction = ctx.__sentry_transaction;
      if (transaction) {
        span = transaction.startChild({
          description: "FHIR MIDDLEWARE",
          op: "fhirserver",
        });
      }
      const client = await pool.connect();

      try {
        const serverCTX = getCTX({
          pg: client,
          workspace: ctx.params.workspace,
          author: ctx.state.user.sub,
          user_access_token: ctx.state.access_token,
        });

        const fhirServerResponse = await serverCTX.client.request(
          serverCTX,
          KoaRequestToFHIRRequest(
            `${ctx.params.fhirUrl || ""}${ctx.request.querystring ? "?" : ""}${
              ctx.request.querystring
            }`,
            {
              method: ctx.request.method,
              body: (ctx.request as unknown as Record<string, unknown>).body,
            }
          )
        );

        const koaResponse = fhirResponseToKoaResponse(fhirServerResponse);
        if (koaResponse.headers) {
          ctx.set(koaResponse.headers as Record<string, string>);
          delete koaResponse.headers;
        }
        Object.keys(koaResponse).forEach(
          (k) =>
            (ctx[k as keyof Koa.DefaultContext] =
              koaResponse[k as keyof Partial<Koa.Response>])
        );
        await next();
      } catch (e) {
        if (isOperationError(e)) {
          const operationOutcome = e.outcome;
          ctx.status = operationOutcome.issue
            .map((i) => issueSeverityToStatusCodes(i.severity))
            .sort()[operationOutcome.issue.length - 1];
          ctx.body = operationOutcome;
        } else {
          logger.error(e);
          Sentry.logError(e, ctx);

          const operationOutcome = outcomeError(
            "invalid",
            "internal server error"
          );
          ctx.status = operationOutcome.issue
            .map((i) => issueSeverityToStatusCodes(i.severity))
            .sort()[operationOutcome.issue.length - 1];
          ctx.body = operationOutcome;
        }
      } finally {
        if (span) {
          span.finish();
        }
        client.release();
      }
    },
  ];
}

export default async function createServer(): Promise<
  Koa<Koa.DefaultState, Koa.DefaultContext>
> {
  if (process.env.SENTRY_SERVER_DSN)
    Sentry.enableSentry(process.env.SENTRY_SERVER_DSN, LIB_VERSION, {
      tracesSampleRate: parseFloat(
        process.env.SENTRY_TRACES_SAMPLE_RATE || "0.1"
      ),
      profilesSampleRate: parseFloat(
        process.env.SENTRY_PROFILES_SAMPLE_RATE || "0.1"
      ),
    });
  const app = new Koa();
  const router = new Router();
  const getCTX = await deriveCTX();
  const pool = new pg.Pool({
    user: process.env["FHIR_DATABASE_USERNAME"],
    password: process.env["FHIR_DATABASE_PASSWORD"],
    host: process.env["FHIR_DATABASE_HOST"],
    database: process.env["FHIR_DATABASE_NAME"],
    port: parseInt(process.env["FHIR_DATABASE_PORT"] || "5432"),
    ssl:
      process.env["FHIR_DATABASE_SSL"] === "true"
        ? {
            // Self signed certificate CA is not used.
            rejectUnauthorized: false,
            host: process.env["FHIR_DATABASE_HOST"],
            port: parseInt(process.env["FHIR_DATABASE_PORT"] || "5432"),
          }
        : false,
  });

  router.all(
    "/w/:workspace/api/v1/fhir/r4/:fhirUrl*",
    ...(await workspaceMiddleware(pool, getCTX))
  );

  // TODO Use an adapter  adapter,
  //const provider = new Provider(ISSUER, { ...configuration });

  app
    .use(
      ratelimit({
        driver: "redis",
        db: new Redis.default({
          host: process.env.REDIS_HOST,
          port: parseInt(process.env.REDIS_PORT || "6739"),
        }),
        duration: 60000,
        errorMessage: "Sometimes You Just Have to Slow Down.",
        id: (ctx) => ctx.ip,
        headers: {
          remaining: "Rate-Limit-Remaining",
          reset: "Rate-Limit-Reset",
          total: "Rate-Limit-Total",
        },
        max: process.env.RATE_LIMIT_MAX
          ? parseInt(process.env.RATE_LIMIT_MAX)
          : 100,
        disableHeader: false,
        // whitelist: (ctx) => {
        //   // some logic that returns a boolean
        // },
        // blacklist: (ctx) => {
        //   // some logic that returns a boolean
        // },
      })
    )
    .use(cors())
    .use(bodyParser())
    // .use(routes(provider).routes())
    // .use(mount(provider.app))

    .use(async (ctx, next) => {
      await next();
      const rt = ctx.response.get("X-Response-Time");
      logger.info(`${ctx.method} ${ctx.url} - ${rt}`);
    })
    .use(async (ctx, next) => {
      const start = Date.now();
      await next();
      const ms = Date.now() - start;
      ctx.set("X-Response-Time", `${ms}ms`);
    })
    .use(router.routes())
    .use(router.allowedMethods());

  logger.info("Running app");

  app.on("error", Sentry.onKoaError);

  return app;
}
