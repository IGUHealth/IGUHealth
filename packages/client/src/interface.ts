import type { ParsedParameter } from "./url.js";
import {
  Resource,
  id,
  ResourceType,
  AResource,
  Bundle,
  CapabilityStatement,
  BundleEntry,
} from "@iguhealth/fhir-types/r4/types";
import type { FHIRRequest, FHIRResponse } from "./types.js";
import type { OPMetadata, IOperation } from "@iguhealth/operation-execution";

type Async<F, Else = never> = F extends (...arg: infer A) => infer R
  ? (...args: A) => Promise<R>
  : Else;

export type FHIRClient<CTX> = FHIRClientSync<CTX> | FHIRClientAsync<CTX>;

export interface FHIRClientSync<CTX> {
  request(ctx: CTX, request: FHIRRequest): FHIRResponse;
  capabilities(ctx: CTX): CapabilityStatement;
  search_system(
    ctx: CTX,
    parameters: ParsedParameter<string | number>[] | string
  ): { total?: number; resources: Resource[] };
  search_type<T extends ResourceType>(
    ctx: CTX,
    type: T,
    parameters: ParsedParameter<string | number>[] | string
  ): { total?: number; resources: AResource<T>[] };
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
  historySystem(ctx: CTX): BundleEntry[];
  historyType<T extends ResourceType>(ctx: CTX, resourceType: T): BundleEntry[];
  historyInstance<T extends ResourceType>(
    ctx: CTX,
    resourceType: T,
    id: id
  ): BundleEntry[];
  invoke_system<Op extends IOperation<any, any>>(
    op: Op,
    ctx: CTX,
    input: OPMetadata<Op>["Input"]
  ): OPMetadata<Op>["Output"];
  invoke_type<Op extends IOperation<any, any>, Type extends ResourceType>(
    op: Op,
    ctx: CTX,
    resourceType: Type,
    input: OPMetadata<Op>["Input"]
  ): OPMetadata<Op>["Output"];
  invoke_instance<Op extends IOperation<any, any>, Type extends ResourceType>(
    op: Op,
    ctx: CTX,
    resourceType: Type,
    id: id,
    input: OPMetadata<Op>["Input"]
  ): OPMetadata<Op>["Output"];
  transaction(ctx: CTX, bundle: Bundle): Bundle;
  batch(ctx: CTX, bundle: Bundle): Bundle;
}

export interface FHIRClientAsync<CTX> {
  request(ctx: CTX, request: FHIRRequest): Promise<FHIRResponse>;
  capabilities(ctx: CTX): Promise<CapabilityStatement>;
  search_system(
    ctx: CTX,
    parameters: ParsedParameter<string | number>[] | string
  ): Promise<{ total?: number; resources: Resource[] }>;
  search_type<T extends ResourceType>(
    ctx: CTX,
    type: T,
    parameters: ParsedParameter<string | number>[] | string
  ): Promise<{ total?: number; resources: AResource<T>[] }>;
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
  historySystem(ctx: CTX): Promise<BundleEntry[]>;
  historyType<T extends ResourceType>(
    ctx: CTX,
    resourceType: T
  ): Promise<BundleEntry[]>;
  historyInstance<T extends ResourceType>(
    ctx: CTX,
    resourceType: T,
    id: id
  ): Promise<BundleEntry[]>;
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
  transaction(ctx: CTX, bundle: Bundle): Promise<Bundle>;
  batch(ctx: CTX, bundle: Bundle): Promise<Bundle>;
}
