import type {
  AResource,
  Bundle,
  BundleEntry,
  CapabilityStatement,
  Resource,
  ResourceType,
  id,
} from "@iguhealth/fhir-types/r4/types";
import {
  FHIR_VERSION,
  VERSIONED_FHIR,
  VersionedAResource,
  VersionedResourceType,
} from "@iguhealth/fhir-types/versions";
import type { IOperation, OPMetadata } from "@iguhealth/operation-execution";

import type { FHIRRequest, FHIRResponse } from "./types/index.js";
import type { ParsedParameter } from "./url.js";

export type FHIRClient<CTX> = FHIRClientAsync<CTX>;
export type VersionedFHIRClient<CTX> = VersionedFHIRClientAsync<CTX>;

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

export interface VersionedFHIRClientAsync<CTX> {
  request(ctx: CTX, request: FHIRRequest): Promise<FHIRResponse>;
  capabilities<FHIRVersion extends FHIR_VERSION>(
    ctx: CTX,
    fhirVersion: FHIRVersion,
  ): Promise<VERSIONED_FHIR[FHIRVersion]["CapabilityStatement"]>;
  search_system<FHIRVersion extends FHIR_VERSION>(
    ctx: CTX,
    fhirVersion: FHIRVersion,
    parameters: ParsedParameter<string | number>[] | string,
  ): Promise<{
    total?: number;
    resources: VERSIONED_FHIR[FHIRVersion]["Resource"][];
  }>;
  search_type<
    FHIRVersion extends FHIR_VERSION,
    T extends VersionedResourceType<FHIRVersion>,
  >(
    ctx: CTX,
    fhirVersion: FHIRVersion,
    type: T,
    parameters: ParsedParameter<string | number>[] | string,
  ): Promise<{
    total?: number;
    resources: VersionedAResource<FHIRVersion, T>[];
  }>;
  create<
    FHIRVersion extends FHIR_VERSION,
    T extends VERSIONED_FHIR[FHIRVersion]["Resource"],
  >(
    ctx: CTX,
    fhirVersion: FHIRVersion,
    resource: T,
    allowIdSet?: boolean,
  ): Promise<T>;
  update<
    FHIRVersion extends FHIR_VERSION,
    T extends VersionedResourceType<FHIRVersion>,
  >(
    ctx: CTX,
    fhirVersion: FHIRVersion,
    resourceType: T,
    id: VERSIONED_FHIR[FHIRVersion]["id"],
    resource: VersionedAResource<FHIRVersion, T>,
  ): Promise<VersionedAResource<FHIRVersion, T>>;
  patch<
    FHIRVersion extends FHIR_VERSION,
    T extends VersionedResourceType<FHIRVersion>,
  >(
    ctx: CTX,
    fhirVersion: FHIRVersion,
    resourceType: T,
    id: VERSIONED_FHIR[FHIRVersion]["id"],
    patches: any,
  ): Promise<VersionedAResource<FHIRVersion, T>>;
  read<
    FHIRVersion extends FHIR_VERSION,
    T extends VersionedResourceType<FHIRVersion>,
  >(
    ctx: CTX,
    fhirVersion: FHIRVersion,
    resourceType: T,
    id: VERSIONED_FHIR[FHIRVersion]["id"],
  ): Promise<VersionedAResource<FHIRVersion, T> | undefined>;
  vread<
    FHIRVersion extends FHIR_VERSION,
    T extends VersionedResourceType<FHIRVersion>,
  >(
    ctx: CTX,
    fhirVersion: FHIRVersion,
    resourceType: T,
    id: VERSIONED_FHIR[FHIRVersion]["id"],
    versionId: VERSIONED_FHIR[FHIRVersion]["id"],
  ): Promise<VersionedAResource<FHIRVersion, T> | undefined>;
  delete<
    FHIRVersion extends FHIR_VERSION,
    T extends VersionedResourceType<FHIRVersion>,
  >(
    ctx: CTX,
    fhirVersion: FHIRVersion,
    resourceType: T,
    id: VERSIONED_FHIR[FHIRVersion]["id"],
  ): Promise<void>;

  historySystem<FHIRVersion extends FHIR_VERSION>(
    ctx: CTX,
    fhirVersion: FHIRVersion,
    parameters?: ParsedParameter<string | number>[] | string,
  ): Promise<VERSIONED_FHIR[FHIRVersion]["BundleEntry"][]>;
  historyType<
    FHIRVersion extends FHIR_VERSION,
    T extends VersionedResourceType<FHIRVersion>,
  >(
    ctx: CTX,
    fhirVersion: FHIRVersion,
    resourceType: T,
    parameters?: ParsedParameter<string | number>[] | string,
  ): Promise<VERSIONED_FHIR[FHIRVersion]["BundleEntry"][]>;
  historyInstance<
    FHIRVersion extends FHIR_VERSION,
    T extends VersionedResourceType<FHIRVersion>,
  >(
    ctx: CTX,
    fhirVersion: FHIRVersion,
    resourceType: T,
    id: VERSIONED_FHIR[FHIRVersion]["id"],
    parameters?: ParsedParameter<string | number>[] | string,
  ): Promise<VERSIONED_FHIR[FHIRVersion]["BundleEntry"][]>;
  invoke_system<
    FHIRVersion extends FHIR_VERSION,
    Op extends IOperation<any, any>,
  >(
    op: Op,
    ctx: CTX,
    fhirVersion: FHIRVersion,
    input: OPMetadata<Op>["Input"],
  ): Promise<OPMetadata<Op>["Output"]>;
  invoke_type<
    FHIRVersion extends FHIR_VERSION,
    Op extends IOperation<any, any>,
    T extends VersionedResourceType<FHIRVersion>,
  >(
    op: Op,
    ctx: CTX,
    fhirVersion: FHIRVersion,
    resourceType: T,
    input: OPMetadata<Op>["Input"],
  ): Promise<OPMetadata<Op>["Output"]>;
  invoke_instance<
    FHIRVersion extends FHIR_VERSION,
    Op extends IOperation<any, any>,
    T extends VersionedResourceType<FHIRVersion>,
  >(
    op: Op,
    ctx: CTX,
    fhirVersion: FHIRVersion,
    resourceType: T,
    id: VERSIONED_FHIR[FHIRVersion]["id"],
    input: OPMetadata<Op>["Input"],
  ): Promise<OPMetadata<Op>["Output"]>;
  transaction<FHIRVersion extends FHIR_VERSION>(
    ctx: CTX,
    fhirVersion: FHIRVersion,
    bundle: VERSIONED_FHIR[FHIRVersion]["Bundle"],
  ): Promise<VERSIONED_FHIR[FHIRVersion]["Bundle"]>;
  batch<FHIRVersion extends FHIR_VERSION>(
    ctx: CTX,
    fhirVersion: FHIRVersion,
    bundle: VERSIONED_FHIR[FHIRVersion]["Bundle"],
  ): Promise<VERSIONED_FHIR[FHIRVersion]["Bundle"]>;
}
