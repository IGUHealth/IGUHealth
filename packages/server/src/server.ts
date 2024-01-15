import Koa from "koa";
import Router from "@koa/router";
import ratelimit from "koa-ratelimit";
import { bodyParser } from "@koa/bodyparser";
import cors from "@koa/cors";
import pg from "pg";
import dotEnv from "dotenv";
import type * as Sentry from "@sentry/node";

import {
  isOperationError,
  issueSeverityToStatusCodes,
  outcomeError,
} from "@iguhealth/operation-outcomes";

import { LIB_VERSION } from "./version.js";

import * as MonitoringSentry from "./monitoring/sentry.js";
import {
  createFHIRServer,
  createKoaFHIRMiddleware,
  getRedisClient,
  logger,
} from "./fhir/index.js";
import {
  httpRequestToFHIRRequest,
  fhirResponseToHTTPResponse,
} from "./http/index.js";
import {
  createValidateUserJWTMiddleware,
  allowPublicAccessMiddleware,
} from "./authN/middleware.js";
import { canUserAccessTenantMiddleware } from "./authZ/middleware/tenantAccess.js";
import { FHIRServerCTX } from "./fhir/context.js";

dotEnv.config();

interface KoaFHIRMiddlewareState extends Koa.DefaultState {
  user: { [key: string]: unknown };
  access_token: string;
}

interface IGUHealthKoaBaseContext extends Koa.BaseContext {
  FHIRContext: FHIRServerCTX;
  __sentry_transaction?: Sentry.Transaction;
}

async function KoaFHIRMiddleware<T extends KoaFHIRMiddlewareState>(
  pool: pg.Pool
): Promise<
  Koa.Middleware<
    T,
    IGUHealthKoaBaseContext &
      Router.RouterParamContext<T, IGUHealthKoaBaseContext>
  >[]
> {
  if (!process.env.AUTH_JWT_ISSUER)
    logger.warn("[WARNING] Server is publicly accessible.");
  const fhirServer = await createFHIRServer();

  return [
    MonitoringSentry.tracingMiddleWare(process.env.SENTRY_SERVER_DSN),
    process.env.AUTH_JWT_ISSUER
      ? await createValidateUserJWTMiddleware()
      : allowPublicAccessMiddleware,
    canUserAccessTenantMiddleware,
    await createKoaFHIRMiddleware(pool),
    async (ctx, next) => {
      let span;
      const transaction = ctx.__sentry_transaction;
      if (transaction) {
        span = transaction.startChild({
          description: "FHIR MIDDLEWARE",
          op: "fhirserver",
        });
      }

      try {
        const response = await fhirServer.request(
          ctx.FHIRContext,
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
          MonitoringSentry.logError(e, ctx);

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
    MonitoringSentry.enableSentry(process.env.SENTRY_SERVER_DSN, LIB_VERSION, {
      tracesSampleRate: parseFloat(
        process.env.SENTRY_TRACES_SAMPLE_RATE || "0.1"
      ),
      profilesSampleRate: parseFloat(
        process.env.SENTRY_PROFILES_SAMPLE_RATE || "0.1"
      ),
    });

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

  const app = new Koa();
  const router = new Router<Koa.DefaultState, IGUHealthKoaBaseContext>();
  const tenantRoutes = new Router<Koa.DefaultState, IGUHealthKoaBaseContext>({
    prefix: "/w/:tenant/",
  });
  const tenantaAPIV1 = new Router<Koa.DefaultState, IGUHealthKoaBaseContext>({
    prefix: "api/v1/",
  });
  tenantaAPIV1.use();
  const fhirR4API = new Router<Koa.DefaultState, IGUHealthKoaBaseContext>({
    prefix: "fhir/r4",
  });
  fhirR4API.all(
    "/:fhirUrl*",
    ...(await KoaFHIRMiddleware<KoaFHIRMiddlewareState>(pool))
  );

  router.get("/", (ctx) => {});

  tenantaAPIV1.use(fhirR4API.routes());
  tenantaAPIV1.use(fhirR4API.allowedMethods());
  tenantRoutes.use(tenantaAPIV1.routes());
  tenantRoutes.use(tenantaAPIV1.allowedMethods());
  router.use(tenantRoutes.routes());
  router.use(tenantRoutes.allowedMethods());

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

  app.on("error", MonitoringSentry.onKoaError);

  return app;
}
