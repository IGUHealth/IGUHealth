import { bodyParser } from "@koa/bodyparser";
import cors from "@koa/cors";
import Router from "@koa/router";
import Koa from "koa";
import helmet from "koa-helmet";
import mount from "koa-mount";
import ratelimit from "koa-ratelimit";
import redisStore from "koa-redis";
import session from "koa-session";
import serve from "koa-static";
import path from "node:path";
import React from "react";
import { fileURLToPath } from "url";
import * as db from "zapatos/db";

import { FHIROperationOutcomeDisplay } from "@iguhealth/components";
import { TenantId } from "@iguhealth/jwt";
import {
  OperationError,
  isOperationError,
  issueToStatusCode,
  outcomeError,
} from "@iguhealth/operation-outcomes";

import {
  createCertsIfNoneExists,
  getCertKey,
  getCertLocation,
  getJWKS,
} from "./authN/certifications.js";
import { createGlobalAuthRouter } from "./authN/global/index.js";
import {
  allowPublicAccessMiddleware,
  createValidateUserJWTMiddleware,
  verifyBasicAuth,
} from "./authN/middleware.js";
import { JWKS_GET } from "./authN/oidc/constants.js";
import { createOIDCRouter } from "./authN/oidc/index.js";
import { setAllowSignup } from "./authN/oidc/middleware/allow_signup.js";
import { injectTenantManagement } from "./authN/oidc/middleware/inject_management.js";
import { verifyAndAssociateUserFHIRContext } from "./authZ/middleware/tenantAccess.js";
import loadEnv from "./env.js";
import {
  associateServicesKoaMiddleware,
  createFHIRAPI,
  getRedisClient,
  logger,
} from "./fhir-api/index.js";
import { KoaContext } from "./fhir-api/types.js";
import {
  fhirResponseToHTTPResponse,
  httpRequestToFHIRRequest,
} from "./fhir-http/index.js";
import { createPGPool } from "./fhir-storage/providers/postgres/pg.js";
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
    KoaContext.FHIR<Koa.DefaultContext> &
      Router.RouterParamContext<T, KoaContext.FHIR<Koa.DefaultContext>>
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
    if (!KoaContext.isFHIRServerAuthorizedUserCTX(ctx.FHIRContext)) {
      throw new Error("FHIR Context is not authorized");
    }

    try {
      const response = await fhirAPI.request(
        ctx.FHIRContext,
        httpRequestToFHIRRequest(ctx.params.fhirVersion, {
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
  KoaContext.FHIR<Koa.DefaultContext> &
    Router.RouterParamContext<T, KoaContext.FHIR<Koa.DefaultContext>>
> {
  return async function errorHandlingMiddleware(ctx, next) {
    try {
      await next();
    } catch (e) {
      logger.error(e);
      if (isOperationError(e)) {
        const operationOutcome = e.outcome;
        const status = operationOutcome.issue
          .map((i) => issueToStatusCode(i))
          .sort()[operationOutcome.issue.length - 1];

        switch (ctx.accepts("json", "html", "text")) {
          case "text":
          case "html": {
            ctx.status = status;
            ctx.body = views.renderString(
              React.createElement(FHIROperationOutcomeDisplay, {
                logo: "/public/img/logo.svg",
                title: "IGUHealth",
                operationOutcome,
              }),
            );

            return;
          }
          case "json":
          default: {
            ctx.body = operationOutcome;
            ctx.status = status;
            return;
          }
        }
      } else {
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

  if (process.env.NODE_ENV === "development") {
    await createCertsIfNoneExists(getCertLocation(), getCertKey());
  }

  const pool = createPGPool();

  const app = new Koa();

  app.keys = process.env.SESSION_COOKIE_SECRETS.split(":").map((s) => s.trim());

  const rootRouter = new Router<
    Koa.DefaultState,
    KoaContext.FHIR<Koa.DefaultContext>
  >();

  rootRouter.use(
    "/",
    createErrorHandlingMiddleware(),
    await associateServicesKoaMiddleware(pool),
  );

  rootRouter.get(JWKS_GET, "/certs/jwks", async (ctx, next) => {
    const jwks = await getJWKS(getCertLocation());
    ctx.body = jwks;
    await next();
  });

  const jwtMiddleware = await createValidateUserJWTMiddleware({
    AUTH_LOCAL_CERTIFICATION_LOCATION: getCertLocation(),
  });

  const authMiddlewares = [
    verifyBasicAuth as Koa.Middleware<unknown, unknown, unknown>,
    (process.env.AUTH_PUBLIC_ACCESS === "true"
      ? allowPublicAccessMiddleware
      : jwtMiddleware) as Koa.Middleware<unknown, unknown, unknown>,
    verifyAndAssociateUserFHIRContext as Koa.Middleware<
      unknown,
      unknown,
      unknown
    >,
  ];

  const globalAuth = await createGlobalAuthRouter("/auth", {
    middleware: [
      setAllowSignup(process.env.AUTH_ALLOW_GLOBAL_SIGNUP === "true"),
    ],
  });

  rootRouter.use(globalAuth.routes());
  rootRouter.use(globalAuth.allowedMethods());

  const tenantRouter = new Router<
    Koa.DefaultState,
    KoaContext.FHIR<Koa.DefaultContext>
  >({
    prefix: "/w/:tenant",
  });

  tenantRouter.use("/", async (ctx, next) => {
    if (!ctx.params.tenant)
      throw new OperationError(
        outcomeError("invalid", "No tenant present in request."),
      );

    const tenant = await db
      .selectOne("tenants", { id: ctx.params.tenant }, { columns: ["id"] })
      .run(pool);

    if (!tenant) {
      throw new OperationError(outcomeError("not-found", "Tenant not found"));
    }

    ctx.FHIRContext = {
      ...ctx.FHIRContext,
      tenant: tenant.id as TenantId,
    };

    await next();
  });

  const tenantAPIV1Router = new Router<
    Koa.DefaultState,
    KoaContext.FHIR<Koa.DefaultContext>
  >({
    prefix: "/api/v1",
  });

  // FHIR API Endpoint
  tenantAPIV1Router.all(
    "/fhir/:fhirVersion/:fhirUrl*",
    // MonitoringSentry.tracingMiddleWare<KoaFHIRMiddlewareState>(process.env.SENTRY_SERVER_DSN),
    ...authMiddlewares,
    await FHIRAPIKoaMiddleware<KoaFHIRMiddlewareState>(),
  );

  // Instantiate OIDC routes
  const tenantOIDCRouter = await createOIDCRouter<
    KoaContext.FHIR<Koa.DefaultContext>
  >("/oidc", {
    authMiddlewares,
    middleware: [
      injectTenantManagement(),
      setAllowSignup(process.env.AUTH_ALLOW_TENANT_SIGNUP === "true"),
      // Inject tenant.
      async (ctx, next) => {
        ctx.oidc = {
          ...ctx.oidc,
          tenant: ctx.FHIRContext.tenant,
        };
        await next();
      },
    ],
  });

  tenantRouter.use(tenantOIDCRouter.routes());
  tenantRouter.use(tenantOIDCRouter.allowedMethods());
  tenantRouter.use(tenantAPIV1Router.routes());
  tenantRouter.use(tenantAPIV1Router.allowedMethods());

  rootRouter.use(tenantRouter.routes());
  rootRouter.use(tenantRouter.allowedMethods());

  app
    .use(
      helmet({
        contentSecurityPolicy: {
          // See https://github.com/w3c/webappsec-csp/issues/8
          // Not compatible with redirect on OIDC
          directives: {
            "form-action": null,
            "style-src": "'self'",
            "default-src": "none",
          },
        },
      }),
    )
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
    .use(
      bodyParser({
        extendTypes: {
          // will parse application/fhir+json type body as a JSON string
          json: ["application/fhir+json", "application/json"],
        },
        encoding: "utf-8",
      }),
    )
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
      logger.info({
        status: ctx.response.status,
        method: ctx.method,
        url: ctx.url,
        responseTime: rt,
      });
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
