import { FHIRURL } from "@iguhealth/fhir-query";
import {
  AResource,
  Resource,
  ResourceType,
  id,
} from "@iguhealth/fhir-types/r4/types";

import { MiddlewareSync, MiddlewareAsync } from "./middleware/index.js";
import { FHIRClientAsync, FHIRClientSync } from "./interface";
import { FHIRRequest, FHIRResponse } from "./types";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

export class AsynchronousClient<State, CTX> implements FHIRClientAsync<CTX> {
  state: State;
  middleware: MiddlewareAsync<State, CTX>;
  constructor(initialState: State, middleware: MiddlewareAsync<State, CTX>) {
    this.state = initialState;
    this.middleware = middleware;
  }
  async request(ctx: CTX, request: FHIRRequest): Promise<FHIRResponse> {
    const res = await this.middleware(request, { ctx, state: this.state });
    this.state = res.state;
    return res.response;
  }
  async search_system(ctx: CTX, fhirURL: FHIRURL): Promise<Resource[]> {
    const response = await this.request(ctx, {
      type: "search-request",
      level: "system",
      query: fhirURL,
    });
    if (response.type !== "search-response")
      throw new Error("Unexpected response type");
    return response.body;
  }
  async search_type<T extends ResourceType>(
    ctx: CTX,
    resourceType: T,
    fhirURL: FHIRURL
  ): Promise<AResource<T>[]> {
    const response = await this.request(ctx, {
      type: "search-request",
      level: "type",
      resourceType: resourceType,
      query: fhirURL,
    });
    if (response.type !== "search-response")
      throw new Error(`Unexpected response type '${response.type}'`);
    return response.body as AResource<T>[];
  }
  async create<T extends Resource>(ctx: CTX, resource: T): Promise<T> {
    const response = await this.request(ctx, {
      type: "create-request",
      level: "type",
      resourceType: resource.resourceType,
      body: resource,
    });
    if (response.type !== "create-response")
      throw new Error("Unexpected response type");
    return response.body as T;
  }
  async update<T extends Resource>(ctx: CTX, resource: T): Promise<T> {
    if (resource.id === undefined)
      throw new Error("Cannot update resource without id");
    const response = await this.request(ctx, {
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
  async patch<T extends Resource>(
    ctx: CTX,
    resource: T,
    patches: any
  ): Promise<T> {
    if (resource.id === undefined)
      throw new OperationError(
        outcomeError("invalid", "Cannot patch resource without id")
      );
    const response = await this.request(ctx, {
      type: "patch-request",
      level: "instance",
      resourceType: resource.resourceType,
      id: resource.id,
      body: resource,
    });
    if (response.type !== "patch-response")
      throw new Error("Unexpected response type");
    return response.body as T;
  }
  async read<T extends ResourceType>(
    ctx: CTX,
    resourceType: T,
    id: id
  ): Promise<AResource<T> | undefined> {
    const response = await this.request(ctx, {
      type: "read-request",
      level: "instance",
      resourceType: resourceType,
      id: id,
    });
    if (response.type !== "read-response")
      throw new Error("Unexpected response type");
    return response.body as AResource<T> | undefined;
  }
  async vread<T extends ResourceType>(
    ctx: CTX,
    resourceType: T,
    id: id,
    versionId: id
  ): Promise<AResource<T>> {
    const response = await this.request(ctx, {
      type: "vread-request",
      level: "instance",
      resourceType: resourceType,
      id: id,
      versionId: versionId,
    });
    if (response.type !== "vread-response")
      throw new Error("Unexpected response type");
    return response.body as AResource<T>;
  }
  async delete<T extends ResourceType>(ctx: CTX, resourceType: T, id: id) {
    const response = await this.request(ctx, {
      type: "delete-request",
      level: "instance",
      resourceType: resourceType,
      id: id,
    });
    if (response.type !== "delete-response")
      throw new Error("Unexpected response type");
  }
  async historySystem(ctx: CTX): Promise<Resource[]> {
    const response = await this.request(ctx, {
      type: "history-request",
      level: "system",
    });
    if (response.type !== "history-response")
      throw new Error("Unexpected response type");
    return response.body;
  }
  async historyType<T extends ResourceType>(
    ctx: CTX,
    resourceType: T
  ): Promise<AResource<T>[]> {
    const response = await this.request(ctx, {
      type: "history-request",
      level: "type",
      resourceType: resourceType,
    });
    if (response.type !== "history-response")
      throw new Error("Unexpected response type");
    return response.body as AResource<T>[];
  }
  async historyInstance<T extends ResourceType>(
    ctx: CTX,
    resourceType: T,
    id: string
  ): Promise<AResource<T>[]> {
    const response = await this.request(ctx, {
      type: "history-request",
      level: "instance",
      resourceType: resourceType,
      id: id,
    });
    if (response.type !== "history-response")
      throw new Error("Unexpected response type");
    return response.body as AResource<T>[];
  }
}

export class SynchronousClient<State, CTX> implements FHIRClientSync<CTX> {
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
    if (resource.id === undefined)
      throw new Error("Cannot patch resource without id");
    const response = this.request(ctx, {
      type: "patch-request",
      level: "instance",
      resourceType: resource.resourceType,
      id: resource.id,
      body: resource,
    });
    if (response.type !== "patch-response")
      throw new Error("Unexpected response type");
    return response.body as T;
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
    return response.body as AResource<T> | undefined;
  }
  vread<T extends ResourceType>(
    ctx: CTX,
    resourceType: T,
    id: id,
    versionId: id
  ): AResource<T> {
    const response = this.request(ctx, {
      type: "vread-request",
      level: "instance",
      resourceType: resourceType,
      id: id,
      versionId: versionId,
    });
    if (response.type !== "vread-response")
      throw new Error("Unexpected response type");
    return response.body as AResource<T>;
  }
  delete<T extends ResourceType>(ctx: CTX, resourceType: T, id: id) {
    const response = this.request(ctx, {
      type: "delete-request",
      level: "instance",
      resourceType: resourceType,
      id: id,
    });
    if (response.type !== "delete-response")
      throw new Error("Unexpected response type");
  }
  historySystem(ctx: CTX): Resource[] {
    const response = this.request(ctx, {
      type: "history-request",
      level: "system",
    });
    if (response.type !== "history-response")
      throw new Error("Unexpected response type");
    return response.body;
  }
  historyType<T extends ResourceType>(
    ctx: CTX,
    resourceType: T
  ): AResource<T>[] {
    const response = this.request(ctx, {
      type: "history-request",
      level: "type",
      resourceType: resourceType,
    });
    if (response.type !== "history-response")
      throw new Error("Unexpected response type");
    return response.body as AResource<T>[];
  }
  historyInstance<T extends ResourceType>(
    ctx: CTX,
    resourceType: T,
    id: string
  ): AResource<T>[] {
    const response = this.request(ctx, {
      type: "history-request",
      level: "instance",
      resourceType: resourceType,
      id: id,
    });
    if (response.type !== "history-response")
      throw new Error("Unexpected response type");
    return response.body as AResource<T>[];
  }
}
