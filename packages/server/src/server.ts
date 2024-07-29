import { bodyParser } from "@koa/bodyparser";
import cors from "@koa/cors";
import Router from "@koa/router";
import Koa from "koa";
import koaCompress from "koa-compress";
import helmet from "koa-helmet";
import mount from "koa-mount";
import redisStore from "koa-redis";
import session from "koa-session";
import serve from "koa-static";
import path from "node:path";
import zlib from "node:zlib";
import React from "react";
import { fileURLToPath } from "url";
import * as db from "zapatos/db";

import { AsynchronousClient } from "@iguhealth/client";
import { FHIRResponse } from "@iguhealth/client/types";
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
import * as authN from "./authN/middleware.js";
import { JWKS_GET } from "./authN/oidc/constants.js";
import { createOIDCRouter } from "./authN/oidc/index.js";
import { setAllowSignup } from "./authN/oidc/middleware/allow_signup.js";
import { injectTenantManagement } from "./authN/oidc/middleware/inject_management.js";
import { wellKnownSmartGET } from "./authN/oidc/routes/well_known.js";
import { verifyAndAssociateUserFHIRContext } from "./authZ/middleware/tenantAccess.js";
import RedisCache from "./cache/providers/redis.js";
import createEmailProvider from "./email/index.js";
import createEncryptionProvider from "./encryption/index.js";
import loadEnv from "./env.js";
import {
  createClient,
  createFHIRAPI,
  createLogger,
  getRedisClient,
} from "./fhir-api/index.js";
import { IGUHealthServerCTX, KoaExtensions, asRoot } from "./fhir-api/types.js";
import {
  deriveFHIRVersion,
  fhirResponseToHTTPResponse,
  httpRequestToFHIRRequest,
} from "./fhir-http/index.js";
import { createPGPool } from "./fhir-storage/providers/postgres/pg.js";
import { TerminologyProvider } from "./fhir-terminology/index.js";
import * as MonitoringSentry from "./monitoring/sentry.js";
import RedisLock from "./synchronization/redis.lock.js";
import { LIB_VERSION } from "./version.js";
import * as views from "./views/index.js";

loadEnv();

function fhirResponseSetKoa(
  ctx: Koa.ParameterizedContext<
    KoaExtensions.IGUHealth,
    KoaExtensions.KoaIGUHealthContext
  >,
  response: FHIRResponse,
) {
  const httpResponse = fhirResponseToHTTPResponse(response);
  ctx.status = httpResponse.status;
  ctx.body = httpResponse.body;
  for (const [key, value] of Object.entries(httpResponse.headers ?? {})) {
    ctx.set(key, value);
  }

  return ctx;
}

/**
 * Koa middleware that handles FHIR API requests. [Note expectation is ctx.state.iguhealth is set.]
 * @returns Koa.Middleware[] that can be used to handle FHIR requests.
 */
async function FHIRAPIKoaMiddleware(
  fhirAPI: AsynchronousClient<unknown, IGUHealthServerCTX>,
): Promise<
  Koa.Middleware<KoaExtensions.IGUHealth, KoaExtensions.KoaIGUHealthContext>
> {
  return async (ctx, next) => {
    let span;
    // @ts-ignore
    const transaction = ctx.__sentry_transaction;
    if (transaction) {
      span = transaction.startChild({
        description: "FHIR MIDDLEWARE",
        op: "fhirserver",
      });
    }

    if (!KoaExtensions.isFHIRServerAuthorizedUserCTX(ctx.state.iguhealth)) {
      throw new Error("FHIR Context is not authorized");
    }

    try {
      const response = await fhirAPI.request(
        ctx.state.iguhealth,
        httpRequestToFHIRRequest(ctx.params.fhirVersion, {
          url: `${ctx.params.fhirUrl || ""}${
            ctx.request.querystring ? `?${ctx.request.querystring}` : ""
          }`,
          method: ctx.request.method,
          body: ctx.request.body,
        }),
      );

      fhirResponseSetKoa(ctx, response);
      await next();
    } finally {
      if (span) {
        span.finish();
      }
    }
  };
}

function createErrorHandlingMiddleware(): Koa.Middleware<
  KoaExtensions.IGUHealth,
  KoaExtensions.KoaIGUHealthContext
> {
  return async function errorHandlingMiddleware(ctx, next) {
    try {
      await next();
    } catch (e) {
      createLogger().error(e);
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
        MonitoringSentry.logError(e);

        // Resend to default koa error handler.
        throw e;
      }
    }
  };
}

export default async function createServer(): Promise<
  Koa<KoaExtensions.IGUHealth, KoaExtensions.KoaIGUHealthContext>
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

  const fhirAPI = await createFHIRAPI();
  const redis = getRedisClient();
  const logger = createLogger();
  const iguhealthServices: Omit<IGUHealthServerCTX, "user" | "tenant"> = {
    db: createPGPool(),
    logger,
    lock: new RedisLock(redis),
    cache: new RedisCache(redis),
    terminologyProvider: new TerminologyProvider(),
    encryptionProvider: createEncryptionProvider(),
    emailProvider: createEmailProvider(),
    ...createClient(),
  };

  const app = new Koa<
    KoaExtensions.IGUHealth,
    KoaExtensions.KoaIGUHealthContext
  >({
    proxy: process.env.PROXY === "true",
    proxyIpHeader: process.env.PROXY_IP_HEADER,
  });
  app.use(
    koaCompress({
      // Threshold defaults to 1kb.
      gzip: {
        flush: zlib.constants.Z_SYNC_FLUSH,
      },
      // Disable other compressions and allow only gzip.
      deflate: false,
      br: false,
    }),
  );
  app.use(async (ctx, next) => {
    ctx.state = {
      ...ctx.state,
      iguhealth: { ...ctx.state.iguhealth, ...iguhealthServices },
    };
    await next();
  });

  app.keys = process.env.SESSION_COOKIE_SECRETS.split(":").map((s) => s.trim());

  const rootRouter = new Router<
    KoaExtensions.IGUHealth,
    KoaExtensions.KoaIGUHealthContext
  >();
  rootRouter.use("/", createErrorHandlingMiddleware());
  rootRouter.get(JWKS_GET, "/certs/jwks", async (ctx, next) => {
    const jwks = await getJWKS(getCertLocation());
    ctx.body = jwks;
    await next();
  });

  const authMiddlewares: Koa.Middleware<
    KoaExtensions.IGUHealth,
    KoaExtensions.KoaIGUHealthContext
  >[] = [
    authN.verifyBasicAuth,
    process.env.AUTH_PUBLIC_ACCESS === "true"
      ? authN.allowPublicAccessMiddleware
      : await authN.createValidateUserJWTMiddleware({
          AUTH_LOCAL_CERTIFICATION_LOCATION: getCertLocation(),
        }),
    authN.associateUserToIGUHealth,
    verifyAndAssociateUserFHIRContext,
  ];

  const globalAuth = await createGlobalAuthRouter("/auth", {
    middleware: [
      setAllowSignup(process.env.AUTH_ALLOW_GLOBAL_SIGNUP === "true"),
    ],
  });

  rootRouter.use(globalAuth.routes());
  rootRouter.use(globalAuth.allowedMethods());

  const tenantRouter = new Router<
    KoaExtensions.IGUHealth,
    KoaExtensions.KoaIGUHealthContext
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
      .run(ctx.state.iguhealth.db);

    if (!tenant) {
      throw new OperationError(outcomeError("not-found", "Tenant not found"));
    }

    ctx.state.iguhealth = {
      ...ctx.state.iguhealth,
      tenant: tenant.id as TenantId,
    };

    await next();
  });

  // Instantiate OIDC routes
  const tenantOIDCRouter = await createOIDCRouter<KoaExtensions.IGUHealth>(
    "/oidc",
    {
      authMiddlewares,
      middleware: [
        injectTenantManagement(),
        setAllowSignup(process.env.AUTH_ALLOW_TENANT_SIGNUP === "true"),
      ],
    },
  );

  const tenantAPIV1Router = new Router<
    KoaExtensions.IGUHealth,
    KoaExtensions.KoaIGUHealthContext
  >({
    prefix: "/api/v1",
  });

  // Seperating as this should be a public endpoint for capabilities.
  tenantAPIV1Router.get("/fhir/:fhirVersion/metadata", async (ctx) => {
    ctx.state.iguhealth.cache.get(ctx.state.iguhealth, "capabilities");
    ctx.body = await fhirAPI.capabilities(
      asRoot(ctx.state.iguhealth),
      deriveFHIRVersion(ctx.params.fhirVersion),
    );
  });

  tenantAPIV1Router.get(
    "/fhir/:fhirVersion/.well-known/smart-configuration",
    wellKnownSmartGET(tenantRouter),
  );

  // FHIR API Endpoint
  tenantAPIV1Router.all(
    "/fhir/:fhirVersion/:fhirUrl*",
    ...authMiddlewares,
    await FHIRAPIKoaMiddleware(fhirAPI),
  );

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

      // For development we don't want to log all worker requests.
      if (
        !ctx.state.iguhealth.user?.payload.sub.startsWith("iguhealth-worker") ||
        process.env.NODE_ENV !== "development"
      ) {
        logger.info({
          ip: ctx.ip,
          status: ctx.response.status,
          method: ctx.method,
          url: ctx.url,
          responseTime: rt,
        });
      }
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
