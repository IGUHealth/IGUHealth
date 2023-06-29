import Koa from "koa";
import Router from "@koa/router";
import bodyParser from "koa-bodyparser";
import path from "path";

import loadArtifacts from "@genfhi/artifacts/loadArtifacts";
import MemoryDatabase from "./database/memory";

import createFhirServer, { FHIRServerCTX } from "./fhirServer";
import {
  CapabilityStatement,
  ResourceType,
  Resource,
} from "@genfhi/fhir-types/r4/types";

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
): MemoryDatabase<FHIRServerCTX> {
  const database = new MemoryDatabase();
  const artifactResources: Resource[] = resourceTypes
    .map((resourceType) =>
      loadArtifacts(resourceType, path.join(__dirname, "../"))
    )
    .flat();
  for (const resource of artifactResources) {
    database.create({}, resource);
  }
  return database;
}

function createServer(port: number): Koa<Koa.DefaultState, Koa.DefaultContext> {
  const app = new Koa();

  const database = createMemoryDatabase([
    "StructureDefinition",
    "SearchParameter",
  ]);

  const fhirServer = createFhirServer({
    capabilities: serverCapabilities(),
    database: database,
  });

  const router = new Router();
  router.all("/w/:workspace/api/fhir/r4/:fhirUrl*", async (ctx, next) => {
    // console.log("route", ctx.request.querystring, ctx.params.fhirUrl);
    ctx.body = ctx.params.fhirUrl;
    const fhirServerResponse = await fhirServer(ctx, ctx.request);
    Object.keys(fhirServerResponse).map(
      (k) =>
        (ctx[k as keyof Koa.DefaultContext] =
          fhirServerResponse[k as keyof Partial<Koa.Response>])
    );
    next();
  });

  app.use(bodyParser());
  app
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
