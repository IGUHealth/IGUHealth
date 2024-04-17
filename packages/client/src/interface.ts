import type {
  AResource,
  Bundle,
  BundleEntry,
  CapabilityStatement,
  Resource,
  ResourceType,
  id,
} from "@iguhealth/fhir-types/r4/types";
import type { IOperation, OPMetadata } from "@iguhealth/operation-execution";

import type { FHIRRequest, FHIRResponse } from "./types.js";
import type { ParsedParameter } from "./url.js";
import {
  FHIR_VERSIONS_SUPPORTED,
  VERSIONED_FHIR,
  VersionedAResource,
  VersionedResourceType,
} from "./version.js";

export type Versioned = {
  fhirVersion: (typeof FHIR_VERSIONS_SUPPORTED)[number];
};

export type FHIRClient<CTX> = FHIRClientAsync<CTX>;
export type VersionedFHIRClient<CTX extends Versioned> =
  VersionedFHIRClientAsync<CTX>;

export interface FHIRClientAsync<CTX> {
  request(ctx: CTX, request: FHIRRequest): Promise<FHIRResponse>;
  capabilities(ctx: CTX): Promise<CapabilityStatement>;
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

export interface VersionedFHIRClientAsync<CTX extends Versioned> {
  request<Context extends CTX>(
    ctx: Context,
    request: FHIRRequest,
  ): Promise<FHIRResponse>;
  capabilities<Context extends CTX>(
    ctx: Context,
  ): VERSIONED_FHIR[Context["fhirVersion"]]["CapabilityStatement"];
  search_system<Context extends CTX>(
    ctx: Context,
    parameters: ParsedParameter<string | number>[] | string,
  ): Promise<{
    total?: number;
    resources: VERSIONED_FHIR[Context["fhirVersion"]]["Resource"][];
  }>;
  search_type<
    Context extends CTX,
    T extends VersionedResourceType<Context["fhirVersion"]>,
  >(
    ctx: Context,
    type: T,
    parameters: ParsedParameter<string | number>[] | string,
  ): Promise<{
    total?: number;
    resources: VersionedAResource<Context["fhirVersion"], T>;
  }>;
  create<
    Context extends CTX,
    T extends VERSIONED_FHIR[Context["fhirVersion"]]["Resource"],
  >(
    ctx: CTX,
    resource: T,
    allowIdSet?: boolean,
  ): Promise<T>;
  update<
    Context extends CTX,
    T extends VersionedResourceType<Context["fhirVersion"]>,
  >(
    ctx: Context,
    resourceType: T,
    id: VERSIONED_FHIR[Context["fhirVersion"]]["id"],
    resource: VersionedAResource<Context["fhirVersion"], T>,
  ): Promise<VersionedAResource<Context["fhirVersion"], T>>;
  patch<
    Context extends CTX,
    T extends VersionedResourceType<Context["fhirVersion"]>,
  >(
    ctx: Context,
    resourceType: T,
    id: VERSIONED_FHIR[Context["fhirVersion"]]["id"],
    patches: any,
  ): Promise<VersionedAResource<Context["fhirVersion"], T>>;
  read<
    Context extends CTX,
    T extends VersionedResourceType<Context["fhirVersion"]>,
  >(
    ctx: Context,
    resourceType: T,
    id: VERSIONED_FHIR[Context["fhirVersion"]]["id"],
  ): Promise<VersionedAResource<Context["fhirVersion"], T> | undefined>;
  vread<
    Context extends CTX,
    T extends VersionedResourceType<Context["fhirVersion"]>,
  >(
    ctx: Context,
    resourceType: T,
    id: VERSIONED_FHIR[Context["fhirVersion"]]["id"],
    versionId: VERSIONED_FHIR[Context["fhirVersion"]]["id"],
  ): Promise<VersionedAResource<Context["fhirVersion"], T> | undefined>;
  delete<
    Context extends CTX,
    T extends VersionedResourceType<Context["fhirVersion"]>,
  >(
    ctx: Context,
    resourceType: T,
    id: VERSIONED_FHIR[Context["fhirVersion"]]["id"],
  ): Promise<void>;

  historySystem<Context extends CTX>(
    ctx: Context,
    parameters?: ParsedParameter<string | number>[] | string,
  ): Promise<VERSIONED_FHIR[Context["fhirVersion"]]["BundleEntry"][]>;
  historyType<
    Context extends CTX,
    T extends VersionedResourceType<Context["fhirVersion"]>,
  >(
    ctx: Context,
    resourceType: T,
    parameters?: ParsedParameter<string | number>[] | string,
  ): Promise<VERSIONED_FHIR[Context["fhirVersion"]]["BundleEntry"][]>;
  historyInstance<
    Context extends CTX,
    T extends VersionedResourceType<Context["fhirVersion"]>,
  >(
    ctx: Context,
    resourceType: T,
    id: VERSIONED_FHIR[Context["fhirVersion"]]["id"],
    parameters?: ParsedParameter<string | number>[] | string,
  ): Promise<VERSIONED_FHIR[Context["fhirVersion"]]["BundleEntry"][]>;
  invoke_system<Context extends CTX, Op extends IOperation<any, any>>(
    op: Op,
    ctx: Context,
    input: OPMetadata<Op>["Input"],
  ): Promise<OPMetadata<Op>["Output"]>;
  invoke_type<
    Context extends CTX,
    Op extends IOperation<any, any>,
    T extends VersionedResourceType<Context["fhirVersion"]>,
  >(
    op: Op,
    ctx: Context,
    resourceType: T,
    input: OPMetadata<Op>["Input"],
  ): Promise<OPMetadata<Op>["Output"]>;
  invoke_instance<
    Context extends CTX,
    Op extends IOperation<any, any>,
    T extends VersionedResourceType<Context["fhirVersion"]>,
  >(
    op: Op,
    ctx: Context,
    resourceType: T,
    id: VERSIONED_FHIR[Context["fhirVersion"]]["id"],
    input: OPMetadata<Op>["Input"],
  ): Promise<OPMetadata<Op>["Output"]>;
  transaction<Context extends CTX>(
    ctx: Context,
    bundle: VERSIONED_FHIR[Context["fhirVersion"]]["Bundle"],
  ): Promise<VERSIONED_FHIR[Context["fhirVersion"]]["Bundle"]>;
  batch<Context extends CTX>(
    ctx: Context,
    bundle: VERSIONED_FHIR[Context["fhirVersion"]]["Bundle"],
  ): Promise<VERSIONED_FHIR[Context["fhirVersion"]]["Bundle"]>;
}
