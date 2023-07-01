import { FHIRURL, Parameters } from "@genfhi/fhir-query";
import {
  ConcreteType,
  ResourceMap,
  ResourceType,
  AResource,
} from "@genfhi/fhir-types/r4/types";
import { FHIRRequest, FHIRResponse } from "../types";
import { FHIRClient, FHIRClientAsync } from "./types";

type InteractionSupported<T> = keyof FHIRClient<T>;
type InteractionsSupported<T> = InteractionSupported<T>[];

type Source<T> = {
  resourcesSupported: ResourceType[];
  interactionsSupported: InteractionsSupported<T>;
  source: FHIRClient<T>;
};
type Sources<T> = Source<T>[];

type Constraint<T> = Partial<
  Pick<Source<T>, "resourcesSupported" | "interactionsSupported">
>;

function findSource<T>(
  sources: Sources<T>,
  constraints: Constraint<T>
): Sources<T> {
  return sources.filter((source) => {
    return (
      source.resourcesSupported.every((resource) =>
        constraints.resourcesSupported?.includes(resource)
      ) &&
      source.interactionsSupported.every((interaction) =>
        constraints.interactionsSupported?.includes(interaction)
      )
    );
  });
}

export class Router<CTX> implements FHIRClientAsync<CTX> {
  private sources: Sources<CTX>;
  constructor(sources: Sources<CTX>) {
    this.sources = sources;
  }
  async request(ctx: CTX, request: FHIRRequest): Promise<FHIRResponse> {
    throw new Error("Method not implemented.");
  }
  async search_system(ctx: CTX, query: FHIRURL): Promise<ConcreteType[]> {
    const responses = findSource(this.sources, {
      interactionsSupported: ["search_system"],
    }).map((source) => source.source.search_system(ctx, query));
    const resources = (await Promise.all(responses)).flat();
    return resources;
  }
  async search_type<T extends ResourceType>(
    ctx: CTX,
    type: T,
    query: FHIRURL
  ): Promise<AResource<T>[]> {
    const responses = findSource(this.sources, {
      interactionsSupported: ["search_system"],
      resourcesSupported: [type],
    }).map((source) => source.source.search_type(ctx, type, query));
    const resources = (await Promise.all(responses)).flat();
    return resources;
  }
  async create<T extends ConcreteType>(ctx: CTX, resource: T): Promise<T> {
    const sources = findSource(this.sources, {
      interactionsSupported: ["create"],
      resourcesSupported: [resource.resourceType],
    });
    if (sources.length !== 1)
      throw new Error(
        `Only one source can support create per resource type '${resource.resourceType}'`
      );
    const source = sources[0];

    return source.source.create(ctx, resource);
  }
  async update<T extends ConcreteType>(ctx: CTX, resource: T): Promise<T> {
    const sources = findSource(this.sources, {
      interactionsSupported: ["update"],
      resourcesSupported: [resource.resourceType],
    });
    if (sources.length !== 1)
      throw new Error(
        `Only one source can support update per resource type '${resource.resourceType}'`
      );
    const source = sources[0];

    return source.source.update(ctx, resource);
  }
  async patch<T extends ConcreteType>(
    ctx: CTX,
    resource: T,
    patches: any
  ): Promise<T> {
    const sources = findSource(this.sources, {
      interactionsSupported: ["patch"],
      resourcesSupported: [resource.resourceType],
    });
    if (sources.length !== 1)
      throw new Error(
        `Only one source can support patch per resource type '${resource.resourceType}'`
      );
    const source = sources[0];

    return source.source.patch(ctx, resource, patches);
  }
  async read<T extends keyof ResourceMap>(
    ctx: CTX,
    resourceType: T,
    id: string
  ): Promise<AResource<T> | undefined> {
    const sources = findSource(this.sources, {
      interactionsSupported: ["read"],
      resourcesSupported: [resourceType],
    });
    if (sources.length !== 1)
      throw new Error(
        `Only one source can support read per resource type '${resourceType}'`
      );
    const source = sources[0];

    return source.source.read(ctx, resourceType, id);
  }
  async vread<T extends ResourceType>(
    ctx: CTX,
    resourceType: T,
    id: string,
    versionId: string
  ): Promise<AResource<T>> {
    const sources = findSource(this.sources, {
      interactionsSupported: ["vread"],
      resourcesSupported: [resourceType],
    });
    if (sources.length !== 1)
      throw new Error(
        `Only one source can support vread per resource type '${resourceType}'`
      );
    const source = sources[0];

    return source.source.vread(ctx, resourceType, id, versionId);
  }
  async delete(
    ctx: CTX,
    resourceType: keyof ResourceMap,
    id: string
  ): Promise<void> {
    const sources = findSource(this.sources, {
      interactionsSupported: ["vread"],
      resourcesSupported: [resourceType],
    });
    if (sources.length !== 1)
      throw new Error(
        `Only one source can support vread per resource type '${resourceType}'`
      );
    const source = sources[0];

    return source.source.delete(ctx, resourceType, id);
  }
  async historySystem(ctx: CTX): Promise<ConcreteType[]> {
    const sources = findSource(this.sources, {
      interactionsSupported: ["historySystem"],
    });
    const result = await Promise.all(
      sources.map((source) => source.source.historySystem(ctx))
    );
    return result.flat();
  }
  async historyType<T extends ResourceType>(
    ctx: CTX,
    resourceType: T
  ): Promise<AResource<T>[]> {
    const sources = findSource(this.sources, {
      interactionsSupported: ["historyType"],
    });
    const result = await Promise.all(
      sources.map((source) => source.source.historyType(ctx, resourceType))
    );
    return result.flat();
  }
  async historyInstance<T extends ResourceType>(
    ctx: CTX,
    resourceType: T,
    id: string
  ): Promise<AResource<T>[]> {
    const sources = findSource(this.sources, {
      interactionsSupported: ["historyInstance"],
      resourcesSupported: [resourceType],
    });
    if (sources.length !== 1)
      throw new Error(
        `Only one source can support historyInstance per resource type '${resourceType}'`
      );
    const source = sources[0];

    return source.source.historyInstance(ctx, resourceType, id);
  }
}
