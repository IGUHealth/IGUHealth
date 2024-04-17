import * as r4 from "@iguhealth/fhir-types/r4/types";
import * as r4b from "@iguhealth/fhir-types/r4b/types";

export type R4 = "4.0";
export type R4B = "4.3";

export const FHIR_VERSIONS_SUPPORTED: [R4, R4B] = ["4.0", "4.3"];

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

export type VersionedAResource<
  Version extends (typeof FHIR_VERSIONS_SUPPORTED)[number],
  Type extends VersionedResourceType<Version>,
> = Type extends r4.ResourceType
  ? r4.AResource<Type>
  : Type extends r4b.ResourceType
    ? r4b.AResource<Type>
    : never;
