import {
  SystemSearchRequest,
  TypeSearchRequest,
} from "@iguhealth/client/types";
import { id } from "@iguhealth/fhir-types/r4/types";
import {
  AllResourceTypes,
  FHIR_VERSION,
  Resource,
  ResourceType,
} from "@iguhealth/fhir-types/versions";

export type FHIRSearchRequest =
  | SystemSearchRequest<FHIR_VERSION>
  | TypeSearchRequest<FHIR_VERSION>;

export type SearchResult = { version_id: id; id: id; type: AllResourceTypes };

export interface SearchEngine<CTX> {
  search(
    ctx: CTX,
    fhirRequest: FHIRSearchRequest,
  ): Promise<{
    total?: number;
    result: SearchResult[];
  }>;

  index<Version extends FHIR_VERSION>(
    ctx: CTX,
    fhirVersion: Version,
    resource: Resource<Version, AllResourceTypes>,
  ): Promise<void>;

  removeIndex<Version extends FHIR_VERSION>(
    ctx: CTX,
    fhirVersion: Version,
    id: id,
    resourceType: ResourceType<Version>,
  ): Promise<void>;
}
