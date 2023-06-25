import { FHIRURL, ParsedParameter } from "@genfhi/fhir-query";
import {
  ResourceType,
  AResource,
  Resource,
  id,
} from "@genfhi/fhir-types/r4/types";
import { FHIRClient } from "./types";

type InternalData = Record<string, Resource[] | undefined>;

function fitsSearchCriteria(
  criteria: ParsedParameter<unknown>,
  resource: Resource
): boolean {
  if (criteria.modifier) throw new Error("Modifiers not supported");
  switch (criteria.name) {
    case "name":
    case "url":
      return (
        // Q hack because safe in requires explicit string properties it seems.
        criteria.name in resource &&
        (resource as unknown as Record<string, unknown>)[criteria.name] ===
          criteria.value
      );
    default:
      throw new Error(`Not supported '${criteria.name}'`);
  }
}

export default class MemoryDatabase implements FHIRClient {
  data: InternalData;
  constructor(data?: InternalData) {
    this.data = data || {};
  }
  async search(query: FHIRURL): Promise<Resource[]> {
    const resourceSet = query.resourceType
      ? this.data[query.resourceType]
      : Object.keys(this.data)
          .map((k) => this.data[k])
          .filter((v): v is Resource[] => v !== undefined)
          .flat();

    return (resourceSet || []).filter((resource) => {
      for (let param of Object.values(query.parameters)) {
        if (!fitsSearchCriteria(param, resource)) return false;
        return true;
      }
      return true;
    });
  }
  async create<T extends Resource>(resource: T): Promise<T> {
    const resources = this.data[resource.resourceType];
    this.data[resource.resourceType] = [...(resources || []), resource];
    return resource;
  }
  async update<T extends Resource>(resource: T): Promise<T> {
    const filtered = this.data[resource.resourceType]?.filter(
      (v) => v.id === resource.id
    );
    this.data[resource.resourceType] = filtered;
    return resource;
  }
  // [ADD JSON PATCH TYPES]
  patch<T extends Resource>(resource: T, patches: any): Promise<T> {
    throw new Error("Not Implemented");
  }
  read<T extends ResourceType>(resourceType: T, id: id): Promise<AResource<T>> {
    throw new Error("Not Implemented");
  }
  vread<T extends ResourceType>(
    resourceType: T,
    id: id,
    versionId: id
  ): Promise<AResource<T>> {
    throw new Error("Not Implemented");
  }
  delete<T extends ResourceType>(resourceType: T, id: id) {
    throw new Error("Not Implemented");
  }
  historySystem(): Promise<Resource[]> {
    throw new Error("Not Implemented");
  }
  historyType<T extends ResourceType>(
    resourceType: T
  ): Promise<AResource<T>[]> {
    throw new Error("Not Implemented");
  }
  historyInstance<T extends ResourceType>(
    resourceType: T,
    id: string
  ): Promise<AResource<T>[]> {
    throw new Error("Not Implemented");
  }
}
