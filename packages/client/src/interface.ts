import * as r4 from "@iguhealth/fhir-types/r4/types";
import * as r4b from "@iguhealth/fhir-types/r4b/types";
import type { IOperation, OPMetadata } from "@iguhealth/operation-execution";

import type { FHIRRequest, FHIRResponse } from "./types.js";
import type { ParsedParameter } from "./url.js";

export const FHIR_VERSIONS_SUPPORTED: ["4.0", "4.3"] = <const>["4.0", "4.3"]

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


type VersionedResourceType<Version extends typeof FHIR_VERSIONS_SUPPORTED[number]> = Version extends "4.0" ? r4.ResourceType : r4b.ResourceType;
type VersionedAResource<Version extends typeof FHIR_VERSIONS_SUPPORTED[number], Type extends VersionedResourceType<Version>> = Type extends r4.ResourceType ? r4.AResource<Type> : Type extends r4b.ResourceType ? r4b.AResource<Type> : never;

export type Versioned = { fhirVersion: typeof FHIR_VERSIONS_SUPPORTED[number] };

export type FHIRClient<CTX extends Versioned> = FHIRClientAsync<CTX>;

export interface FHIRClientAsync<CTX extends Versioned> {
  request<Context extends CTX>(ctx: Context, request: FHIRRequest): Promise<FHIRResponse>;
  capabilities<Context extends CTX>(ctx: Context): VERSIONED_FHIR[Context["fhirVersion"]]["CapabilityStatement"];
  search_system<Context extends CTX>(
    ctx: CTX,
    parameters: ParsedParameter<string | number>[] | string,
  ): Promise<{ total?: number; resources: VERSIONED_FHIR[Context["fhirVersion"]]["Resource"][] }>;
  search_type<Context extends CTX, T extends VersionedResourceType<Context["fhirVersion"]>>(
    ctx: CTX,
    type: T,
    parameters: ParsedParameter<string | number>[] | string,
  ): Promise<{ total?: number; resources: VersionedAResource<Context["fhirVersion"], T> }>;
  create<Context extends CTX, T extends VERSIONED_FHIR[Context["fhirVersion"]]["Resource"]>(
    ctx: CTX,
    resource: T,
    allowIdSet?: boolean,
  ): Promise<T>;
  update<Context extends CTX, T extends VersionedResourceType<Context["fhirVersion"]>>(
    ctx: CTX,
    resourceType: T,
    id: VERSIONED_FHIR[Context["fhirVersion"]]["id"],
    resource: VersionedAResource<Context["fhirVersion"], T>,
  ): Promise<VersionedAResource<Context["fhirVersion"], T>>;
  patch<Context extends CTX, T extends VersionedResourceType<Context["fhirVersion"]>>(
    ctx: CTX,
    resourceType: T,
    id: VERSIONED_FHIR[Context["fhirVersion"]]["id"],
    patches: any
  ): Promise<VersionedAResource<Context["fhirVersion"], T>>;
  read<Context extends CTX, T extends VersionedResourceType<Context["fhirVersion"]>>(
    ctx: CTX,
    resourceType: T,
    id: VERSIONED_FHIR[Context["fhirVersion"]]["id"],
  ): Promise<VersionedAResource<Context["fhirVersion"], T> | undefined>;
  vread<Context extends CTX, T extends VersionedResourceType<Context["fhirVersion"]>>(
    ctx: CTX,
    resourceType: T,
    id: VERSIONED_FHIR[Context["fhirVersion"]]["id"],
    versionId: VERSIONED_FHIR[Context["fhirVersion"]]["id"],
  ): Promise<VersionedAResource<Context["fhirVersion"], T> | undefined>;
  delete<Context extends CTX, T extends VersionedResourceType<Context["fhirVersion"]>>(
    ctx: CTX,
    resourceType: T,
    id: VERSIONED_FHIR[Context["fhirVersion"]]["id"]): Promise<void>;

  historySystem<Context extends CTX>(
    ctx: CTX,
    parameters?: ParsedParameter<string | number>[] | string,
  ): Promise<VERSIONED_FHIR[Context["fhirVersion"]]["BundleEntry"][]>;
  historyType<Context extends CTX, T extends VersionedResourceType<Context["fhirVersion"]>>(
    ctx: CTX,
    resourceType: T,
    parameters?: ParsedParameter<string | number>[] | string,
  ): Promise<VERSIONED_FHIR[Context["fhirVersion"]]["BundleEntry"][]>;
  historyInstance<Context extends CTX, T extends VersionedResourceType<Context["fhirVersion"]>>(
    ctx: CTX,
    resourceType: T,
    id: VERSIONED_FHIR[Context["fhirVersion"]]["id"],
    parameters?: ParsedParameter<string | number>[] | string,
  ): Promise<VERSIONED_FHIR[Context["fhirVersion"]]["BundleEntry"][]>;
  invoke_system<Op extends IOperation<any, any>>(
    op: Op,
    ctx: CTX,
    input: OPMetadata<Op>["Input"],
  ): Promise<OPMetadata<Op>["Output"]>;
  invoke_type<Context extends CTX, Op extends IOperation<any, any>, T extends VersionedResourceType<Context["fhirVersion"]>>(
    op: Op,
    ctx: CTX,
    resourceType: T,
    input: OPMetadata<Op>["Input"],
  ): Promise<OPMetadata<Op>["Output"]>;
  invoke_instance<Context extends CTX, Op extends IOperation<any, any>,  T extends VersionedResourceType<Context["fhirVersion"]>>(
    op: Op,
    ctx: CTX,
    resourceType: T,
    id: VERSIONED_FHIR[Context["fhirVersion"]]["id"],
    input: OPMetadata<Op>["Input"],
  ): Promise<OPMetadata<Op>["Output"]>;
  transaction<Context extends CTX>(ctx: CTX, bundle: VERSIONED_FHIR[Context["fhirVersion"]]["Bundle"]): Promise<VERSIONED_FHIR[Context["fhirVersion"]]["Bundle"]>;
  batch<Context extends CTX>(ctx: CTX, bundle: VERSIONED_FHIR[Context["fhirVersion"]]["Bundle"]): Promise<VERSIONED_FHIR[Context["fhirVersion"]]["Bundle"]>;
}
