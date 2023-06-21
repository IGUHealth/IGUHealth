import { FHIRURL } from "@genfhi/fhir-query";
import { Bundle, Resource, id } from "@genfhi/fhir-types/r4/types";

export interface FHIRDataBase {
  search(query: FHIRURL): Resource[];
  create<T extends Resource>(resource: T): T;
  update<T extends Resource>(resource: T): T;
  // [ADD JSON PATCH TYPES]
  patch<T extends Resource>(resource: T, patches: any): T;
  read(resourceType: string, id: id): Resource;
  vread(resourceType: string, id: id, versionId: id): Resource;
  delete(resourceType: string, id: id);
  historySystem(): Resource[];
  historyType(resourceType: string): Resource[];
  historyInstance(resourceType: string, id: id): Resource[];
}
