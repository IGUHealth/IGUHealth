import { FHIRURL } from "@genfhi/fhir-query";
import {
  Bundle,
  Resource,
  id,
  ResourceType,
  AResource,
} from "@genfhi/fhir-types/r4/types";

type Async<F, Else = never> = F extends (...arg: infer A) => infer R
  ? (...args: A) => Promise<R>
  : Else;

export interface FHIRClientSynchronous {
  search(query: FHIRURL): Resource[];
  create<T extends Resource>(resource: T): T;
  update<T extends Resource>(resource: T): T;
  // [ADD JSON PATCH TYPES]
  patch<T extends Resource>(resource: T, patches: any): T;
  read<T extends ResourceType>(
    resourceType: T,
    id: id
  ): AResource<T> | undefined;
  vread<T extends ResourceType>(
    resourceType: T,
    id: id,
    versionId: id
  ): AResource<T>;
  delete(resourceType: ResourceType, id: id): void;
  historySystem(): Resource[];
  historyType<T extends ResourceType>(resourceType: T): AResource<T>[];
  historyInstance<T extends ResourceType>(
    resourceType: T,
    id: id
  ): AResource<T>[];
}

export interface FHIRClientAsync {
  search: Async<FHIRClientSynchronous["search"]>;
  create: Async<FHIRClientSynchronous["create"]>;
  update: Async<FHIRClientSynchronous["update"]>;
  patch: Async<FHIRClientSynchronous["patch"]>;
  read: Async<FHIRClientSynchronous["read"]>;
  vread: Async<FHIRClientSynchronous["vread"]>;
  delete: Async<FHIRClientSynchronous["delete"]>;
  historySystem: Async<FHIRClientSynchronous["historySystem"]>;
  historyType: Async<FHIRClientSynchronous["historyType"]>;
  historyInstance: Async<FHIRClientSynchronous["historyInstance"]>;
}
