import * as r4 from "@iguhealth/fhir-types/r4/types";
import * as r4b from "@iguhealth/fhir-types/r4b/types";
import type { IOperation, OPMetadata } from "@iguhealth/operation-execution";

import type { FHIRRequest, FHIRResponse } from "./types.js";
import type { ParsedParameter } from "./url.js";

export const FHIR_VERSIONS_SUPPORTED = <const>["4.0", "4.3"]

type VERSIONED_FHIR = {
  "4.0" : 
    {
      Bundle: r4.Bundle,
      BundleEntry: r4.BundleEntry,
      CapabilityStatement: r4.CapabilityStatement,
      Resource: r4.Resource,
      ResourceType : r4.ResourceType,
      id: r4.id,
    }
  "4.3": {
    Bundle: r4b.Bundle,
    BundleEntry: r4b.BundleEntry,
    CapabilityStatement: r4b.CapabilityStatement,
    Resource: r4b.Resource,
    ResourceType : r4b.ResourceType,
    id: r4b.id,
  }
}



type VersionedAResource<T> = string;



export type Versioned = { fhirVersion: typeof FHIR_VERSIONS_SUPPORTED[number] };

export type FHIRClient<CTX extends Versioned> = FHIRClientAsync<CTX>;

export interface FHIRClientAsync<CTX extends Versioned> {
  request<Context extends CTX>(ctx: Context, request: FHIRRequest): Promise<FHIRResponse>;
  capabilities<Context extends CTX>(ctx: Context): VERSIONED_FHIR[Context["fhirVersion"]]["CapabilityStatement"];
  search_system(
    ctx: CTX,
    parameters: ParsedParameter<string | number>[] | string,
  ): Promise<{ total?: number; resources: Resource[] }>;
  search_type<T extends ResourceType>(
    ctx: CTX,
    type: T,
    parameters: ParsedParameter<string | number>[] | string,
  ): Promise<{ total?: number; resources: AResource<T>[] }>;
  create<T extends Resource>(
    ctx: CTX,
    resource: T,
    allowIdSet?: boolean,
  ): Promise<T>;
  update<T extends ResourceType>(
    ctx: CTX,
    resourceType: T,
    id: id,
    resource: AResource<T>,
  ): Promise<AResource<T>>;
  patch<T extends ResourceType>(
    ctx: CTX,
    resourceType: T,
    id: id,
    patches: any,
  ): Promise<AResource<T>>;
  read<T extends ResourceType>(
    ctx: CTX,
    resourceType: T,
    id: id,
  ): Promise<AResource<T> | undefined>;
  vread<T extends ResourceType>(
    ctx: CTX,
    resourceType: T,
    id: id,
    versionId: id,
  ): Promise<AResource<T> | undefined>;
  delete(ctx: CTX, resourceType: ResourceType, id: id): Promise<void>;
  historySystem(
    ctx: CTX,
    parameters?: ParsedParameter<string | number>[] | string,
  ): Promise<BundleEntry[]>;
  historyType<T extends ResourceType>(
    ctx: CTX,
    resourceType: T,
    parameters?: ParsedParameter<string | number>[] | string,
  ): Promise<BundleEntry[]>;
  historyInstance<T extends ResourceType>(
    ctx: CTX,
    resourceType: T,
    id: id,
    parameters?: ParsedParameter<string | number>[] | string,
  ): Promise<BundleEntry[]>;
  invoke_system<Op extends IOperation<any, any>>(
    op: Op,
    ctx: CTX,
    input: OPMetadata<Op>["Input"],
  ): Promise<OPMetadata<Op>["Output"]>;
  invoke_type<Op extends IOperation<any, any>, Type extends ResourceType>(
    op: Op,
    ctx: CTX,
    resourceType: Type,
    input: OPMetadata<Op>["Input"],
  ): Promise<OPMetadata<Op>["Output"]>;
  invoke_instance<Op extends IOperation<any, any>, Type extends ResourceType>(
    op: Op,
    ctx: CTX,
    resourceType: Type,
    id: id,
    input: OPMetadata<Op>["Input"],
  ): Promise<OPMetadata<Op>["Output"]>;
  transaction(ctx: CTX, bundle: Bundle): Promise<Bundle>;
  batch(ctx: CTX, bundle: Bundle): Promise<Bundle>;
}
