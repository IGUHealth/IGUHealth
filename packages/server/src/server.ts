import Koa, { DefaultContext, DefaultState, Middleware } from "koa";
import Router from "@koa/router";
import { default as bodyParser } from "@koa/bodyparser";

import dotEnv from "dotenv";

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

import createServiceCTX from "./ctx/index.js";
import createFHIRServer from "./fhirServer.js";
import {
  KoaRequestToFHIRRequest,
  fhirResponseToKoaResponse,
} from "./koaParsing/index.js";

dotEnv.config();

console.log("parser:", bodyParser);

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

const createCheckJWT = () =>
  jwt({
    secret: jwksRsa.koaJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 2,
      jwksUri: process.env.AUTH_JWK_URI as string,
    }),
    audience: process.env.AUTH_JWT_AUDIENCE,
    issuer: process.env.AUTH_JWT_ISSUER,
    algorithms: [
      process.env.AUTH_JWT_ALGORITHM ? process.env.AUTH_JWT_ALGORITHM : "RS256",
    ],
  }) as unknown as Middleware<DefaultState, DefaultContext, any>;

async function workspaceCheck(
  ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>,
  next: Koa.Next
) {
  if (!ctx.params.workspace) {
    ctx.throw(400, "workspace is required");
  }
  if (
    !(ctx.state.user["https://iguhealth.app/workspaces"] as string[]).includes(
      ctx.params.workspace
    )
  ) {
    ctx.throw(403, "workspace is not authorized");
  }

  return next();
}

function workspaceMiddleware(
  services: ReturnType<typeof createServiceCTX>
): Router.Middleware<Koa.DefaultState, Koa.DefaultContext, unknown>[] {
  const fhirServer = createFHIRServer();

  return [
    process.env.AUTH_JWT_ISSUER
      ? createCheckJWT()
      : async (ctx, next) => {
          services.logger.warn("[WARNING] Server is publicly accessible.");
          ctx.state = {
            ...ctx.state,
            user: {
              sub: "public-user",
              "https://iguhealth.app/workspaces": [ctx.params.workspace],
            },
          };
          await next();
        },
    workspaceCheck,
    async (ctx, next) => {
      try {
        const serverCTX = {
          ...services,
          workspace: ctx.params.workspace,
          author: ctx.state.user.sub,
        };

        const fhirServerResponse = await fhirServer(
          KoaRequestToFHIRRequest(
            `${ctx.params.fhirUrl || ""}${ctx.request.querystring ? "?" : ""}${
              ctx.request.querystring
            }`,
            ctx.request
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
          services.logger.error(e);
          const operationOutcome = outcomeError(
            "invalid",
            "internal server error"
          );
          ctx.status = operationOutcome.issue
            .map((i) => issueSeverityToStatusCodes(i.severity))
            .sort()[operationOutcome.issue.length - 1];
          ctx.body = operationOutcome;
        }
      }
    },
  ];
}

export default function createServer(): Koa<
  Koa.DefaultState,
  Koa.DefaultContext
> {
  const app = new Koa();

  const router = new Router();
  const services = createServiceCTX();

  router.all(
    "/w/:workspace/api/v1/fhir/r4/:fhirUrl*",
    ...workspaceMiddleware(services)
  );

  // TODO Use an adapter  adapter,
  //const provider = new Provider(ISSUER, { ...configuration });

  app
    .use(cors())
    //@ts-ignore
    .use(bodyParser())
    // .use(routes(provider).routes())
    // .use(mount(provider.app))

    .use(async (ctx, next) => {
      await next();
      const rt = ctx.response.get("X-Response-Time");
      services.logger.info(`${ctx.method} ${ctx.url} - ${rt}`);
    })
    .use(async (ctx, next) => {
      const start = Date.now();
      await next();
      const ms = Date.now() - start;
      ctx.set("X-Response-Time", `${ms}ms`);
    })
    .use(router.routes())
    .use(router.allowedMethods());

  services.logger.info("Running app");

  return app;
}
