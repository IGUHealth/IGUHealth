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

export type FHIRClient<CTX extends Versioned> = FHIRClientAsync<CTX>;

export interface FHIRClientAsync<CTX extends Versioned> {
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
