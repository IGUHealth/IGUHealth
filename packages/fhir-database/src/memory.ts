import { FHIRURL, ParsedParameter } from "@genfhi/fhir-query";
import { Bundle, Resource, id } from "@genfhi/fhir-types/r4/types";
import { FHIRDataBase } from "./types";

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

export default class MemoryDatabase implements FHIRDataBase {
  data: InternalData;
  constructor(data?: InternalData) {
    this.data = data || {};
  }
  search(query: FHIRURL): Resource[] {
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
  create<T extends Resource>(resource: T): T {
    const resources = this.data[resource.resourceType];
    this.data[resource.resourceType] = [...(resources || []), resource];
    return resource;
  }
  update<T extends Resource>(resource: T): T {
    const filtered = this.data[resource.resourceType]?.filter(
      (v) => v.id === resource.id
    );
    this.data[resource.resourceType] = filtered;
    return resource;
  }
  // [ADD JSON PATCH TYPES]
  patch<T extends Resource>(resource: T, patches: any): T {
    throw new Error("Not Implemented");
  }
  read(resourceType: string, id: id): Resource {
    throw new Error("Not Implemented");
  }
  vread(resourceType: string, id: id, versionId: id): Resource {
    throw new Error("Not Implemented");
  }
  delete(resourceType: string, id: id) {
    throw new Error("Not Implemented");
  }
  historySystem(): Resource[] {
    throw new Error("Not Implemented");
  }
  historyType(resourceType: string): Resource[] {
    throw new Error("Not Implemented");
  }
  historyInstance(resourceType: string, id: string): Resource[] {
    throw new Error("Not Implemented");
  }
}
