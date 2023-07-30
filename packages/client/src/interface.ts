import type { ParsedParameter } from "./url";
import {
  Resource,
  id,
  ResourceType,
  AResource,
} from "@iguhealth/fhir-types/r4/types";
import type { FHIRRequest, FHIRResponse } from "./types";
import type { OPMetadata, IOperation } from "@iguhealth/operation-execution";

type Async<F, Else = never> = F extends (...arg: infer A) => infer R
  ? (...args: A) => Promise<R>
  : Else;

export type FHIRClient<CTX> = FHIRClientSync<CTX> | FHIRClientAsync<CTX>;

export interface FHIRClientSync<CTX> {
  request(ctx: CTX, request: FHIRRequest): FHIRResponse;
  search_system(
    ctx: CTX,
    parameters: ParsedParameter<string | number>[]
  ): Resource[];
  search_type<T extends ResourceType>(
    ctx: CTX,
    type: T,
    parameters: ParsedParameter<string | number>[]
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
  search_system(
    ctx: CTX,
    parameters: ParsedParameter<string | number>[]
  ): Promise<Resource[]>;
  search_type<T extends ResourceType>(
    ctx: CTX,
    type: T,
    parameters: ParsedParameter<string | number>[]
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
  invoke_system<Op extends IOperation<any, any>>(
    op: Op,
    ctx: CTX,
    input: OPMetadata<Op>["Input"]
  ): Promise<OPMetadata<Op>["Output"]>;
  invoke_type<Op extends IOperation<any, any>, Type extends ResourceType>(
    op: Op,
    ctx: CTX,
    resourceType: Type,
    input: OPMetadata<Op>["Input"]
  ): Promise<OPMetadata<Op>["Output"]>;
  invoke_instance<Op extends IOperation<any, any>, Type extends ResourceType>(
    op: Op,
    ctx: CTX,
    resourceType: Type,
    id: id,
    input: OPMetadata<Op>["Input"]
  ): Promise<OPMetadata<Op>["Output"]>;
}
