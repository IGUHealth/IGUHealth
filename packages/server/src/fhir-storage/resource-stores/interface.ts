import {
  FHIR_VERSION,
  Resource,
  AllResourceTypes,
} from "@iguhealth/fhir-types/versions";
import * as s from "zapatos/schema";

export interface ResourceStore {
  read<Version extends FHIR_VERSION>(
    fhirVersion: Version,
    version_ids: string[],
  ): Promise<Resource<Version, AllResourceTypes>[]>;

  insert<Version extends FHIR_VERSION>(
    data: s.resources.Insertable[],
  ): Promise<Resource<Version, AllResourceTypes>[]>;
}
