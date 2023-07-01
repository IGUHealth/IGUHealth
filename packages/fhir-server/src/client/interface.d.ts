import { FHIRURL } from "@genfhi/fhir-query";
import {
  Resource,
  id,
  ResourceType,
  AResource,
} from "@genfhi/fhir-types/r4/types";
import { FHIRRequest, FHIRResponse } from "./types";

type Async<F, Else = never> = F extends (...arg: infer A) => infer R
  ? (...args: A) => Promise<R>
  : Else;

export type MiddlewareAsync<State, CTX> = (
  request: FHIRRequest,
  args: { ctx: CTX; state: State },
  next?: Middleware<State, CTX>
) => Promise<{ ctx: CTX; state: State; response: FHIRResponse }>;

export type MiddlewareSync<State, CTX> = (
  request: FHIRRequest,
  args: { ctx: CTX; state: State },
  next?: Middleware<State, CTX>
) => { ctx: CTX; state: State; response: FHIRResponse };

export type FHIRClient<CTX> = FHIRClientSync<CTX> | FHIRClientAsync<CTX>;

export interface FHIRClientSync<CTX> {
  request(ctx: CTX, request: FHIRRequest): FHIRResponse;
  search_system(ctx: CTX, query: FHIRURL): Resource[];
  search_type<T extends ResourceType>(
    ctx: CTX,
    type: T,
    query: FHIRURL
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
  ): AResource<T> | undefined;
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
  request(ctx: CTX, request: FHIRRequest): Promise<FHIRResponse>;
  search_system(ctx: CTX, query: FHIRURL): Promise<Resource[]>;
  search_type<T extends ResourceType>(
    ctx: CTX,
    type: T,
    query: FHIRURL
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
  ): Promise<AResource<T> | undefined>;
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
