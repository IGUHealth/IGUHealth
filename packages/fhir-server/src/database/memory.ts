import { FHIRURL, ParsedParameter } from "@genfhi/fhir-query";
import {
  ResourceType,
  AResource,
  Resource,
  id,
} from "@genfhi/fhir-types/r4/types";
import { FHIRClientAsync, FHIRClientSync } from "./types";

type InternalData<T extends ResourceType> = Partial<
  Record<T, Record<id, AResource<T> | undefined>>
>;

function fitsSearchCriteria(
  criteria: ParsedParameter<unknown>,
  resource: Resource
): boolean {
  if (criteria.modifier) throw new Error("Modifiers not supported");
  switch (criteria.name) {
    case "base":
    case "name":
    case "type":
    case "url": {
      const value = (resource as unknown as Record<string, string | number>)[
        criteria.name
      ];
      if (Array.isArray(value)) {
        return value.some((v) => criteria.value.indexOf(v) !== -1);
      }
      return (
        // Q hack because safe in requires explicit string properties it seems.
        criteria.value.indexOf(value) !== -1
      );
    }
    default:
      throw new Error(`Not supported '${criteria.name}'`);
  }
}

export default class MemoryDatabase<CTX> implements FHIRClientSync<CTX> {
  data: InternalData<ResourceType>;
  constructor(data?: InternalData<ResourceType>) {
    this.data = data || {};
  }
  search_system(ctx: CTX, parameters: FHIRURL["parameters"]): Resource[] {
    const resourceSet = Object.keys(this.data)
      .map((k) => Object.values(this.data[k as ResourceType] || {}))
      .filter((v): v is Resource[] => v !== undefined)
      .flat();

    const output = (resourceSet || []).filter((resource) => {
      for (let param of Object.values(parameters)) {
        if (!fitsSearchCriteria(param, resource)) return false;
      }
      return true;
    });

    return output;
  }
  search_type<T extends ResourceType>(
    ctx: CTX,
    resourceType: T,
    parameters: FHIRURL["parameters"]
  ): AResource<T>[] {
    const resourceSet = Object.values(this.data[resourceType] || {}).filter(
      (v): v is AResource<T> => v !== undefined
    );

    const output = (resourceSet || []).filter((resource) => {
      for (let param of Object.values(parameters)) {
        if (!fitsSearchCriteria(param, resource)) return false;
      }
      return true;
    });

    return output;
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
