import { Parameters } from "@genfhi/fhir-query";
import {
  Bundle,
  Resource,
  id,
  ResourceType,
  StructureDefinition,
  AResource,
} from "@genfhi/fhir-types/r4/types";

type Async<F, Else = never> = F extends (...arg: infer A) => infer R
  ? (...args: A) => Promise<R>
  : Else;

export type FHIRClient<CTX> = FHIRClientSync<CTX> | FHIRClientAsync<CTX>;

export interface FHIRClientSync<CTX> {
  search_system(ctx: CTX, query: Parameters<any>): Resource[];
  search_type<T extends ResourceType>(
    ctx: CTX,
    type: T,
    query: Parameters<any>
  ): AResource<T>[];
  create<T extends Resource>(ctx: CTX, resource: T): T;
  update<T extends Resource>(ctx: CTX, resource: T): T;
  // [ADD JSON PATCH TYPES]
  patch<T extends Resource>(ctx: CTX, resource: T, patches: any): T;
  read<T extends ResourceType>(
    ctx: CTX,
    resourceType: T,
    id: id
  ): AResource<T> | undefined;
  vread<T extends ResourceType>(
    ctx: CTX,
    resourceType: T,
    id: id,
    versionId: id
  ): AResource<T>;
  delete(ctx: CTX, resourceType: ResourceType, id: id): void;
  historySystem(ctx: CTX): Resource[];
  historyType<T extends ResourceType>(
    ctx: CTX,
    resourceType: T
  ): AResource<T>[];
  historyInstance<T extends ResourceType>(
    ctx: CTX,
    resourceType: T,
    id: id
  ): AResource<T>[];
}

export interface FHIRClientAsync<CTX> {
  search_system(ctx: CTX, query: Parameters<any>): Promise<Resource[]>;
  search_type<T extends ResourceType>(
    ctx: CTX,
    type: T,
    query: Parameters<any>
  ): Promise<AResource<T>[]>;
  create<T extends Resource>(ctx: CTX, resource: T): Promise<T>;
  update<T extends Resource>(ctx: CTX, resource: T): Promise<T>;
  patch<T extends Resource>(ctx: CTX, resource: T, patches: any): Promise<T>;
  read<T extends ResourceType>(
    ctx: CTX,
    resourceType: T,
    id: id
  ): Promise<AResource<T> | undefined>;
  vread<T extends ResourceType>(
    ctx: CTX,
    resourceType: T,
    id: id,
    versionId: id
  ): Promise<AResource<T>>;
  delete(ctx: CTX, resourceType: ResourceType, id: id): Promise<void>;
  historySystem(ctx: CTX): Promise<Resource[]>;
  historyType<T extends ResourceType>(
    ctx: CTX,
    resourceType: T
  ): Promise<AResource<T>[]>;
  historyInstance<T extends ResourceType>(
    ctx: CTX,
    resourceType: T,
    id: id
  ): Promise<AResource<T>[]>;
}
