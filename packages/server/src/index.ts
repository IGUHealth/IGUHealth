import * as jose from "jose";
import Koa, { DefaultContext, DefaultState, Middleware } from "koa";
import Router from "@koa/router";
import bodyParser from "@koa/bodyparser";
import path from "path";
import dotEnv from "dotenv";
import { fileURLToPath } from "url";
import jwt from "koa-jwt";
import jwksRsa from "jwks-rsa";
import Provider from "oidc-provider";
import mount from "koa-mount";

import { Bundle, Resource } from "@iguhealth/fhir-types/r4/types";
import {
  OperationError,
  isOperationError,
  issueSeverityToStatusCodes,
  outcomeError,
} from "@iguhealth/operation-outcomes";
import { FHIRResponse } from "@iguhealth/client/lib/types";

import createServiceCTX from "./ctx/index.js";
import createFHIRServer from "./fhirServer.js";
import Account from "./oidc-provider/accounts.js";
import configuration from "./oidc-provider/configuration.js";
import routes from "./oidc-provider/routes.js";
import { loadJWKS } from "./auth/jwks.js";
import { KoaRequestToFHIRRequest } from "./fhirRequest/index.js";

dotEnv.config();

const { PORT = 3000, ISSUER = `http://localhost:${PORT}` } = process.env;
configuration.findAccount = Account.findAccount;

const { jwks, privateKey } = await loadJWKS(
  path.join(fileURLToPath(import.meta.url), "../../certifications"),
  "jwks"
);

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

function toBundle(
  bundleType: Bundle["type"],
  total: number | undefined,
  resources: Resource[]
): Bundle {
  return {
    resourceType: "Bundle",
    type: bundleType,
    total: total,
    entry: resources.map((resource) => ({ resource })),
  };
}

function fhirResponseToKoaResponse(
  fhirResponse: FHIRResponse
): Partial<Koa.Response> {
  switch (fhirResponse.type) {
    case "read-response":
    case "vread-response":
      return { body: fhirResponse.body, status: 200 };
    case "update-response":
    case "patch-response":
      return { body: fhirResponse.body, status: 200 };
    case "delete-response":
      return { status: 200 };
    case "history-response":
      return {
        status: 200,
        body: toBundle("history", undefined, fhirResponse.body),
      };
    case "create-response":
      return { body: fhirResponse.body, status: 201 };
    case "search-response": {
      return {
        status: 200,
        body: toBundle("searchset", fhirResponse.total, fhirResponse.body),
      };
    }
    case "capabilities-response":
    case "batch-response":
    case "transaction-response":
      throw new OperationError(
        outcomeError(
          "not-supported",
          `could not convert response to http of type '${fhirResponse.type}'`
        )
      );
    case "invoke-response":
      return { body: fhirResponse.body, status: 200 };
  }
}

const checkJWT: Middleware<DefaultState, DefaultContext, any> = jwt({
  secret: jwksRsa.koaJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 2,
    jwksUri: `http://localhost:3000/jwks`,
  }),
  audience: "https://iguhealth.com/api",
  issuer: "http://localhost:3000",
  algorithms: ["RS256"],
}) as unknown as Middleware<DefaultState, DefaultContext, any>;

function createServer(port: number): Koa<Koa.DefaultState, Koa.DefaultContext> {
  const app = new Koa();

  const fhirServer = createFHIRServer();

  const router = new Router();
  const services = createServiceCTX();

  router.all(
    "/w/:workspace/api/v1/fhir/r4/:fhirUrl*",
    //checkJWT,
    async (ctx, next) => {
      try {
        const serverCTX = {
          ...services,
          workspace: ctx.params.workspace,
          author: "fake-user",
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
        Object.keys(koaResponse).map(
          (k) =>
            (ctx[k as keyof Koa.DefaultContext] =
              koaResponse[k as keyof Partial<Koa.Response>])
        );
        next();
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
    }
  );

  // TODO Use an adapter  adapter,
  //const provider = new Provider(ISSUER, { ...configuration });

  app
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
  app.listen(port);

  return app;
}

createServer(3000);
