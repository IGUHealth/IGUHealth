import { FHIRURL, Parameters as FParameters } from "@genfhi/fhir-query";
import {
  Resource,
  ResourceMap,
  AResource,
  ResourceType,
  SearchParameter,
} from "@genfhi/fhir-types/r4/types";
import * as pg from "pg";
import { FHIRServerCTX } from "../../fhirServer";
import { FHIRClientAsync } from "../types";
import { evaluateWithMeta } from "@genfhi/fhirpath";

function searchResources(resource: Resource): (ResourceType | string)[] {
  return ["Resource", "DomainResource", resource.resourceType];
}

async function getParametersForResource<CTX extends FHIRServerCTX>(
  ctx: CTX,
  resource: Resource
): Promise<SearchParameter[]> {
  const parameters: FParameters<unknown> = {
    base: {
      name: "base",
      value: searchResources(resource),
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

const client = new pg.Client();
class Postgres<CTX extends FHIRServerCTX> implements FHIRClientAsync<CTX> {
  constructor(config: pg.ClientConfig) {}
  search_system(ctx: CTX, query: FHIRURL["parameters"]): Promise<Resource[]> {
    throw new Error("Method not implemented.");
  }
  search_type<T extends ResourceType>(
    ctx: CTX,
    resourceType: T,
    query: FHIRURL["parameters"]
  ): Promise<AResource<T>[]> {
    throw new Error("Method not implemented.");
  }
  create<T extends Resource>(ctx: CTX, resource: T): Promise<T> {
    indexResource(ctx, resource);
    throw new Error("Method not implemented.");
  }
  update<T extends Resource>(ctx: CTX, resource: T): Promise<T> {
    throw new Error("Method not implemented.");
  }
  patch<T extends Resource>(ctx: CTX, resource: T, patches: any): Promise<T> {
    throw new Error("Method not implemented.");
  }
  read<T extends keyof ResourceMap>(
    ctx: CTX,
    resourceType: T,
    id: string
  ): Promise<AResource<T>> {
    throw new Error("Method not implemented.");
  }
  vread<T extends keyof ResourceMap>(
    ctx: CTX,
    resourceType: T,
    id: string,
    versionId: string
  ): Promise<AResource<T>> {
    throw new Error("Method not implemented.");
  }
  delete(ctx: CTX, resourceType: keyof ResourceMap, id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  historySystem(ctx: CTX): Promise<Resource[]> {
    throw new Error("Method not implemented.");
  }
  historyType<T extends keyof ResourceMap>(
    ctx: CTX,
    resourceType: T
  ): Promise<AResource<T>[]> {
    throw new Error("Method not implemented.");
  }
  historyInstance<T extends keyof ResourceMap>(
    ctx: CTX,
    resourceType: T,
    id: string
  ): Promise<AResource<T>[]> {
    throw new Error("Method not implemented.");
  }
}
