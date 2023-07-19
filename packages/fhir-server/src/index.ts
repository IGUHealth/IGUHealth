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
import {
  Bundle,
  CapabilityStatement,
  ResourceType,
  Resource,
} from "@iguhealth/fhir-types/r4/types";
import { resourceTypes } from "@iguhealth/fhir-types/r4/sets";
import * as jose from "jose";

import { loadArtifacts } from "@iguhealth/artifacts";
import MemoryDatabase from "./resourceProviders/memory.js";
import RouterDatabase from "./resourceProviders/router.js";
import { FHIRClientSync } from "./client/interface.js";
import createFhirServer, { FHIRServerCTX } from "./fhirServer.js";
import { createPostgresClient } from "./resourceProviders/postgres/index.js";
import { FHIRResponse } from "./client/types";
import {
  OperationError,
  isOperationError,
  issueSeverityToStatusCodes,
  outcomeError,
} from "./operationOutcome/index.js";

import Account from "./oidc-provider/accounts.js";
import configuration from "./oidc-provider/configuration.js";
import routes from "./oidc-provider/routes.js";
import { loadJWKS } from "./auth/jwks.js";

dotEnv.config();

const { PORT = 3000, ISSUER = `http://localhost:${PORT}` } = process.env;
configuration.findAccount = Account.findAccount;

const { jwks, privateKey } = await loadJWKS(
  path.join(fileURLToPath(import.meta.url), "../../certifications"),
  "jwks"
);

const signedJWT = await new jose.SignJWT({ "urn:example:claim": true })
  .setProtectedHeader({ alg: "RS256" })
  .setIssuedAt()
  .setIssuer("urn:example:issuer")
  .setAudience("urn:example:audience")
  .setExpirationTime("2h")
  .sign(privateKey);

console.log(signedJWT);
console.log(jose.decodeJwt(signedJWT));
console.log(await jose.jwtVerify(signedJWT, jwks));

function serverCapabilities(): CapabilityStatement {
  return {
    resourceType: "CapabilityStatement",
    status: "active",
    date: new Date().toDateString(),
    fhirVersion: "r4",
    kind: "capability",
    format: ["json"],
  };
}

function createMemoryDatabase(
  resourceTypes: ResourceType[]
): FHIRClientSync<any> {
  const database = MemoryDatabase<any>({});
  const artifactResources: Resource[] = resourceTypes
    .map((resourceType) =>
      loadArtifacts(
        resourceType,
        path.join(fileURLToPath(import.meta.url), "../../")
      )
    )
    .flat();
  for (const resource of artifactResources) {
    database.create({}, resource);
  }
  return database;
}

function toBundle(bundleType: Bundle["type"], resources: Resource[]): Bundle {
  return {
    resourceType: "Bundle",
    type: bundleType,
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
        body: toBundle("history", fhirResponse.body),
      };
    case "create-response":
      return { body: fhirResponse.body, status: 201 };
    case "search-response": {
      return {
        status: 200,
        body: toBundle("searchset", fhirResponse.body),
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
  }
}

const MEMORY_TYPES = ["StructureDefinition", "SearchParameter"];

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
  const memoryDatabase = createMemoryDatabase([
    "StructureDefinition",
    "SearchParameter",
  ]);

  const database = RouterDatabase([
    {
      resourcesSupported: MEMORY_TYPES as ResourceType[],
      interactionsSupported: ["read-request", "search-request"],
      source: memoryDatabase,
    },
    {
      resourcesSupported: [...resourceTypes].filter(
        (type) => MEMORY_TYPES.indexOf(type) === -1
      ) as ResourceType[],

      interactionsSupported: [
        "read-request",
        "search-request",
        "create-request",
        "update-request",
      ],
      source: createPostgresClient({
        user: process.env["FHIR_DATABASE_USERNAME"],
        password: process.env["FHIR_DATABASE_PASSWORD"],
        host: process.env["FHIR_DATABASE_HOST"],
        database: process.env["FHIR_DATABASE_NAME"],
        port: parseInt(process.env["FHIR_DATABASE_PORT"] || "5432"),
      }),
    },
  ]);

  const fhirServer = createFhirServer({
    capabilities: serverCapabilities(),
    database: database,
    resolveSD: (ctx, type: string) =>
      memoryDatabase.read(ctx, "StructureDefinition", type),
  });

  const router = new Router();
  router.all(
    "/w/:workspace/api/v1/fhir/r4/:fhirUrl*",
    checkJWT,
    async (ctx, next) => {
      try {
        const fhirServerResponse = await fhirServer(ctx, ctx.request);
        const koaResponse = fhirResponseToKoaResponse(fhirServerResponse);
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
        }
      }
    }
  );

  // TODO Use an adapter  adapter,
  const provider = new Provider(ISSUER, { ...configuration });

  app
    .use(bodyParser())
    .use(routes(provider).routes())
    .use(mount(provider.app))

    .use(async (ctx, next) => {
      await next();
      const rt = ctx.response.get("X-Response-Time");
      console.log(`${ctx.method} ${ctx.url} - ${rt}`);
    })
    .use(async (ctx, next) => {
      console.log(ctx.URL);
      const start = Date.now();
      await next();
      const ms = Date.now() - start;
      ctx.set("X-Response-Time", `${ms}ms`);
    })
    .use(router.routes())
    .use(router.allowedMethods());

  console.log("Running app");
  app.listen(port);

  return app;
}

createServer(3000);
