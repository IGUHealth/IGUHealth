import { Parameters } from "@genfhi/fhir-query";
import {
  ConcreteType,
  ResourceMap,
  ResourceType,
  AResource,
} from "@genfhi/fhir-types/r4/types";
import { FHIRClient, FHIRClientAsync, FHIRClientSync } from "./types";

type InteractionSupported<T> = keyof FHIRClient<T>;
type InteractionsSupported<T> = InteractionSupported<T>[];

type Source<T> = {
  resourcesSupported: ResourceType[];
  interactionsSupported: InteractionsSupported<T>;
  source: FHIRClient<T>;
};
type Sources<T> = Source<T>[];

class Router<CTX> implements FHIRClientAsync<CTX> {
  private sources: Sources<CTX>;
  constructor(sources: Sources<CTX>) {
    this.sources = sources;
  }
  search_system(ctx: CTX, query: Parameters<any>): Promise<ConcreteType[]> {
    throw new Error("Method not implemented.");
  }
  search_type<T extends ResourceType>(
    ctx: CTX,
    type: T,
    query: Parameters<any>
  ): Promise<AResource<T>[]> {
    throw new Error("Method not implemented.");
  }
  create<T extends ConcreteType>(ctx: CTX, resource: T): Promise<T> {
    throw new Error("Method not implemented.");
  }
  update<T extends ConcreteType>(ctx: CTX, resource: T): Promise<T> {
    throw new Error("Method not implemented.");
  }
  patch<T extends ConcreteType>(
    ctx: CTX,
    resource: T,
    patches: any
  ): Promise<T> {
    throw new Error("Method not implemented.");
  }
  read<T extends keyof ResourceMap>(
    ctx: CTX,
    resourceType: T,
    id: string
  ): Promise<AResource<T> | undefined> {
    throw new Error("Method not implemented.");
  }
  vread<T extends ResourceType>(
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
  historySystem(ctx: CTX): Promise<ConcreteType[]> {
    throw new Error("Method not implemented.");
  }
  historyType<T extends ResourceType>(
    ctx: CTX,
    resourceType: T
  ): Promise<AResource<T>[]> {
    throw new Error("Method not implemented.");
  }
  historyInstance<T extends ResourceType>(
    ctx: CTX,
    resourceType: T,
    id: string
  ): Promise<AResource<T>[]> {
    throw new Error("Method not implemented.");
  }
}
