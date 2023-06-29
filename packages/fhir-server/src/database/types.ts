import { FHIRURL } from "@genfhi/fhir-query";
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
  search(ctx: CTX, query: FHIRURL): Resource[];
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
  search: Async<FHIRClientSync<CTX>["search"]>;
  create: Async<FHIRClientSync<CTX>["create"]>;
  update: Async<FHIRClientSync<CTX>["update"]>;
  patch: Async<FHIRClientSync<CTX>["patch"]>;
  read: Async<FHIRClientSync<CTX>["read"]>;
  vread: Async<FHIRClientSync<CTX>["vread"]>;
  delete: Async<FHIRClientSync<CTX>["delete"]>;
  historySystem: Async<FHIRClientSync<CTX>["historySystem"]>;
  historyType: Async<FHIRClientSync<CTX>["historyType"]>;
  historyInstance: Async<FHIRClientSync<CTX>["historyInstance"]>;
}
