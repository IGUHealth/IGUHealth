import Koa from "koa";
import Router from "@koa/router";
import ratelimit from "koa-ratelimit";
import { bodyParser } from "@koa/bodyparser";
import cors from "@koa/cors";
import pg from "pg";
import dotEnv from "dotenv";

import {
  isOperationError,
  issueSeverityToStatusCodes,
  outcomeError,
} from "@iguhealth/operation-outcomes";

import { LIB_VERSION } from "./version.js";

import * as Sentry from "./monitoring/sentry.js";
import type { FHIRServerCTX, Workspace } from "./ctx/types.js";
import { createGetCTXFn, getRedisClient, logger } from "./ctx/index.js";
import {
  httpRequestToFHIRRequest,
  fhirResponseToHTTPResponse,
} from "./http/index.js";
import {
  createValidateUserJWTMiddleware,
  allowPublicAccessMiddleware,
} from "./authN/middleware.js";
import { canUserAccessWorkspaceMiddleware } from "./authZ/middleware.js";

dotEnv.config();

async function workspaceMiddleware(
  pool: pg.Pool,
  getCTX: (
    arg: Pick<FHIRServerCTX, "workspace" | "author" | "user_access_token"> & {
      pg: pg.PoolClient;
    }
  ) => FHIRServerCTX
): Promise<Koa.Middleware[]> {
  if (!process.env.AUTH_JWT_ISSUER)
    logger.warn("[WARNING] Server is publicly accessible.");

  return [
    Sentry.tracingMiddleWare(process.env.SENTRY_SERVER_DSN),
    process.env.AUTH_JWT_ISSUER
      ? await createValidateUserJWTMiddleware()
      : allowPublicAccessMiddleware,

    canUserAccessWorkspaceMiddleware,
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
          workspace: ctx.params.workspace as Workspace,
          author: ctx.state.user.sub,
          user_access_token: ctx.state.access_token,
        });

        const fhirServerResponse = await serverCTX.client.request(
          serverCTX,
          httpRequestToFHIRRequest({
            url: `${ctx.params.fhirUrl || ""}${
              ctx.request.querystring ? `?${ctx.request.querystring}` : ""
            }`,
            method: ctx.request.method,
            body: (ctx.request as unknown as Record<string, unknown>).body,
          })
        );

        const httpResponse = fhirResponseToHTTPResponse(fhirServerResponse);

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
  const router = new Router<Koa.DefaultState, Koa.Context>();
  const getCTX = await createGetCTXFn();
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
