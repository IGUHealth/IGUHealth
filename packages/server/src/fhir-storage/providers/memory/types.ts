import { id } from "@iguhealth/fhir-types/r4/types";
import * as r4b from "@iguhealth/fhir-types/r4b/types";
import {
  FHIR_VERSION,
  VersionedAResource,
  VersionedResourceType,
} from "@iguhealth/fhir-types/versions";

export type InternalData<
  Version extends FHIR_VERSION,
  T extends VersionedResourceType<FHIR_VERSION>,
> = Partial<
  Record<T, Record<id | r4b.id, VersionedAResource<Version, T> | undefined>>
>;
