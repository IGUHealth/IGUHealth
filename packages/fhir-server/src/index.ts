import Koa from "koa";

import parseQuery, { FHIRURL } from "@genfhi/fhir-query";
import { ResourceType, id } from "@genfhi/fhir-types/r4/types";

const app = new Koa();

type InteractionLevel = {
  instance: "instance";
  system: "system";
  type: "type";
};

type InstanceLevelInteraction = {
  level: InteractionLevel["instance"];
  type: "read" | "vread" | "update" | "patch" | "delete" | "history";
  resourceType: ResourceType;
  id: id;
};

type TypeLevelInteractions = {
  level: InteractionLevel["type"];
  type: "create" | "search" | "delete" | "history";
  resourceType: ResourceType;
};

type SystemInteraction = {
  level: InteractionLevel["system"];
  type: "capabilities" | "batch/transaction" | "delete" | "history" | "search";
};

function getLevel(fhirURL: FHIRURL): InteractionLevel[keyof InteractionLevel] {
  if (fhirURL.resourceType && fhirURL.id) {
    return "instance";
  } else if (fhirURL.resourceType) {
    return "type";
  }
  return "system";
}

function KoaRequestToFHIRRequest(request: Koa.Request) {
  const method = request.method;
  const fhirQuery = parseQuery(request.URL);
}

app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get("X-Response-Time");
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

// x-response-time

app.use(async (ctx, next) => {
  // console.log(ctx.URL);
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set("X-Response-Time", `${ms}ms`);
});

// response
app.use(async (ctx) => {
  ctx.body = "Hello Worlds";
});

console.log("Running app");
app.listen(3000);
