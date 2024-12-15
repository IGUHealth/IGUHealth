import * as s from "zapatos/schema";

import {
  AllResourceTypes,
  FHIR_VERSION,
  Resource,
} from "@iguhealth/fhir-types/versions";

export interface ResourceStore<CTX> {
  read<Version extends FHIR_VERSION>(
    ctx: CTX,
    fhirVersion: Version,
    version_ids: string[],
  ): Promise<Resource<Version, AllResourceTypes>[]>;

  insert<Version extends FHIR_VERSION>(
    ctx: CTX,
    data: s.resources.Insertable[],
  ): Promise<Resource<Version, AllResourceTypes>[]>;
}
