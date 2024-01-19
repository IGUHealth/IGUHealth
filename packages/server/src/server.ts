import { bodyParser } from "@koa/bodyparser";
import cors from "@koa/cors";
import Router from "@koa/router";
import dotEnv from "dotenv";
import Koa from "koa";
import ratelimit from "koa-ratelimit";
import pg from "pg";

import {
  isOperationError,
  issueSeverityToStatusCodes,
  outcomeError,
} from "@iguhealth/operation-outcomes";

import {
  allowPublicAccessMiddleware,
  createValidateUserJWTMiddleware,
} from "./authN/middleware.js";
import { createOIDCRouter } from "./authN/oauth2/operations.js";
import { verifyAndAssociateUserFHIRContext } from "./authZ/middleware/tenantAccess.js";
import {
  createFHIRAPI,
  createKoaFHIRContextMiddleware,
  getRedisClient,
  logger,
} from "./fhir/index.js";
import { KoaFHIRContext, isFHIRServerAuthorizedUserCTX } from "./fhir/koa.js";
import {
  fhirResponseToHTTPResponse,
  httpRequestToFHIRRequest,
} from "./http/index.js";
import * as MonitoringSentry from "./monitoring/sentry.js";
import { LIB_VERSION } from "./version.js";

dotEnv.config();

interface KoaFHIRMiddlewareState extends Koa.DefaultState {
  user: { [key: string]: unknown };
  access_token: string;
}

/**
 * Koa middleware that handles FHIR API requests. [Note expectation is ctx.FHIRContext is set.]
 * @returns Koa.Middleware[] that can be used to handle FHIR requests.
 */
async function FHIRAPIKoaMiddleware<
  T extends KoaFHIRMiddlewareState,
>(): Promise<
  Koa.Middleware<
    T,
    KoaFHIRContext<Koa.DefaultContext> &
      Router.RouterParamContext<T, KoaFHIRContext<Koa.DefaultContext>>
  >[]
> {
  if (!process.env.AUTH_JWT_ISSUER)
    logger.warn("[WARNING] Server is publicly accessible.");
  const fhirAPI = await createFHIRAPI();

  return [
    MonitoringSentry.tracingMiddleWare(process.env.SENTRY_SERVER_DSN),
    process.env.AUTH_JWT_ISSUER
      ? await createValidateUserJWTMiddleware()
      : allowPublicAccessMiddleware,
    verifyAndAssociateUserFHIRContext,

    async (ctx, next) => {
      let span;
      const transaction = ctx.__sentry_transaction;
      if (transaction) {
        span = transaction.startChild({
          description: "FHIR MIDDLEWARE",
          op: "fhirserver",
        });
      }
      if (!isFHIRServerAuthorizedUserCTX(ctx.FHIRContext)) {
        throw new Error("FHIR Context is not authorized");
      }

      try {
        const response = await fhirAPI.request(
          ctx.FHIRContext,
          httpRequestToFHIRRequest({
            url: `${ctx.params.fhirUrl || ""}${
              ctx.request.querystring ? `?${ctx.request.querystring}` : ""
            }`,
            method: ctx.request.method,
            body: (ctx.request as unknown as Record<string, unknown>).body,
          }),
        );
        const httpResponse = fhirResponseToHTTPResponse(response);
        ctx.status = httpResponse.status;
        ctx.body = httpResponse.body;
        for (const [key, value] of Object.entries(httpResponse.headers ?? {})) {
          ctx.set(key, value);
        }
        await next();
      } finally {
        if (span) {
          span.finish();
        }
      }
    },
  ];
}

function createErrorHandlingMiddleware<T>(): Koa.Middleware<
  T,
  KoaFHIRContext<Koa.DefaultContext> &
    Router.RouterParamContext<T, KoaFHIRContext<Koa.DefaultContext>>
> {
  return async function errorHandlingMiddleware(ctx, next) {
    try {
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
          "internal server error",
        );
        ctx.status = operationOutcome.issue
          .map((i) => issueSeverityToStatusCodes(i.severity))
          .sort()[operationOutcome.issue.length - 1];
        ctx.body = operationOutcome;
      }
    }
  };
}

export default async function createServer(): Promise<
  Koa<Koa.DefaultState, Koa.DefaultContext>
> {
  if (process.env.SENTRY_SERVER_DSN)
    MonitoringSentry.enableSentry(process.env.SENTRY_SERVER_DSN, LIB_VERSION, {
      tracesSampleRate: parseFloat(
        process.env.SENTRY_TRACES_SAMPLE_RATE || "0.1",
      ),
      profilesSampleRate: parseFloat(
        process.env.SENTRY_PROFILES_SAMPLE_RATE || "0.1",
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
  const rootRouter = new Router<
    Koa.DefaultState,
    KoaFHIRContext<Koa.DefaultContext>
  >();

  const tenantRouter = new Router<
    Koa.DefaultState,
    KoaFHIRContext<Koa.DefaultContext>
  >({
    prefix: "/w/:tenant",
  });

  const tenantAPIV1Router = new Router<
    Koa.DefaultState,
    KoaFHIRContext<Koa.DefaultContext>
  >({
    prefix: "/api/v1",
  });

  tenantAPIV1Router.use(
    "/",
    // Error handling middleware. Checks for OperationError and converts to OperationOutcome with status based on level and/or code.
    createErrorHandlingMiddleware(),
    // Associate FHIR Context for all routes
    // [NOTE] for oidc we pull in fhir data so we need to associate the context on top of non fhir apis.
    await createKoaFHIRContextMiddleware(pool),
  );

  // Instantiate OIDC routes
  const oidcRouter = createOIDCRouter();
  tenantAPIV1Router.use(oidcRouter.routes());
  tenantAPIV1Router.use(oidcRouter.allowedMethods());

  // FHIR API Endpoint
  tenantAPIV1Router.all(
    "/fhir/r4/:fhirUrl*",
    ...(await FHIRAPIKoaMiddleware<KoaFHIRMiddlewareState>()),
  );
  tenantRouter.use(tenantAPIV1Router.routes());
  tenantRouter.use(tenantAPIV1Router.allowedMethods());

  rootRouter.use(tenantRouter.routes());
  rootRouter.use(tenantRouter.allowedMethods());

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
      }),
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
    .use(rootRouter.routes())
    .use(rootRouter.allowedMethods());

  app.on("error", MonitoringSentry.onKoaError);

  logger.info("Running app");

  return app;
}
