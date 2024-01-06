import Koa from "koa";
import Router from "@koa/router";
import ratelimit from "koa-ratelimit";
import { bodyParser } from "@koa/bodyparser";
import cors from "@koa/cors";
import pg from "pg";
import dotEnv from "dotenv";

import {
  OperationError,
  isOperationError,
  issueSeverityToStatusCodes,
  outcomeError,
  outcomeFatal,
} from "@iguhealth/operation-outcomes";

import { LIB_VERSION } from "./version.js";
import RedisLock from "./synchronization/redis.lock.js";
import * as Sentry from "./monitoring/sentry.js";
import { createFHIRServer, getRedisClient, logger } from "./fhir/index.js";
import {
  httpRequestToFHIRRequest,
  fhirResponseToHTTPResponse,
} from "./http/index.js";
import {
  createValidateUserJWTMiddleware,
  allowPublicAccessMiddleware,
} from "./authN/middleware.js";
import {
  canUserAccessTenantMiddleware,
  findCurrentTenant,
} from "./authZ/middleware.js";
import RedisCache from "./cache/redis.js";

dotEnv.config();

async function KoaFHIRMiddleware(pool: pg.Pool): Promise<Koa.Middleware[]> {
  if (!process.env.AUTH_JWT_ISSUER)
    logger.warn("[WARNING] Server is publicly accessible.");
  const redis = getRedisClient();
  const fhirServer = await createFHIRServer({
    pool,
    lock: new RedisLock(redis),
    cache: new RedisCache(redis),
    logger,
  });

  return [
    Sentry.tracingMiddleWare(process.env.SENTRY_SERVER_DSN),
    process.env.AUTH_JWT_ISSUER
      ? await createValidateUserJWTMiddleware()
      : allowPublicAccessMiddleware,
    canUserAccessTenantMiddleware,
    async (ctx, next) => {
      let span;
      const transaction = ctx.__sentry_transaction;
      if (transaction) {
        span = transaction.startChild({
          description: "FHIR MIDDLEWARE",
          op: "fhirserver",
        });
      }
      const tenant = findCurrentTenant(ctx);
      if (!tenant) throw new Error("Error tenant does not exist in context!");
      try {
        if (
          typeof ctx.state.user.sub !== "string" ||
          typeof ctx.state.user.iss !== "string"
        )
          throw new OperationError(
            outcomeFatal("security", "JWT must have both sub and iss.")
          );
        const response = await fhirServer.request(
          {
            tenant,
            user: { jwt: ctx.state.user, accessToken: ctx.state.access_token },
          },
          httpRequestToFHIRRequest({
            url: `${ctx.params.fhirUrl || ""}${
              ctx.request.querystring ? `?${ctx.request.querystring}` : ""
            }`,
            method: ctx.request.method,
            body: (ctx.request as unknown as Record<string, unknown>).body,
          })
        );

        const httpResponse = fhirResponseToHTTPResponse(response);

        ctx.status = httpResponse.status;
        ctx.body = httpResponse.body;
        for (const [key, value] of Object.entries(httpResponse.headers ?? {})) {
          ctx.set(key, value);
        }

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
  const router = new Router<Koa.DefaultState, Koa.Context>();

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
    "/w/:tenant/api/v1/fhir/r4/:fhirUrl*",
    ...(await KoaFHIRMiddleware(pool))
  );

  // TODO Use an adapter  adapter,
  //const provider = new Provider(ISSUER, { ...configuration });

  app
    .use(
      ratelimit({
        driver: "redis",
        db: getRedisClient(),
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
