import {
  AResource,
  Parameters,
  Resource,
  id,
} from "@iguhealth/fhir-types/r4/types";
import type { IOperation, OPMetadata } from "@iguhealth/operation-execution";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { FHIRClientAsync, Versioned } from "./interface.js";
import { MiddlewareAsync } from "./middleware/index.js";
import type { FHIRRequest, FHIRResponse } from "./types.js";
import type { ParsedParameter } from "./url.js";
import { parseQuery } from "./url.js";
import { VERSIONED_FHIR, VersionedResourceType } from "./version.js";

export class AsynchronousClient<State, CTX extends Versioned>
  implements FHIRClientAsync<CTX>
{
  private state: State;
  private middleware: MiddlewareAsync<State, CTX>;
  constructor(initialState: State, middleware: MiddlewareAsync<State, CTX>) {
    this.state = initialState;
    this.middleware = middleware;
  }

  async capabilities<Context extends CTX>(
    ctx: Context,
  ): Promise<VERSIONED_FHIR[Context["fhirVersion"]]["CapabilityStatement"]> {
    const response = await this.request(ctx, {
      fhirVersion: ctx.fhirVersion,
      type: "capabilities-request",
      level: "system",
    });
    if (response.type !== "capabilities-response")
      throw new Error("Unexpected response type");
    return response.body;
  }
  async request(ctx: CTX, request: FHIRRequest): Promise<FHIRResponse> {
    const res = await this.middleware({ ctx, state: this.state, request });
    if (!res.response) throw new Error("No Response was returned.");
    return res.response;
  }
  async invoke_system<Op extends IOperation<any, any>>(
    op: Op,
    ctx: CTX,
    input: OPMetadata<Op>["Input"],
  ): Promise<OPMetadata<Op>["Output"]> {
    const response = await this.request(ctx, {
      fhirVersion: ctx.fhirVersion,
      type: "invoke-request",
      level: "system",
      operation: op.code,
      body: op.parseToParameters("in", input) as Parameters,
    });
    if (response.type !== "invoke-response")
      throw new Error("Unexpected response type");
    return op.parseToObject("out", response.body);
  }
  async invoke_type<
    Context extends CTX,
    Op extends IOperation<any, any>,
    T extends VersionedResourceType<Context["fhirVersion"]>,
  >(
    op: Op,
    ctx: Context,
    resourceType: T,
    input: OPMetadata<Op>["Input"],
  ): Promise<OPMetadata<Op>["Output"]> {
    const response = await this.request(ctx, {
      fhirVersion: ctx.fhirVersion,
      type: "invoke-request",
      level: "type",
      operation: op.code,
      resourceType,
      body: op.parseToParameters("in", input) as Parameters,
    });
    if (response.type !== "invoke-response")
      throw new Error("Unexpected response type");
    return op.parseToObject("out", response.body);
  }

  async invoke_instance<
    Context extends CTX,
    Op extends IOperation<any, any>,
    T extends VersionedResourceType<Context["fhirVersion"]>,
  >(
    op: Op,
    ctx: Context,
    resourceType: T,
    id: VERSIONED_FHIR[Context["fhirVersion"]]["id"],
    input: OPMetadata<Op>["Input"],
  ): Promise<OPMetadata<Op>["Output"]> {
    const response = await this.request(ctx, {
      fhirVersion: ctx.fhirVersion,
      type: "invoke-request",
      level: "instance",
      operation: op.code,
      resourceType,
      id,
      body: op.parseToParameters("in", input) as Parameters,
    });
    if (response.type !== "invoke-response")
      throw new Error("Unexpected response type");
    return op.parseToObject("out", response.body);
  }

  async search_system(
    ctx: CTX,
    parameters?: ParsedParameter<string | number>[] | string,
  ): Promise<{ total?: number; resources: Resource[] }> {
    const parsedParameters: ParsedParameter<string | number>[] =
      typeof parameters === "string" || parameters === undefined
        ? parseQuery(parameters)
        : parameters;
    const response = await this.request(ctx, {
      fhirVersion: ctx.fhirVersion,
      type: "search-request",
      level: "system",
      parameters: parsedParameters,
    });
    if (response.type !== "search-response")
      throw new Error("Unexpected response type");
    return { total: response.total, resources: response.body };
  }
  async search_type<
    Context extends CTX,
    T extends VersionedResourceType<Context["fhirVersion"]>,
  >(
    ctx: Context,
    type: T,
    parameters: ParsedParameter<string | number>[] | string,
  ): Promise<{
    total?: number;
    resources: VersionedAResource<Context["fhirVersion"], T>;
  }> {
    const parsedParameters: ParsedParameter<string | number>[] =
      typeof parameters === "string" || parameters === undefined
        ? parseQuery(parameters)
        : parameters;
    const response = await this.request(ctx, {
      fhirVersion: ctx.fhirVersion,
      type: "search-request",
      level: "type",
      resourceType: type,
      parameters: parsedParameters,
    });
    if (response.type !== "search-response")
      throw new Error(`Unexpected response type '${response.type}'`);
    return {
      total: response.total,
      resources: response.body as AResource<T>[],
    };
  }
  async create<
    Context extends CTX,
    T extends VERSIONED_FHIR[Context["fhirVersion"]]["Resource"],
  >(ctx: CTX, resource: T, allowIdSet?: boolean): Promise<T> {
    const response = await this.request(ctx, {
      type: "create-request",
      level: "type",
      resourceType: resource.resourceType,
      allowIdSet,
      body: resource,
    });
    if (response.type !== "create-response")
      throw new Error("Unexpected response type");
    return response.body as T;
  }
  async update<
    Context extends CTX,
    T extends VersionedResourceType<Context["fhirVersion"]>,
  >(
    ctx: Context,
    resourceType: T,
    id: VERSIONED_FHIR[Context["fhirVersion"]]["id"],
    resource: VersionedAResource<Context["fhirVersion"], T>,
  ): Promise<VersionedAResource<Context["fhirVersion"], T>> {
    if (resource.id === undefined)
      throw new Error("Cannot update resource without id");
    const response = await this.request(ctx, {
      fhirVersion: ctx.fhirVersion,
      type: "update-request",
      level: "instance",
      resourceType,
      id,
      body: resource,
    });
    if (response.type !== "update-response")
      throw new Error("Unexpected response type");
    return response.body as AResource<T>;
  }
  // [ADD JSON PATCH TYPES]
  async patch<
    Context extends CTX,
    T extends VersionedResourceType<Context["fhirVersion"]>,
  >(
    ctx: Context,
    resourceType: T,
    id: VERSIONED_FHIR[Context["fhirVersion"]]["id"],
    patches: any,
  ): Promise<VersionedAResource<Context["fhirVersion"], T>> {
    const response = await this.request(ctx, {
      fhirVersion: ctx.fhirVersion,
      type: "patch-request",
      level: "instance",
      resourceType: resourceType,
      id: id,
      body: patches,
    });
    if (response.type !== "patch-response")
      throw new Error("Unexpected response type");
    return response.body as AResource<T>;
  }
  async read<
    Context extends CTX,
    T extends VersionedResourceType<Context["fhirVersion"]>,
  >(
    ctx: Context,
    resourceType: T,
    id: VERSIONED_FHIR[Context["fhirVersion"]]["id"],
  ): Promise<VersionedAResource<Context["fhirVersion"], T> | undefined> {
    const response = await this.request(ctx, {
      fhirVersion: ctx.fhirVersion,
      type: "read-request",
      level: "instance",
      resourceType: resourceType,
      id: id,
    });
    if (response.type !== "read-response")
      throw new Error("Unexpected response type");
    return response.body as AResource<T> | undefined;
  }
  async vread<
    Context extends CTX,
    T extends VersionedResourceType<Context["fhirVersion"]>,
  >(
    ctx: Context,
    resourceType: T,
    id: VERSIONED_FHIR[Context["fhirVersion"]]["id"],
    versionId: VERSIONED_FHIR[Context["fhirVersion"]]["id"],
  ): Promise<VersionedAResource<Context["fhirVersion"], T> | undefined> {
    const response = await this.request(ctx, {
      fhirVersion: ctx.fhirVersion,
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
  async delete<
    Context extends CTX,
    T extends VersionedResourceType<Context["fhirVersion"]>,
  >(
    ctx: Context,
    resourceType: T,
    id: VERSIONED_FHIR[Context["fhirVersion"]]["id"],
  ): Promise<void> {
    const response = await this.request(ctx, {
      fhirVersion: ctx.fhirVersion,
      type: "delete-request",
      level: "instance",
      resourceType: resourceType,
      id: id,
    });
    if (response.type !== "delete-response")
      throw new Error("Unexpected response type");
  }
  async historySystem<Context extends CTX>(
    ctx: Context,
    parameters?: ParsedParameter<string | number>[] | string,
  ): Promise<VERSIONED_FHIR[Context["fhirVersion"]]["BundleEntry"][]> {
    const parsedParameters: ParsedParameter<string | number>[] =
      typeof parameters === "string"
        ? parseQuery(parameters)
        : parameters
          ? parameters
          : [];

    const response = await this.request(ctx, {
      fhirVersion: ctx.fhirVersion,
      type: "history-request",
      level: "system",
      parameters: parsedParameters,
    });
    if (response.type !== "history-response")
      throw new Error("Unexpected response type");
    return response.body;
  }
  async historyType<
    Context extends CTX,
    T extends VersionedResourceType<Context["fhirVersion"]>,
  >(
    ctx: Context,
    resourceType: T,
    parameters?: ParsedParameter<string | number>[] | string,
  ): Promise<VERSIONED_FHIR[Context["fhirVersion"]]["BundleEntry"][]> {
    const parsedParameters: ParsedParameter<string | number>[] =
      typeof parameters === "string"
        ? parseQuery(parameters)
        : parameters
          ? parameters
          : [];
    const response = await this.request(ctx, {
      fhirVersion: ctx.fhirVersion,
      type: "history-request",
      level: "type",
      resourceType: resourceType,
      parameters: parsedParameters,
    });
    if (response.type !== "history-response")
      throw new Error("Unexpected response type");
    return response.body;
  }
  async historyInstance<
    Context extends CTX,
    T extends VersionedResourceType<Context["fhirVersion"]>,
  >(
    ctx: Context,
    resourceType: T,
    id: VERSIONED_FHIR[Context["fhirVersion"]]["id"],
    parameters?: ParsedParameter<string | number>[] | string,
  ): Promise<VERSIONED_FHIR[Context["fhirVersion"]]["BundleEntry"][]> {
    const parsedParameters: ParsedParameter<string | number>[] =
      typeof parameters === "string"
        ? parseQuery(parameters)
        : parameters
          ? parameters
          : [];
    const response = await this.request(ctx, {
      fhirVersion: ctx.fhirVersion,
      type: "history-request",
      level: "instance",
      resourceType: resourceType,
      id: id as id,
      parameters: parsedParameters,
    });
    if (response.type !== "history-response")
      throw new Error("Unexpected response type");
    return response.body;
  }
  async transaction<Context extends CTX>(
    ctx: Context,
    bundle: VERSIONED_FHIR[Context["fhirVersion"]]["Bundle"],
  ): Promise<VERSIONED_FHIR[Context["fhirVersion"]]["Bundle"]> {
    if (bundle.type !== "transaction")
      throw new OperationError(
        outcomeError("invalid", "Bundle must be of type 'transaction'"),
      );
    const response = await this.request(ctx, {
      fhirVersion: ctx.fhirVersion,
      type: "transaction-request",
      level: "system",
      body: bundle,
    });
    if (response.type !== "transaction-response") {
      throw new OperationError(
        outcomeError("invalid", "response type must be 'transaction-response'"),
      );
    }
    return response.body;
  }
  async batch<Context extends CTX>(
    ctx: Context,
    bundle: VERSIONED_FHIR[Context["fhirVersion"]]["Bundle"],
  ): Promise<VERSIONED_FHIR[Context["fhirVersion"]]["Bundle"]> {
    if (bundle.type !== "batch")
      throw new OperationError(
        outcomeError("invalid", "Bundle must be of type 'batch'"),
      );
    const response = await this.request(ctx, {
      fhirVersion: ctx.fhirVersion,
      type: "batch-request",
      level: "system",
      body: bundle,
    });
    if (response.type !== "batch-response") {
      throw new OperationError(
        outcomeError("invalid", "response type must be 'batch-response'"),
      );
    }
    return response.body;
  }
}
