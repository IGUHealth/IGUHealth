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

export type FHIRClient<CTX> = FHIRClientAsync<CTX>;

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
  historySystem(
    ctx: CTX,
    parameters?: ParsedParameter<string | number>[] | string
  ): Promise<BundleEntry[]>;
  historyType<T extends ResourceType>(
    ctx: CTX,
    resourceType: T,
    parameters?: ParsedParameter<string | number>[] | string
  ): Promise<BundleEntry[]>;
  historyInstance<T extends ResourceType>(
    ctx: CTX,
    resourceType: T,
    id: id,
    parameters?: ParsedParameter<string | number>[] | string
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
