import type { ParsedParameter } from "./url";
import {
  Bundle,
  AResource,
  Resource,
  ResourceType,
  id,
  CapabilityStatement,
} from "@iguhealth/fhir-types/r4/types";
import type { OPMetadata, IOperation } from "@iguhealth/operation-execution";

import type { FHIRClientAsync, FHIRClientSync } from "./interface.js";
import type { FHIRRequest, FHIRResponse } from "./types.js";
import { MiddlewareSync, MiddlewareAsync } from "./middleware/index.js";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

export class AsynchronousClient<State, CTX> implements FHIRClientAsync<CTX> {
  private state: State;
  private middleware: MiddlewareAsync<State, CTX>;
  constructor(initialState: State, middleware: MiddlewareAsync<State, CTX>) {
    this.state = initialState;
    this.middleware = middleware;
  }
  async capabilities(ctx: CTX): Promise<CapabilityStatement> {
    const response = await this.request(ctx, {
      type: "capabilities-request",
      level: "system",
    });
    if (response.type !== "capabilities-response")
      throw new Error("Unexpected response type");
    return response.body;
  }
  async request(ctx: CTX, request: FHIRRequest): Promise<FHIRResponse> {
    const res = await this.middleware(request, { ctx, state: this.state });
    return res.response;
  }
  async invoke_system<Op extends IOperation<unknown, unknown>>(
    op: Op,
    ctx: CTX,
    input: OPMetadata<Op>["Input"]
  ): Promise<OPMetadata<Op>["Output"]> {
    const response = await this.request(ctx, {
      type: "invoke-request",
      level: "system",
      operation: op.code,
      body: op.parseToParameters("in", input),
    });
    if (response.type !== "invoke-response")
      throw new Error("Unexpected response type");
    return op.parseToObject("out", response.body);
  }
  async invoke_type<
    Op extends IOperation<unknown, unknown>,
    T extends ResourceType
  >(
    op: Op,
    ctx: CTX,
    resourceType: T,
    input: OPMetadata<Op>["Input"]
  ): Promise<OPMetadata<Op>["Output"]> {
    const response = await this.request(ctx, {
      type: "invoke-request",
      level: "type",
      operation: op.code,
      resourceType,
      body: op.parseToParameters("in", input),
    });
    if (response.type !== "invoke-response")
      throw new Error("Unexpected response type");
    return op.parseToObject("out", response.body);
  }

  async invoke_instance<
    Op extends IOperation<unknown, unknown>,
    T extends ResourceType
  >(
    op: Op,
    ctx: CTX,
    resourceType: T,
    id: id,
    input: OPMetadata<Op>["Input"]
  ): Promise<OPMetadata<Op>["Output"]> {
    const response = await this.request(ctx, {
      type: "invoke-request",
      level: "instance",
      operation: op.code,
      resourceType,
      id,
      body: op.parseToParameters("in", input),
    });
    if (response.type !== "invoke-response")
      throw new Error("Unexpected response type");
    return op.parseToObject("out", response.body);
  }

  async search_system(
    ctx: CTX,
    parameters: ParsedParameter<string | number>[]
  ): Promise<{ total?: number; resources: Resource[] }> {
    const response = await this.request(ctx, {
      type: "search-request",
      level: "system",
      parameters: parameters,
    });
    if (response.type !== "search-response")
      throw new Error("Unexpected response type");
    return { total: response.total, resources: response.body };
  }
  async search_type<T extends ResourceType>(
    ctx: CTX,
    resourceType: T,
    parameters: ParsedParameter<string | number>[]
  ): Promise<{ total?: number; resources: AResource<T>[] }> {
    const response = await this.request(ctx, {
      type: "search-request",
      level: "type",
      resourceType: resourceType,
      parameters: parameters,
    });
    if (response.type !== "search-response")
      throw new Error(`Unexpected response type '${response.type}'`);
    return {
      total: response.total,
      resources: response.body as AResource<T>[],
    };
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
  async transaction(ctx: CTX, bundle: Bundle): Promise<Bundle> {
    if (bundle.type !== "transaction")
      throw new OperationError(
        outcomeError("invalid", "Bundle must be of type 'transaction'")
      );
    const response = await this.request(ctx, {
      type: "transaction-request",
      level: "system",
      body: bundle,
    });
    if (response.type !== "transaction-response") {
      throw new OperationError(
        outcomeError("invalid", "response type must be 'transaction-response'")
      );
    }
    return response.body;
  }
  async batch(ctx: CTX, bundle: Bundle): Promise<Bundle> {
    if (bundle.type !== "batch")
      throw new OperationError(
        outcomeError("invalid", "Bundle must be of type 'batch'")
      );
    const response = await this.request(ctx, {
      type: "batch-request",
      level: "system",
      body: bundle,
    });
    if (response.type !== "batch-response") {
      throw new OperationError(
        outcomeError("invalid", "response type must be 'batch-response'")
      );
    }
    return response.body;
  }
}

export class SynchronousClient<State, CTX> implements FHIRClientSync<CTX> {
  private state: State;
  private middleware: MiddlewareSync<State, CTX>;
  constructor(initialState: State, middleware: MiddlewareSync<State, CTX>) {
    this.state = initialState;
    this.middleware = middleware;
  }
  capabilities(ctx: CTX): CapabilityStatement {
    const response = this.request(ctx, {
      type: "capabilities-request",
      level: "system",
    });
    if (response.type !== "capabilities-response")
      throw new Error("Unexpected response type");
    return response.body;
  }
  invoke_system<Op extends IOperation<unknown, unknown>>(
    op: Op,
    ctx: CTX,
    input: OPMetadata<Op>["Input"]
  ): OPMetadata<Op>["Output"] {
    const response = this.request(ctx, {
      type: "invoke-request",
      level: "system",
      operation: op.code,
      body: op.parseToParameters("in", input),
    });
    if (response.type !== "invoke-response")
      throw new Error("Unexpected response type");
    return op.parseToObject("out", response.body);
  }
  invoke_type<Op extends IOperation<unknown, unknown>, T extends ResourceType>(
    op: Op,
    ctx: CTX,
    resourceType: T,
    input: OPMetadata<Op>["Input"]
  ): OPMetadata<Op>["Output"] {
    const response = this.request(ctx, {
      type: "invoke-request",
      level: "type",
      operation: op.code,
      resourceType,
      body: op.parseToParameters("in", input),
    });
    if (response.type !== "invoke-response")
      throw new Error("Unexpected response type");
    return op.parseToObject("out", response.body);
  }

  invoke_instance<
    Op extends IOperation<unknown, unknown>,
    T extends ResourceType
  >(
    op: Op,
    ctx: CTX,
    resourceType: T,
    id: id,
    input: OPMetadata<Op>["Input"]
  ): OPMetadata<Op>["Output"] {
    const response = this.request(ctx, {
      type: "invoke-request",
      level: "instance",
      operation: op.code,
      resourceType,
      id,
      body: op.parseToParameters("in", input),
    });
    if (response.type !== "invoke-response")
      throw new Error("Unexpected response type");
    return op.parseToObject("out", response.body);
  }
  request(ctx: CTX, request: FHIRRequest): FHIRResponse {
    const res = this.middleware(request, { ctx, state: this.state });
    this.state = res.state;
    return res.response;
  }
  search_system(
    ctx: CTX,
    parameters: ParsedParameter<string | number>[]
  ): { total?: number; resources: Resource[] } {
    const response = this.request(ctx, {
      type: "search-request",
      level: "system",
      parameters,
    });
    if (response.type !== "search-response")
      throw new Error("Unexpected response type");
    return { total: response.total, resources: response.body };
  }
  search_type<T extends ResourceType>(
    ctx: CTX,
    resourceType: T,
    parameters: ParsedParameter<string | number>[]
  ): { total?: number; resources: AResource<T>[] } {
    const response = this.request(ctx, {
      type: "search-request",
      level: "type",
      resourceType: resourceType,
      parameters,
    });
    if (response.type !== "search-response")
      throw new Error("Unexpected response type");
    return {
      total: response.total,
      resources: response.body as AResource<T>[],
    };
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
  transaction(ctx: CTX, bundle: Bundle): Bundle {
    if (bundle.type !== "transaction")
      throw new OperationError(
        outcomeError("invalid", "Bundle must be of type 'transaction'")
      );
    const response = this.request(ctx, {
      type: "transaction-request",
      level: "system",
      body: bundle,
    });
    if (response.type !== "transaction-response") {
      throw new OperationError(
        outcomeError("invalid", "response type must be transaction-response")
      );
    }
    return response.body;
  }
  batch(ctx: CTX, bundle: Bundle): Bundle {
    if (bundle.type !== "batch")
      throw new OperationError(
        outcomeError("invalid", "Bundle must be of type 'batch'")
      );
    const response = this.request(ctx, {
      type: "batch-request",
      level: "system",
      body: bundle,
    });
    if (response.type !== "batch-response") {
      throw new OperationError(
        outcomeError("invalid", "response type must be batch-response")
      );
    }
    return response.body;
  }
}
