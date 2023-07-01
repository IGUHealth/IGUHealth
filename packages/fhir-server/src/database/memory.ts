import { FHIRURL, ParsedParameter } from "@genfhi/fhir-query";
import {
  ResourceType,
  AResource,
  Resource,
  id,
} from "@genfhi/fhir-types/r4/types";
import { FHIRClientSync } from "./types";
import { FHIRRequest, FHIRResponse } from "../types";

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
      // Q hack because safe in requires explicit string properties it seems.
      const value = (resource as unknown as Record<string, string | number>)[
        criteria.name
      ];
      if (Array.isArray(value)) {
        return value.some((v) => criteria.value.indexOf(v) !== -1);
      }
      return criteria.value.indexOf(value) !== -1;
    }
    default:
      throw new Error(`Not supported '${criteria.name}'`);
  }
}

// export interface Middleware {
//   (request: Request, state: State, next: Next): Promise<Response>;
// }

type Middleware<State, CTX> = (
  request: FHIRRequest,
  args: { ctx: CTX; state: State },
  next?: Middleware<State, CTX>
) => Promise<{ ctx: CTX; state: State; response: FHIRResponse }>;

type MiddlewareSync<State, CTX> = (
  request: FHIRRequest,
  args: { ctx: CTX; state: State },
  next?: Middleware<State, CTX>
) => { ctx: CTX; state: State; response: FHIRResponse };

function MemoryMiddleware<
  State extends { data: InternalData<ResourceType> },
  CTX extends any
>(
  request: FHIRRequest,
  args: { ctx: CTX; state: State },
  next?: Middleware<State, CTX>
): { ctx: CTX; state: State; response: FHIRResponse } {
  switch (request.type) {
    case "search-request": {
      const resourceSet =
        request.level === "type"
          ? Object.values(
              args.state.data[request.resourceType as ResourceType] || {}
            ).filter((v): v is Resource => v !== undefined)
          : Object.keys(args.state.data)
              .map((k) =>
                Object.values(args.state.data[k as ResourceType] || {})
              )
              .filter((v): v is Resource[] => v !== undefined)
              .flat();
      const output = (resourceSet || []).filter((resource) => {
        for (let param of Object.values(request.query.parameters)) {
          if (!fitsSearchCriteria(param, resource)) return false;
        }
        return true;
      });
      if (request.level === "system") {
        return {
          state: args.state,
          ctx: args.ctx,
          response: {
            level: request.level,
            query: request.query,
            type: "search-response",
            body: output,
          },
        };
      }
      return {
        state: args.state,
        ctx: args.ctx,
        response: {
          resourceType: request.resourceType,
          level: "type",
          query: request.query,
          type: "search-response",
          body: output,
        },
      };
    }
    case "update-request": {
      const resource = request.body;
      if (!resource.id)
        throw new Error("Updated resource does not have an id.");
      args.state.data[resource.resourceType] = {
        ...args.state.data[resource.resourceType],
        [resource.id]: resource,
      };
      return {
        state: args.state,
        ctx: args.ctx,
        response: {
          level: "instance",
          type: "update-response",
          resourceType: request.resourceType,
          id: resource.id,
          body: resource,
        },
      };
    }
    case "create-request": {
      const resource = request.body;
      const resources = args.state.data[request.resourceType as ResourceType];
      if (!resource?.id)
        resource.id = `${Math.round(Math.random() * 100000000)}`;
      args.state.data[resource.resourceType] = {
        ...resources,
        [resource.id]: resource,
      };
      return {
        state: args.state,
        ctx: args.ctx,
        response: {
          level: "type",
          type: "create-response",
          resourceType: request.resourceType,
          body: resource,
        },
      };
    }
    case "read-request": {
      const data =
        args.state.data[request.resourceType as ResourceType]?.[request.id];
      if (!data) {
        throw new Error(
          `Not found resource of type '${request.resourceType}' with id '${request.id}'`
        );
      }
      return {
        state: args.state,
        ctx: args.ctx,
        response: {
          level: "instance",
          type: "read-response",
          resourceType: request.resourceType,
          id: request.id,
          body: data,
        },
      };
    }
    default:
      throw new Error("Not implemented");
  }
}

class SynchronousClient<State, CTX> implements FHIRClientSync<CTX> {
  state: State;
  middleware: MiddlewareSync<State, CTX>;
  constructor(initialState: State, middleware: MiddlewareSync<State, CTX>) {
    this.state = initialState;
    this.middleware = middleware;
  }
  request(ctx: CTX, request: FHIRRequest): FHIRResponse {
    const res = this.middleware(request, { ctx, state: this.state });
    this.state = res.state;
    return res.response;
  }
  search_system(ctx: CTX, fhirURL: FHIRURL): Resource[] {
    const response = this.request(ctx, {
      type: "search-request",
      level: "system",
      query: fhirURL,
    });
    if (response.type !== "search-response")
      throw new Error("Unexpected response type");
    return response.body;
  }
  search_type<T extends ResourceType>(
    ctx: CTX,
    resourceType: T,
    fhirURL: FHIRURL
  ): AResource<T>[] {
    const response = this.request(ctx, {
      type: "search-request",
      level: "type",
      resourceType: resourceType,
      query: fhirURL,
    });
    if (response.type !== "search-response")
      throw new Error("Unexpected response type");
    return response.body as AResource<T>[];
  }
  create<T extends Resource>(ctx: CTX, resource: T): T {
    const response = this.request(ctx, {
      type: "create-request",
      level: "type",
      resourceType: resource.resourceType,
      body: resource,
    });
    if (response.type !== "create-response")
      throw new Error("Unexpected response type");
    return response.body as T;
  }
  update<T extends Resource>(ctx: CTX, resource: T): T {
    if (resource.id === undefined)
      throw new Error("Cannot update resource without id");
    const response = this.request(ctx, {
      type: "update-request",
      level: "instance",
      resourceType: resource.resourceType,
      id: resource.id,
      body: resource,
    });
    if (response.type !== "update-response")
      throw new Error("Unexpected response type");
    return response.body as T;
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
    const response = this.request(ctx, {
      type: "read-request",
      level: "instance",
      resourceType: resourceType,
      id: id,
    });
    if (response.type !== "read-response")
      throw new Error("Unexpected response type");
    return response.body as AResource<T>;
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

export default function createMemoryDatabase<CTX>(
  data: InternalData<ResourceType>
): SynchronousClient<{ data: InternalData<ResourceType> }, CTX> {
  return new SynchronousClient<{ data: InternalData<ResourceType> }, CTX>(
    { data: data },
    MemoryMiddleware
  );
}
