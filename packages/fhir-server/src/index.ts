import Koa from "koa";
import Router from "@koa/router";
import bodyParser from "koa-bodyparser";
import path from "path";
import dotEnv from "dotenv";
import { fileURLToPath } from "url";

import { loadArtifacts } from "@genfhi/artifacts";
import MemoryDatabase from "./resourceProviders/memory.js";
import RouterDatabase from "./resourceProviders/router.js";
import { FHIRClientSync } from "./client/interface.js";

import createFhirServer, { FHIRServerCTX } from "./fhirServer.js";
import {
  Bundle,
  CapabilityStatement,
  ResourceType,
  Resource,
} from "@genfhi/fhir-types/r4/types";
import { createPostgresClient } from "./resourceProviders/postgres/index.js";
import { FHIRResponse } from "./client/types";
import { resourceTypes } from "@genfhi/fhir-types/r4/sets";
import {
  OperationError,
  isOperationError,
  issueSeverityToStatusCodes,
  outcomeError,
} from "./operationOutcome/index.js";

dotEnv.config();

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
  router.all("/w/:workspace/api/fhir/r4/:fhirUrl*", async (ctx, next) => {
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
  });

  app
    .use(bodyParser())
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
