import * as pg from "pg";

import { FHIRURL } from "@genfhi/fhir-query";
import {
  Resource,
  ResourceType,
  SearchParameter,
} from "@genfhi/fhir-types/r4/types";
import { evaluateWithMeta } from "@genfhi/fhirpath";

import { FHIRServerCTX } from "../../fhirServer";
import { FHIRClientAsync } from "../../client/interface";
import { AsynchronousClient } from "../../client";
import {
  createMiddlewareAsync,
  MiddlewareAsync,
} from "../../client/middleware";

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
    console.log(
      searchParameter.name,
      searchParameter.expression,
      JSON.stringify(output.map((o) => ({ type: o.meta()?.type })))
    );
  }
}

function createPostgresMiddleware<
  State extends { client: pg.Client },
  CTX extends FHIRServerCTX
>(): MiddlewareAsync<State, CTX> {
  return createMiddlewareAsync<State, CTX>([
    async (request, args, next) => {
      const client = args.state.client;
      switch (request.type) {
        case "search-request":
          throw new Error("Not implemented");
        case "create-request":
          await indexResource(args.ctx, request.body);
          return {
            state: args.state,
            ctx: args.ctx,
            response: {
              level: "type",
              resourceType: request.resourceType,
              type: "create-response",
              body: request.body,
            },
          };
        default:
          throw new Error(`Not implemented ${request.type}`);
      }
    },
  ]);
}

// const client = new pg.Client();

export function createPostgresClient<
  CTX extends FHIRServerCTX
>(): FHIRClientAsync<CTX> {
  const client = new pg.Client();
  return new AsynchronousClient<{ client: pg.Client }, CTX>(
    { client: client },
    createPostgresMiddleware()
  );
}
