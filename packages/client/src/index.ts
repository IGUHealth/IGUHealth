import { Parameters, code, id } from "@iguhealth/fhir-types/r4/types";
import {
  AllResourceTypes,
  FHIR_VERSION,
  Resource,
  ResourceType,
} from "@iguhealth/fhir-types/versions";
import type { IOperation, OPMetadata } from "@iguhealth/operation-execution";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import type { FHIRClientAsync, InvokeParameter } from "./interface.js";
import { MiddlewareAsync } from "./middleware/index.js";
import type { FHIRRequest, FHIRResponse } from "./types/index.js";
import type { ParsedParameter } from "./url.js";
import { parseQuery } from "./url.js";

export class AsynchronousClient<State, CTX> implements FHIRClientAsync<CTX> {
  private state: State;
  private middleware: MiddlewareAsync<State, CTX>;
  constructor(initialState: State, middleware: MiddlewareAsync<State, CTX>) {
    this.state = initialState;
    this.middleware = middleware;
  }

  async request(ctx: CTX, request: FHIRRequest): Promise<FHIRResponse> {
    const res = await this.middleware({ ctx, state: this.state, request });
    this.state = res.state;
    if (!res.response) throw new Error("No Response was returned.");
    return res.response;
  }
  async capabilities<FHIRVersion extends FHIR_VERSION>(
    ctx: CTX,
    fhirVersion: FHIRVersion,
  ): Promise<Resource<FHIRVersion, "CapabilityStatement">> {
    const response = await this.request(ctx, {
      fhirVersion,
      type: "capabilities-request",
      level: "system",
    });
    if (response.type !== "capabilities-response")
      throw new Error("Unexpected response type");
    return response.body as Resource<FHIRVersion, "CapabilityStatement">;
  }
  async search_system<FHIRVersion extends FHIR_VERSION>(
    ctx: CTX,
    fhirVersion: FHIRVersion,
    parameters: ParsedParameter<string | number>[] | string,
  ): Promise<{
    total?: number;
    resources: Resource<FHIRVersion, AllResourceTypes>[];
  }> {
    const parsedParameters: ParsedParameter<string | number>[] =
      typeof parameters === "string" || parameters === undefined
        ? parseQuery(parameters)
        : parameters;
    const response = await this.request(ctx, {
      fhirVersion,
      type: "search-request",
      level: "system",
      parameters: parsedParameters,
    });
    if (response.type !== "search-response")
      throw new Error("Unexpected response type");
    return {
      total: response.total,
      resources: response.body as Resource<FHIRVersion, AllResourceTypes>[],
    };
  }
  async search_type<
    FHIRVersion extends FHIR_VERSION,
    T extends AllResourceTypes,
  >(
    ctx: CTX,
    fhirVersion: FHIRVersion,
    type: T,
    parameters: ParsedParameter<string | number>[] | string,
  ): Promise<{
    total?: number;
    resources: Resource<FHIRVersion, T>[];
  }> {
    const parsedParameters: ParsedParameter<string | number>[] =
      typeof parameters === "string" || parameters === undefined
        ? parseQuery(parameters)
        : parameters;
    const response = await this.request(ctx, {
      fhirVersion,
      type: "search-request",
      level: "type",
      resourceType: type,
      parameters: parsedParameters,
    } as FHIRRequest);
    if (response.type !== "search-response")
      throw new Error(`Unexpected response type '${response.type}'`);
    return {
      total: response.total,
      resources: response.body as Resource<FHIRVersion, T>[],
    };
  }
  async create<
    FHIRVersion extends FHIR_VERSION,
    T extends Resource<FHIRVersion, AllResourceTypes>,
  >(
    ctx: CTX,
    fhirVersion: FHIRVersion,
    resource: T,
    allowIdSet?: boolean,
  ): Promise<T> {
    const response = await this.request(ctx, {
      fhirVersion,
      type: "create-request",
      level: "type",
      resourceType: resource.resourceType,
      allowIdSet,
      body: resource,
    } as FHIRRequest);
    if (response.type !== "create-response")
      throw new Error("Unexpected response type");
    return response.body as T;
  }
  async update<FHIRVersion extends FHIR_VERSION, T extends AllResourceTypes>(
    ctx: CTX,
    fhirVersion: FHIRVersion,
    resourceType: T,
    id: NonNullable<Resource<FHIRVersion, AllResourceTypes>["id"]>,
    resource: Resource<FHIRVersion, T>,
  ): Promise<Resource<FHIRVersion, T>> {
    if (resource.id === undefined)
      throw new Error("Cannot update resource without id");
    const response = await this.request(ctx, {
      fhirVersion,
      type: "update-request",
      level: "instance",
      resourceType,
      id,
      body: resource,
    } as FHIRRequest);
    if (response.type !== "update-response")
      throw new Error("Unexpected response type");
    return response.body as Resource<FHIRVersion, T>;
  }
  async patch<FHIRVersion extends FHIR_VERSION, T extends AllResourceTypes>(
    ctx: CTX,
    fhirVersion: FHIRVersion,
    resourceType: T,
    id: NonNullable<Resource<FHIRVersion, AllResourceTypes>["id"]>,
    patches: any,
  ): Promise<Resource<FHIRVersion, T>> {
    const response = await this.request(ctx, {
      fhirVersion,
      type: "patch-request",
      level: "instance",
      resourceType: resourceType,
      id: id,
      body: patches,
    } as FHIRRequest);
    if (response.type !== "patch-response")
      throw new Error("Unexpected response type");
    return response.body as Resource<FHIRVersion, T>;
  }
  async read<FHIRVersion extends FHIR_VERSION, T extends AllResourceTypes>(
    ctx: CTX,
    fhirVersion: FHIRVersion,
    resourceType: T,
    id: NonNullable<Resource<FHIRVersion, AllResourceTypes>["id"]>,
  ): Promise<Resource<FHIRVersion, T> | undefined> {
    const response = await this.request(ctx, {
      fhirVersion,
      type: "read-request",
      level: "instance",
      resourceType: resourceType,
      id: id,
    } as FHIRRequest);
    if (response.type !== "read-response")
      throw new Error("Unexpected response type");
    return response.body as Resource<FHIRVersion, T> | undefined;
  }
  async vread<FHIRVersion extends FHIR_VERSION, T extends AllResourceTypes>(
    ctx: CTX,
    fhirVersion: FHIRVersion,
    resourceType: T,
    id: NonNullable<Resource<FHIRVersion, AllResourceTypes>["id"]>,
    versionId: NonNullable<Resource<FHIRVersion, AllResourceTypes>["id"]>,
  ): Promise<Resource<FHIRVersion, T> | undefined> {
    const response = await this.request(ctx, {
      fhirVersion,
      type: "vread-request",
      level: "instance",
      resourceType: resourceType,
      id: id,
      versionId: versionId,
    } as FHIRRequest);
    if (response.type !== "vread-response")
      throw new Error("Unexpected response type");
    return response.body as Resource<FHIRVersion, T> | undefined;
  }
  async delete<
    FHIRVersion extends FHIR_VERSION,
    T extends ResourceType<FHIRVersion>,
  >(
    ctx: CTX,
    fhirVersion: FHIRVersion,
    resourceType: T,
    id: NonNullable<Resource<FHIRVersion, AllResourceTypes>["id"]>,
  ): Promise<void> {
    const response = await this.request(ctx, {
      fhirVersion,
      type: "delete-request",
      level: "instance",
      resourceType: resourceType,
      id: id,
    } as FHIRRequest);
    if (response.type !== "delete-response")
      throw new Error("Unexpected response type");
  }
  async historySystem<FHIRVersion extends FHIR_VERSION>(
    ctx: CTX,
    fhirVersion: FHIRVersion,
    parameters?: ParsedParameter<string | number>[] | string,
  ): Promise<NonNullable<Resource<FHIRVersion, "Bundle">["entry"]>> {
    const parsedParameters: ParsedParameter<string | number>[] =
      typeof parameters === "string"
        ? parseQuery(parameters)
        : parameters
          ? parameters
          : [];

    const response = await this.request(ctx, {
      fhirVersion,
      type: "history-request",
      level: "system",
      parameters: parsedParameters,
    });
    if (response.type !== "history-response")
      throw new Error("Unexpected response type");
    return response.body as NonNullable<
      Resource<FHIRVersion, "Bundle">["entry"]
    >;
  }
  async historyType<
    FHIRVersion extends FHIR_VERSION,
    T extends AllResourceTypes,
  >(
    ctx: CTX,
    fhirVersion: FHIRVersion,
    resourceType: T,
    parameters?: ParsedParameter<string | number>[] | string,
  ): Promise<NonNullable<Resource<FHIRVersion, "Bundle">["entry"]>> {
    const parsedParameters: ParsedParameter<string | number>[] =
      typeof parameters === "string"
        ? parseQuery(parameters)
        : parameters
          ? parameters
          : [];
    const response = await this.request(ctx, {
      fhirVersion,
      type: "history-request",
      level: "type",
      resourceType: resourceType,
      parameters: parsedParameters,
    } as FHIRRequest);
    if (response.type !== "history-response")
      throw new Error("Unexpected response type");
    return response.body as NonNullable<
      Resource<FHIRVersion, "Bundle">["entry"]
    >;
  }
  async historyInstance<
    FHIRVersion extends FHIR_VERSION,
    T extends AllResourceTypes,
  >(
    ctx: CTX,
    fhirVersion: FHIRVersion,
    resourceType: T,
    id: NonNullable<Resource<FHIRVersion, AllResourceTypes>["id"]>,
    parameters?: ParsedParameter<string | number>[] | string,
  ): Promise<NonNullable<Resource<FHIRVersion, "Bundle">["entry"]>> {
    const parsedParameters: ParsedParameter<string | number>[] =
      typeof parameters === "string"
        ? parseQuery(parameters)
        : parameters
          ? parameters
          : [];
    const response = await this.request(ctx, {
      fhirVersion,
      type: "history-request",
      level: "instance",
      resourceType: resourceType,
      id: id as id,
      parameters: parsedParameters,
    } as FHIRRequest);
    if (response.type !== "history-response")
      throw new Error("Unexpected response type");
    return response.body as NonNullable<
      Resource<FHIRVersion, "Bundle">["entry"]
    >;
  }
  async invoke_system<
    FHIRVersion extends FHIR_VERSION,
    Op extends IOperation<any, any> | code,
    Input extends InvokeParameter<FHIRVersion, Op, "Input">,
    Output extends InvokeParameter<FHIRVersion, Op, "Output">,
  >(op: Op, ctx: CTX, fhirVersion: FHIRVersion, input: Input): Promise<Output> {
    if (typeof op === "string") {
      const response = await this.request(ctx, {
        fhirVersion,
        type: "invoke-request",
        level: "system",
        operation: op,
        body: input,
      } as FHIRRequest);

      return (response as unknown as Record<string, unknown>).body as Output;
    }

    const response = await this.request(ctx, {
      fhirVersion,
      type: "invoke-request",
      level: "system",
      operation: op.code,
      body: op.parseToParameters("in", input) as Parameters,
    } as FHIRRequest);

    if (response.type !== "invoke-response")
      throw new Error("Unexpected response type");
    return op.parseToObject("out", response.body);
  }
  async invoke_type<
    FHIRVersion extends FHIR_VERSION,
    Op extends IOperation<any, any> | code,
    Input extends InvokeParameter<FHIRVersion, Op, "Input">,
    Output extends InvokeParameter<FHIRVersion, Op, "Output">,
    T extends AllResourceTypes,
  >(
    op: Op,
    ctx: CTX,
    fhirVersion: FHIRVersion,
    resourceType: T,
    input: Input,
  ): Promise<Output> {
    if (typeof op === "string") {
      const response = await this.request(ctx, {
        fhirVersion,
        type: "invoke-request",
        level: "type",
        resourceType,
        operation: op,
        body: input,
      } as FHIRRequest);

      return (response as unknown as Record<string, unknown>).body as Output;
    }

    const response = await this.request(ctx, {
      fhirVersion,
      type: "invoke-request",
      level: "type",
      operation: op.code,
      resourceType,
      body: op.parseToParameters("in", input) as Parameters,
    } as FHIRRequest);

    if (response.type !== "invoke-response")
      throw new Error("Unexpected response type");
    return op.parseToObject("out", response.body);
  }
  async invoke_instance<
    FHIRVersion extends FHIR_VERSION,
    Op extends IOperation<any, any> | code,
    Input extends InvokeParameter<FHIRVersion, Op, "Input">,
    Output extends InvokeParameter<FHIRVersion, Op, "Output">,
    T extends AllResourceTypes,
  >(
    op: Op,
    ctx: CTX,
    fhirVersion: FHIRVersion,
    resourceType: T,
    id: NonNullable<Resource<FHIRVersion, AllResourceTypes>["id"]>,
    input: Input,
  ): Promise<Output> {
    if (typeof op === "string") {
      const response = await this.request(ctx, {
        fhirVersion,
        type: "invoke-request",
        level: "instance",
        operation: op,
        resourceType,
        id,
        body: input,
      } as FHIRRequest);

      return (response as unknown as Record<string, unknown>).body as Output;
    }

    const response = await this.request(ctx, {
      fhirVersion,
      type: "invoke-request",
      level: "instance",
      operation: op.code,
      resourceType,
      id,
      body: op.parseToParameters("in", input) as Parameters,
    } as FHIRRequest);
    if (response.type !== "invoke-response")
      throw new Error("Unexpected response type");
    return op.parseToObject("out", response.body);
  }
  async transaction<FHIRVersion extends FHIR_VERSION>(
    ctx: CTX,
    fhirVersion: FHIRVersion,
    bundle: Resource<FHIRVersion, "Bundle">,
  ): Promise<Resource<FHIRVersion, "Bundle">> {
    if (bundle.type !== "transaction")
      throw new OperationError(
        outcomeError("invalid", "Bundle must be of type 'transaction'"),
      );
    const response = await this.request(ctx, {
      fhirVersion,
      type: "transaction-request",
      level: "system",
      body: bundle,
    } as FHIRRequest);

    if (response.type !== "transaction-response") {
      throw new OperationError(
        outcomeError("invalid", "response type must be 'transaction-response'"),
      );
    }
    return response.body as Resource<FHIRVersion, "Bundle">;
  }
  async batch<FHIRVersion extends FHIR_VERSION>(
    ctx: CTX,
    fhirVersion: FHIRVersion,
    bundle: Resource<FHIRVersion, "Bundle">,
  ): Promise<Resource<FHIRVersion, "Bundle">> {
    if (bundle.type !== "batch")
      throw new OperationError(
        outcomeError("invalid", "Bundle must be of type 'batch'"),
      );
    const response = await this.request(ctx, {
      fhirVersion,
      type: "batch-request",
      level: "system",
      body: bundle,
    } as FHIRRequest);

    if (response.type !== "batch-response") {
      throw new OperationError(
        outcomeError("invalid", "response type must be 'batch-response'"),
      );
    }
    return response.body as Resource<FHIRVersion, "Bundle">;
  }
}
