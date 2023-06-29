import { FHIRURL, ParsedParameter } from "@genfhi/fhir-query";
import {
  ResourceType,
  AResource,
  Resource,
  id,
} from "@genfhi/fhir-types/r4/types";
import { FHIRClientAsync, FHIRClientSynchronous } from "./types";

type InternalData = Partial<Record<string, Record<id, Resource | undefined>>>;

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

export default class MemoryDatabase<CTX> implements FHIRClientSynchronous<CTX> {
  data: InternalData;
  constructor(data?: InternalData) {
    this.data = data || {};
  }
  search(ctx: CTX, query: FHIRURL): Resource[] {
    const resourceSet = query.resourceType
      ? Object.values(this.data[query.resourceType] || {}).filter(
          (v): v is Resource => v !== undefined
        )
      : Object.keys(this.data)
          .map((k) => Object.values(this.data[k] || {}))
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
  create<T extends Resource>(ctx: CTX, resource: T): T {
    const resources = this.data[resource.resourceType];
    if (!resource.id) resource.id = `${Math.round(Math.random() * 100000000)}`;
    this.data[resource.resourceType] = {
      ...resources,
      [resource.id]: resource,
    };
    return resource;
  }
  update<T extends Resource>(ctx: CTX, resource: T): T {
    if (!resource.id) throw new Error("Updated resource does not have an id.");
    this.data[resource.resourceType] = {
      ...this.data[resource.resourceType],
      [resource.id]: resource,
    };
    return resource;
  }
  // [ADD JSON PATCH TYPES]
  patch<T extends Resource>(ctx: CTX, resource: T, patches: any): T {
    throw new Error("Not Implemented");
  }
  read<T extends ResourceType>(
    ctx: CTX,
    resourceType: T,
    id: id
  ): AResource<T> | undefined {
    const data = this.data[resourceType]?.[id] as AResource<T>;
    if (!data) {
      console.error(
        `Not found resource of type '${resourceType}' with id '${id}'`
      );
      return;
    }
    return data;
  }
  vread<T extends ResourceType>(
    ctx: CTX,
    resourceType: T,
    id: id,
    versionId: id
  ): AResource<T> {
    throw new Error("Not Implemented");
  }
  delete<T extends ResourceType>(ctx: CTX, resourceType: T, id: id) {
    throw new Error("Not Implemented");
  }
  historySystem(ctx: CTX): Resource[] {
    throw new Error("Not Implemented");
  }
  historyType<T extends ResourceType>(
    ctx: CTX,
    resourceType: T
  ): AResource<T>[] {
    throw new Error("Not Implemented");
  }
  historyInstance<T extends ResourceType>(
    ctx: CTX,
    resourceType: T,
    id: string
  ): AResource<T>[] {
    throw new Error("Not Implemented");
  }
}
