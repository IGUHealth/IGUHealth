import { FHIRURL } from "@genfhi/fhir-query";
import {
  Bundle,
  Resource,
  id,
  ResourceType,
  AResource,
} from "@genfhi/fhir-types/r4/types";

export interface FHIRClient {
  search(query: FHIRURL): Promise<Resource[]>;
  create<T extends Resource>(resource: T): Promise<T>;
  update<T extends Resource>(resource: T): Promise<T>;
  // [ADD JSON PATCH TYPES]
  patch<T extends Resource>(resource: T, patches: any): Promise<T>;
  read<T extends ResourceType>(resourceType: T, id: id): Promise<AResource<T>>;
  vread<T extends ResourceType>(
    resourceType: T,
    id: id,
    versionId: id
  ): Promise<AResource<T>>;
  delete(resourceType: ResourceType, id: id): void;
  historySystem(): Promise<Resource[]>;
  historyType<T extends ResourceType>(resourceType: T): Promise<AResource<T>[]>;
  historyInstance<T extends ResourceType>(
    resourceType: T,
    id: id
  ): Promise<AResource<T>[]>;
}
