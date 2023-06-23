import Koa from "koa";
import bodyParser from "koa-bodyparser";

import {
  FHIRRequest,
  InteractionLevel,
  InstanceLevelInteraction,
} from "./types";
import parseQuery, { FHIRURL } from "@genfhi/fhir-query";

const app = new Koa();

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
      return { url: fhirQuery, level: "system", type: "batch" };
  }
}

app.use(bodyParser);

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
