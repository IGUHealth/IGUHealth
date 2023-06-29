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

export interface FHIRClientSynchronous<CTX> {
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
  search: Async<FHIRClientSynchronous<CTX>["search"]>;
  create: Async<FHIRClientSynchronous<CTX>["create"]>;
  update: Async<FHIRClientSynchronous<CTX>["update"]>;
  patch: Async<FHIRClientSynchronous<CTX>["patch"]>;
  read: Async<FHIRClientSynchronous<CTX>["read"]>;
  vread: Async<FHIRClientSynchronous<CTX>["vread"]>;
  delete: Async<FHIRClientSynchronous<CTX>["delete"]>;
  historySystem: Async<FHIRClientSynchronous<CTX>["historySystem"]>;
  historyType: Async<FHIRClientSynchronous<CTX>["historyType"]>;
  historyInstance: Async<FHIRClientSynchronous<CTX>["historyInstance"]>;
}
