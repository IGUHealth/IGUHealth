import Koa, { DefaultContext, DefaultState, Middleware } from "koa";
import Router from "@koa/router";
import { bodyParser } from "@koa/bodyparser";
import Redis from "ioredis";
import ratelimit from "koa-ratelimit";

import dotEnv from "dotenv";

import pg from "pg";
import jwt from "koa-jwt";
import jwksRsa from "jwks-rsa";
import cors from "@koa/cors";
// import * as jose from "jose";
// import path from "path";
// import { fileURLToPath } from "url";
// import Provider from "oidc-provider";
// import mount from "koa-mount";
// import Account from "./oidc-provider/accounts.js";
// import configuration from "./oidc-provider/configuration.js";
// import routes from "./oidc-provider/routes.js";
// import { loadJWKS } from "./auth/jwks.js";

import {
  isOperationError,
  issueSeverityToStatusCodes,
  outcomeError,
} from "@iguhealth/operation-outcomes";

import type { FHIRServerCTX } from "./fhirServer.js";
import { deriveCTX, logger } from "./ctx/index.js";
import createFHIRServer from "./fhirServer.js";
import {
  KoaRequestToFHIRRequest,
  fhirResponseToKoaResponse,
} from "./koaParsing/index.js";

dotEnv.config();

// const { PORT = 3000, ISSUER = `http://localhost:${PORT}` } = process.env;
// configuration.findAccount = Account.findAccount;

// const { jwks, privateKey } = await loadJWKS(
//   path.join(fileURLToPath(import.meta.url), "../../certifications"),
//   "jwks"
// );

// const signedJWT = await new jose.SignJWT({ "urn:example:claim": true })
//   .setProtectedHeader({ alg: "RS256" })
//   .setIssuedAt()
//   .setIssuer("urn:example:issuer")
//   .setAudience("urn:example:audience")
//   .setExpirationTime("2h")
//   .sign(privateKey);

// console.log(signedJWT);
// console.log(jose.decodeJwt(signedJWT));
// console.log(await jose.jwtVerify(signedJWT, jwks));

// apply rate limit

const RATE_LIMIT = ratelimit({
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
  max: 100,
  disableHeader: false,
  // whitelist: (ctx) => {
  //   // some logic that returns a boolean
  // },
  // blacklist: (ctx) => {
  //   // some logic that returns a boolean
  // },
});

function createCheckJWT(): Middleware<DefaultState, DefaultContext, unknown> {
  const LOAD_EXTERNAL_TOKEN = jwksRsa.koaJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 2,
    jwksUri: process.env.AUTH_JWK_URI as string,
  });
  return jwt({
    tokenKey: "access_token",
    secret: (header: jwksRsa.TokenHeader) => {
      return LOAD_EXTERNAL_TOKEN(header);
    },
    audience: process.env.AUTH_JWT_AUDIENCE,
    issuer: process.env.AUTH_JWT_ISSUER ? [process.env.AUTH_JWT_ISSUER] : [],
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

function workspaceMiddleware(
  pool: pg.Pool,
  getCTX: (
    arg: Pick<FHIRServerCTX, "workspace" | "author" | "user_access_token"> & {
      pg: pg.PoolClient;
    }
  ) => FHIRServerCTX
): Router.Middleware<Koa.DefaultState, Koa.DefaultContext, unknown>[] {
  const fhirServer = createFHIRServer();

  if (!process.env.AUTH_JWT_ISSUER)
    logger.warn("[WARNING] Server is publicly accessible.");

  return [
    process.env.AUTH_JWT_ISSUER
      ? createCheckJWT()
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
      const client = await pool.connect();

      try {
        const serverCTX = getCTX({
          pg: client,
          workspace: ctx.params.workspace,
          author: ctx.state.user.sub,
          user_access_token: ctx.state.access_token,
        });

        const fhirServerResponse = await fhirServer(
          KoaRequestToFHIRRequest(
            `${ctx.params.fhirUrl || ""}${ctx.request.querystring ? "?" : ""}${
              ctx.request.querystring
            }`,
            {
              method: ctx.request.method,
              body: (ctx.request as unknown as Record<string, unknown>).body,
            }
          ),
          {
            state: undefined,
            ctx: serverCTX,
          }
        );
        const koaResponse = fhirResponseToKoaResponse(
          fhirServerResponse.response
        );
        if (koaResponse.headers) {
          ctx.set(koaResponse.headers as Record<string, string>);
          delete koaResponse.headers;
        }
        Object.keys(koaResponse).map(
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
        client.release();
      }
    },
  ];
}

export default async function createServer(): Promise<
  Koa<Koa.DefaultState, Koa.DefaultContext>
> {
  const app = new Koa();
  const router = new Router();
  const getCTX = await deriveCTX();
  const pool = new pg.Pool({
    user: process.env["FHIR_DATABASE_USERNAME"],
    password: process.env["FHIR_DATABASE_PASSWORD"],
    host: process.env["FHIR_DATABASE_HOST"],
    database: process.env["FHIR_DATABASE_NAME"],
    port: parseInt(process.env["FHIR_DATABASE_PORT"] || "5432"),
    ssl: process.env["FHIR_DATABASE_SSL"] === "true",
  });

  router.all(
    "/w/:workspace/api/v1/fhir/r4/:fhirUrl*",
    ...workspaceMiddleware(pool, getCTX)
  );

  // TODO Use an adapter  adapter,
  //const provider = new Provider(ISSUER, { ...configuration });

  app
    .use(RATE_LIMIT)
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

  return app;
}
