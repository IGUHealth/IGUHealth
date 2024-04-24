import * as r4 from "./generated/r4/types.js";
import * as r4b from "./generated/r4b/types.js";

export type R4 = "4.0";
export type R4B = "4.3";

export const R4: R4 = "4.0";
export const R4B: R4B = "4.3";

export const FHIR_VERSIONS_SUPPORTED: [R4, R4B] = [R4, R4B];
export type FHIR_VERSION = (typeof FHIR_VERSIONS_SUPPORTED)[number];

export type VERSIONED_FHIR = {
  "4.0": {
    Bundle: r4.Bundle;
    BundleEntry: r4.BundleEntry;
    CapabilityStatement: r4.CapabilityStatement;
    Resource: r4.Resource;
    ResourceType: r4.ResourceType;
    id: r4.id;
  };
  "4.3": {
    Bundle: r4b.Bundle;
    BundleEntry: r4b.BundleEntry;
    CapabilityStatement: r4b.CapabilityStatement;
    Resource: r4b.Resource;
    ResourceType: r4b.ResourceType;
    id: r4b.id;
  };
};

export type VersionedResourceType<
  Version extends (typeof FHIR_VERSIONS_SUPPORTED)[number],
> = Version extends R4
  ? r4.ResourceType
  : Version extends R4B
    ? r4b.ResourceType
    : never;

export type AllResourceTypes = r4.ResourceType | r4b.ResourceType;

export type VersionedAResource<
  Version extends (typeof FHIR_VERSIONS_SUPPORTED)[number],
  Type extends AllResourceTypes,
> = Version extends R4
  ? Type extends r4.ResourceType
    ? r4.AResource<Type>
    : never
  : Version extends R4B
    ? Type extends r4b.ResourceType
      ? r4b.AResource<Type>
      : never
    : never;
