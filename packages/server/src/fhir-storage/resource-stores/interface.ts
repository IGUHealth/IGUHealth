import {
  FHIR_VERSION,
  Resource,
  AllResourceTypes,
} from "@iguhealth/fhir-types/versions";

export interface ResourceStore {
  read<Version extends FHIR_VERSION>(
    fhirVersion: Version,
    id: string[],
  ): Promise<Resource<Version, AllResourceTypes>[]>;

  create<Version extends FHIR_VERSION>(
    fhirVersion: Version,
    resources: Resource<Version, AllResourceTypes>[],
  ): Promise<Resource<Version, AllResourceTypes>[]>;

  delete<Version extends FHIR_VERSION>(
    fhirVersion: Version,
    id: string[],
  ): Promise<void>;
}
