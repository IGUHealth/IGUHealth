import { FHIRURL } from "@genfhi/fhir-query";
import {
  Resource,
  ResourceType,
  SearchParameter,
} from "@genfhi/fhir-types/r4/types";
import * as pg from "pg";
import { FHIRServerCTX } from "../../fhirServer";
import { FHIRClientAsync, MiddlewareAsync } from "../../client/interface";
import { ASynchronousClient } from "../../client";
import { FHIRRequest, FHIRResponse } from "../../client/types";
import { evaluateWithMeta } from "@genfhi/fhirpath";

function searchResources(resource: Resource): (ResourceType | string)[] {
  return ["Resource", "DomainResource", resource.resourceType];
}

async function getParametersForResource<CTX extends FHIRServerCTX>(
  ctx: CTX,
  resource: Resource
): Promise<SearchParameter[]> {
  const parameters: FHIRURL = {
    resourceType: "SearchParameter",
    parameters: {
      base: {
        name: "base",
        value: searchResources(resource),
      },
    },
  };
  return await ctx.database.search_type(ctx, "SearchParameter", parameters);
}

async function indexResource<CTX extends FHIRServerCTX>(
  ctx: CTX,
  resource: Resource
) {
  const searchParameters = await getParametersForResource(ctx, resource);
  for (const searchParameter of searchParameters) {
    if (searchParameter.expression === undefined) continue;
    const output = evaluateWithMeta(searchParameter.expression, resource, {
      meta: { getSD: (type: string) => ctx.resolveSD(ctx, type) },
    });
  }
}

function PGMiddleware<
  State extends { client: pg.Client },
  CTX extends FHIRServerCTX
>(
  request: FHIRRequest,
  args: { state: State; ctx: CTX },
  next: MiddlewareAsync<State, CTX>
): Promise<{ state: State; ctx: CTX; response: FHIRResponse }> {
  const client = args.state.client;
  switch (request.type) {
    case "search-request":
      throw new Error("Not implemented");
    default:
      throw new Error(`Not implemented ${request.type}`);
  }
}

// const client = new pg.Client();

export function createPostgresClient<
  CTX extends FHIRServerCTX
>(): FHIRClientAsync<CTX> {
  const client = new pg.Client();
  return new ASynchronousClient<{ client: pg.Client }, CTX>(
    { client: client },
    PGMiddleware
  );
}
