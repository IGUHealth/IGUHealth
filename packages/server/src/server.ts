import { bodyParser } from "@koa/bodyparser";
import cors from "@koa/cors";
import Router from "@koa/router";
import Koa from "koa";
import mount from "koa-mount";
import ratelimit from "koa-ratelimit";
import redisStore from "koa-redis";
import session from "koa-session";
import serve from "koa-static";
import path from "node:path";
import pg from "pg";
import React from "react";
import { fileURLToPath } from "url";

import { FHIROperationOutcomeDisplay } from "@iguhealth/components";
import {
  isOperationError,
  issueSeverityToStatusCodes,
} from "@iguhealth/operation-outcomes";

import { createCertsIfNoneExists } from "./authN/certifications.js";
import { createManagementRouter } from "./authN/management/index.js";
import {
  allowPublicAccessMiddleware,
  createValidateUserJWTMiddleware,
} from "./authN/middleware.js";
import { createOIDCRouter } from "./authN/oidc/routes.js";
import { verifyAndAssociateUserFHIRContext } from "./authZ/middleware/tenantAccess.js";
import loadEnv from "./env.js";
import {
  createFHIRAPI,
  createKoaFHIRContextMiddleware,
  createKoaFHIRServices,
  getRedisClient,
  logger,
} from "./fhir-context/index.js";
import {
  KoaFHIRContext,
  isFHIRServerAuthorizedUserCTX,
} from "./fhir-context/koa.js";
import {
  fhirResponseToHTTPResponse,
  httpRequestToFHIRRequest,
} from "./fhir-http/index.js";
import * as MonitoringSentry from "./monitoring/sentry.js";
import { LIB_VERSION } from "./version.js";
import * as views from "./views/index.js";

loadEnv();

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
  >
> {
  const fhirAPI = await createFHIRAPI();

  return async (ctx, next) => {
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
  };
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
        const status = operationOutcome.issue
          .map((i) => issueSeverityToStatusCodes(i.severity))
          .sort()[operationOutcome.issue.length - 1];

        switch (ctx.accepts("json", "html", "text")) {
          case "json": {
            ctx.body = operationOutcome;
            ctx.status = status;
            return;
          }
          case "text":
          case "html": {
            views.renderPipe(
              ctx,
              React.createElement(FHIROperationOutcomeDisplay, {
                logo: "/public/img/logo.svg",
                title: "IGUHealth",
                operationOutcome,
              }),
            );
            ctx.status = status;
            return;
          }
        }
        throw new Error("Media type not supported");
      } else {
        logger.error(e);
        MonitoringSentry.logError(e, ctx);

        // Resend to default koa error handler.
        throw e;
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

  if (
    process.env.NODE_ENV === "development" &&
    process.env.AUTH_LOCAL_CERTIFICATION_LOCATION &&
    process.env.AUTH_LOCAL_SIGNING_KEY
  ) {
    await createCertsIfNoneExists(
      process.env.AUTH_LOCAL_CERTIFICATION_LOCATION,
      process.env.AUTH_LOCAL_SIGNING_KEY,
    );
  }

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
  app.keys = process.env.SESSION_COOKIE_SECRETS.split(":").map((s) => s.trim());

  const rootRouter = new Router<
    Koa.DefaultState,
    KoaFHIRContext<Koa.DefaultContext>
  >();

  rootRouter.use(
    "/",
    createErrorHandlingMiddleware(),
    await createKoaFHIRServices(pool),
  );

  const managementRouter = createManagementRouter("/management", {
    client: pool,
  });
  rootRouter.use(managementRouter.routes());
  rootRouter.use(managementRouter.allowedMethods());

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

    // Associate FHIR Context for all routes
    // [NOTE] for oidc we pull in fhir data so we need to associate the context on top of non fhir apis.

    await createKoaFHIRContextMiddleware(),
  );

  // Instantiate OIDC routes
  const oidcRouter = createOIDCRouter("/auth/oidc");

  tenantAPIV1Router.use(oidcRouter.routes());
  tenantAPIV1Router.use(oidcRouter.allowedMethods());

  // FHIR API Endpoint
  tenantAPIV1Router.all(
    "/fhir/r4/:fhirUrl*",
    // MonitoringSentry.tracingMiddleWare<KoaFHIRMiddlewareState>(process.env.SENTRY_SERVER_DSN),
    process.env.AUTH_PUBLIC_ACCESS === "true"
      ? allowPublicAccessMiddleware
      : await createValidateUserJWTMiddleware({
          AUTH_LOCAL_CERTIFICATION_LOCATION:
            process.env.AUTH_LOCAL_CERTIFICATION_LOCATION,
          AUTH_LOCAL_SIGNING_KEY: process.env.AUTH_LOCAL_SIGNING_KEY,
          AUTH_EXTERNAL_JWT_ISSUER: process.env.AUTH_EXTERNAL_JWT_ISSUER,
          AUTH_EXTERNAL_JWK_URI: process.env.AUTH_EXTERNAL_JWK_URI,
        }),
    verifyAndAssociateUserFHIRContext,
    await FHIRAPIKoaMiddleware<KoaFHIRMiddlewareState>(),
  );
  tenantRouter.use(tenantAPIV1Router.routes());
  tenantRouter.use(tenantAPIV1Router.allowedMethods());

  rootRouter.use(tenantRouter.routes());
  rootRouter.use(tenantRouter.allowedMethods());

  app
    .use(
      mount(
        "/public",
        serve(
          path.join(path.dirname(fileURLToPath(import.meta.url)), "../public"),
        ),
      ),
    )
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
    .use(
      session(
        {
          prefix: "__koa_session",
          store: redisStore({ client: getRedisClient() }),
        },
        app,
      ),
    )
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
  app.on("error", (e) => {
    logger.error(e);
  });

  logger.info("Running app");

  return app;
}
