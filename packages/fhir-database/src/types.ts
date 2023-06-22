import { FHIRURL } from "@genfhi/fhir-query";
import {
  Bundle,
  Resource,
  id,
  ResourceType,
} from "@genfhi/fhir-types/r4/types";

export interface FHIRDataBase {
  search(query: FHIRURL): Resource[];
  create<T extends Resource>(resource: T): T;
  update<T extends Resource>(resource: T): T;
  // [ADD JSON PATCH TYPES]
  patch<T extends Resource>(resource: T, patches: any): T;
  read(resourceType: ResourceType, id: id): Resource;
  vread(resourceType: ResourceType, id: id, versionId: id): Resource;
  delete(resourceType: ResourceType, id: id): void;
  historySystem(): Resource[];
  historyType(resourceType: ResourceType): Resource[];
  historyInstance(resourceType: ResourceType, id: id): Resource[];
}
