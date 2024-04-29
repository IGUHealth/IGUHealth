import * as r4 from "./generated/r4/types.js";
import * as r4b from "./generated/r4b/types.js";

export type R4 = "4.0";
export type R4B = "4.3";

export const R4: R4 = "4.0";
export const R4B: R4B = "4.3";

export const FHIR_VERSIONS_SUPPORTED: [R4, R4B] = [R4, R4B];
export type FHIR_VERSION = (typeof FHIR_VERSIONS_SUPPORTED)[number];

export type ResourceType<
  Version extends (typeof FHIR_VERSIONS_SUPPORTED)[number],
> = Version extends R4
  ? r4.ResourceType
  : Version extends R4B
    ? r4b.ResourceType
    : never;

export type AllResourceTypes = r4.ResourceType | r4b.ResourceType;

export type Resource<
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
