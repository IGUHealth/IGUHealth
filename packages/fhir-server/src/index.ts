import Koa from "koa";
import Router from "@koa/router";
import bodyParser from "koa-bodyparser";

import loadArtifacts from "@genfhi/artifacts/loadArtifacts";
import MemoryDatabase from "@genfhi/fhir-database/src/memory";
import parseQuery, { FHIRURL } from "@genfhi/fhir-query";

import createFhirServer from "./fhirServer";
import {
  FHIRRequest,
  InteractionLevel,
  InstanceLevelInteraction,
} from "./types";
import { CapabilityStatement } from "@genfhi/fhir-types/r4/types";

function getInteractionLevel(
  fhirURL: FHIRURL
): InteractionLevel[keyof InteractionLevel] {
  if (fhirURL.resourceType && fhirURL.id) {
    return "instance";
  } else if (fhirURL.resourceType) {
    return "type";
  }
  return "system";
}

function parseInstantRequest(
  request: Koa.Request,
  fhirURL: FHIRURL,
  fhirRequest: Pick<InstanceLevelInteraction, "level" | "resourceType" | "id">
): FHIRRequest {
  switch (request.method) {
    case "GET":
      return {
        url: fhirURL,
        type: "read",
        ...fhirRequest,
      };
    default:
      throw new Error(`Instance interaction '${request.method}' not supported`);
  }
}

function KoaRequestToFHIRRequest(request: Koa.Request): FHIRRequest {
  const method = request.method;
  const fhirQuery = parseQuery(request.URL);
  const level = getInteractionLevel(fhirQuery);

  switch (level) {
    case "instance":
      if (!fhirQuery.resourceType)
        throw new Error("Invalid instance search no resourceType found");
      if (!fhirQuery.id) throw new Error("Invalid instance search no ID found");
      return parseInstantRequest(request, fhirQuery, {
        level: "instance",
        id: fhirQuery.id,
        resourceType: fhirQuery.resourceType,
      });
    case "type":
      if (!fhirQuery.resourceType) throw new Error("Invalid Type search");
      return {
        url: fhirQuery,
        type: "search",
        level: "type",
        resourceType: fhirQuery.resourceType,
      };
    case "system":
      return {
        url: fhirQuery,
        level: "system",
        type: "batch",
      };
  }
}

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

function createServer(port: number): Koa<Koa.DefaultState, Koa.DefaultContext> {
  const app = new Koa();
  const sds = loadArtifacts("StructureDefinition");
  const database = new MemoryDatabase();
  sds.map((sd) => database.create(sd));
  const fhirServer = createFhirServer({
    capabilities: serverCapabilities(),
    database: database,
  });
  const router = new Router();
  router.all("/w/:workspace/api/fhir/r4/:fhirUrl*", (ctx, next) => {
    console.log("route", ctx);
    ctx.body = ctx.params.fhirUrl;
    next();
  });

  app
    .use(bodyParser())
    .use(router.routes())
    .use(router.allowedMethods())
    .use(async (ctx, next) => {
      await next();
      const rt = ctx.response.get("X-Response-Time");
      console.log(`${ctx.method} ${ctx.url} - ${rt}`);
    });

  console.log("Running app");
  app.listen(port);

  return app;
}

createServer(3000);
