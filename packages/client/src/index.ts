/* eslint-disable @typescript-eslint/no-explicit-any */
import { Parameters, code, id } from "@iguhealth/fhir-types/r4/types";
import {
  AllResourceTypes,
  FHIR_VERSION,
  Resource,
  ResourceType,
} from "@iguhealth/fhir-types/versions";
import type { IOperation } from "@iguhealth/operation-execution";
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

  async request<Version extends FHIR_VERSION>(
    ctx: CTX,
    request: FHIRRequest<Version>,
  ): Promise<FHIRResponse<Version>> {
    const res = await this.middleware({ ctx, state: this.state, request });
    this.state = res.state;
    if (!res.response) throw new Error("No Response was returned.");
    if (res.response.fhirVersion !== res.request.fhirVersion)
      throw new Error(
        `FHIR Version mismatch '${res.response.fhirVersion}' !== '${res.request.fhirVersion}'`,
      );

    return res.response as FHIRResponse<Version>;
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
    resources: Resource<FHIRVersion, ResourceType<FHIRVersion>>[];
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
      total: response.body.total,
      resources: response.body.entry?.map((e) => e.resource) as Resource<
        FHIRVersion,
        ResourceType<FHIRVersion>
      >[],
    };
  }
  async search_type<
    Version extends FHIR_VERSION,
    T extends ResourceType<Version>,
  >(
    ctx: CTX,
    fhirVersion: Version,
    type: T,
    parameters: ParsedParameter<string | number>[] | string,
  ): Promise<{
    total?: number;
    resources: Resource<Version, T>[];
  }> {
    const parsedParameters: ParsedParameter<string | number>[] =
      typeof parameters === "string" || parameters === undefined
        ? parseQuery(parameters)
        : parameters;
    const response = await this.request(ctx, {
      fhirVersion,
      type: "search-request",
      level: "type",
      resource: type,
      parameters: parsedParameters,
    } as FHIRRequest<Version>);
    if (response.type !== "search-response")
      throw new Error(`Unexpected response type '${response.type}'`);
    return {
      total: response.body.total,
      resources: response.body.entry?.map((e) => e.resource) as Resource<
        Version,
        T
      >[],
    };
  }
  async create<
    FHIRVersion extends FHIR_VERSION,
    T extends Resource<FHIRVersion, AllResourceTypes>,
  >(ctx: CTX, fhirVersion: FHIRVersion, resource: T): Promise<T> {
    const response = await this.request(ctx, {
      fhirVersion,
      type: "create-request",
      level: "type",
      resource: resource.resourceType as ResourceType<FHIRVersion>,
      body: resource as any,
    } as FHIRRequest<FHIRVersion>);
    if (response.type !== "create-response")
      throw new Error("Unexpected response type");
    return response.body as any as T;
  }
  async conditionalUpdate<
    FHIRVersion extends FHIR_VERSION,
    T extends ResourceType<FHIRVersion>,
  >(
    ctx: CTX,
    fhirVersion: FHIRVersion,
    resourceType: T,
    parameters: ParsedParameter<string | number>[] | string,
    resource: Resource<FHIRVersion, T>,
  ): Promise<Resource<FHIRVersion, T>> {
    const parsedParameters: ParsedParameter<string | number>[] =
      typeof parameters === "string"
        ? parseQuery(parameters)
        : parameters
          ? parameters
          : [];
    const response = await this.request(ctx, {
      fhirVersion,
      type: "update-request",
      level: "type",
      resource: resourceType,
      parameters: parsedParameters,
      body: resource,
    } as FHIRRequest<FHIRVersion>);
    if (response.type !== "update-response")
      throw new Error("Unexpected response type");
    return response.body as Resource<FHIRVersion, T>;
  }
  async update<
    FHIRVersion extends FHIR_VERSION,
    T extends ResourceType<FHIRVersion>,
  >(
    ctx: CTX,
    fhirVersion: FHIRVersion,
    resourceType: T,
    id: NonNullable<Resource<FHIRVersion, ResourceType<FHIRVersion>>["id"]>,
    resource: Resource<FHIRVersion, T>,
  ): Promise<Resource<FHIRVersion, T>> {
    if (resource.id === undefined)
      throw new Error("Cannot update resource without id");
    const response = await this.request(ctx, {
      fhirVersion,
      type: "update-request",
      level: "instance",
      resource: resourceType,
      id,
      body: resource,
    } as FHIRRequest<FHIRVersion>);
    if (response.type !== "update-response")
      throw new Error("Unexpected response type");
    return response.body as Resource<FHIRVersion, T>;
  }
  async patch<
    FHIRVersion extends FHIR_VERSION,
    T extends ResourceType<FHIRVersion>,
  >(
    ctx: CTX,
    fhirVersion: FHIRVersion,
    resourceType: T,
    id: NonNullable<Resource<FHIRVersion, ResourceType<FHIRVersion>>["id"]>,
    patches: any,
  ): Promise<Resource<FHIRVersion, T>> {
    const response = await this.request(ctx, {
      fhirVersion,
      type: "patch-request",
      level: "instance",
      resource: resourceType,
      id: id,
      body: patches,
    } as FHIRRequest<FHIRVersion>);
    if (response.type !== "patch-response")
      throw new Error("Unexpected response type");
    return response.body as Resource<FHIRVersion, T>;
  }
  async read<
    FHIRVersion extends FHIR_VERSION,
    T extends ResourceType<FHIRVersion>,
  >(
    ctx: CTX,
    fhirVersion: FHIRVersion,
    resourceType: T,
    id: NonNullable<Resource<FHIRVersion, ResourceType<FHIRVersion>>["id"]>,
  ): Promise<Resource<FHIRVersion, T> | undefined> {
    const response = await this.request(ctx, {
      fhirVersion,
      type: "read-request",
      level: "instance",
      resource: resourceType,
      id: id,
    } as FHIRRequest<FHIRVersion>);
    if (response.type !== "read-response")
      throw new Error("Unexpected response type");
    return response.body as Resource<FHIRVersion, T> | undefined;
  }
  async vread<
    FHIRVersion extends FHIR_VERSION,
    T extends ResourceType<FHIRVersion>,
  >(
    ctx: CTX,
    fhirVersion: FHIRVersion,
    resourceType: T,
    id: NonNullable<Resource<FHIRVersion, ResourceType<FHIRVersion>>["id"]>,
    versionId: NonNullable<
      Resource<FHIRVersion, ResourceType<FHIRVersion>>["id"]
    >,
  ): Promise<Resource<FHIRVersion, T> | undefined> {
    const response = await this.request(ctx, {
      fhirVersion,
      type: "vread-request",
      level: "instance",
      resource: resourceType,
      id: id,
      versionId: versionId,
    } as FHIRRequest<FHIRVersion>);
    if (response.type !== "vread-response")
      throw new Error("Unexpected response type");
    return response.body as Resource<FHIRVersion, T> | undefined;
  }
  async delete_instance<
    FHIRVersion extends FHIR_VERSION,
    T extends ResourceType<FHIRVersion>,
  >(
    ctx: CTX,
    fhirVersion: FHIRVersion,
    resourceType: T,
    id: NonNullable<Resource<FHIRVersion, ResourceType<FHIRVersion>>["id"]>,
  ): Promise<void> {
    const response = await this.request(ctx, {
      fhirVersion,
      type: "delete-request",
      level: "instance",
      resource: resourceType,
      id: id,
    } as FHIRRequest<FHIRVersion>);
    if (response.type !== "delete-response")
      throw new Error("Unexpected response type");
  }
  async delete_type<
    FHIRVersion extends FHIR_VERSION,
    T extends ResourceType<FHIRVersion>,
  >(
    ctx: CTX,
    fhirVersion: FHIRVersion,
    resourceType: T,
    parameters?: ParsedParameter<string | number>[] | string,
  ): Promise<void> {
    const parsedParameters: ParsedParameter<string | number>[] =
      typeof parameters === "string"
        ? parseQuery(parameters)
        : parameters
          ? parameters
          : [];
    const response = await this.request(ctx, {
      fhirVersion,
      type: "delete-request",
      level: "type",
      resource: resourceType,
      parameters: parsedParameters,
    } as FHIRRequest<FHIRVersion>);
    if (response.type !== "delete-response")
      throw new Error("Unexpected response type");
  }
  async delete_system<FHIRVersion extends FHIR_VERSION>(
    ctx: CTX,
    fhirVersion: FHIRVersion,
    parameters?: ParsedParameter<string | number>[] | string,
  ): Promise<void> {
    const parsedParameters: ParsedParameter<string | number>[] =
      typeof parameters === "string"
        ? parseQuery(parameters)
        : parameters
          ? parameters
          : [];
    const response = await this.request(ctx, {
      fhirVersion,
      type: "delete-request",
      level: "system",
      parameters: parsedParameters,
    } as FHIRRequest<FHIRVersion>);
    if (response.type !== "delete-response")
      throw new Error("Unexpected response type");
  }
  async history_system<FHIRVersion extends FHIR_VERSION>(
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
    return response.body.entry ?? [];
  }
  async history_type<
    FHIRVersion extends FHIR_VERSION,
    T extends ResourceType<FHIRVersion>,
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
      resource: resourceType,
      parameters: parsedParameters,
    } as FHIRRequest<FHIRVersion>);
    if (response.type !== "history-response")
      throw new Error("Unexpected response type");
    return response.body.entry ?? [];
  }
  async history_instance<
    FHIRVersion extends FHIR_VERSION,
    T extends ResourceType<FHIRVersion>,
  >(
    ctx: CTX,
    fhirVersion: FHIRVersion,
    resourceType: T,
    id: NonNullable<Resource<FHIRVersion, ResourceType<FHIRVersion>>["id"]>,
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
      resource: resourceType,
      id: id as id,
      parameters: parsedParameters,
    } as FHIRRequest<FHIRVersion>);
    if (response.type !== "history-response")
      throw new Error("Unexpected response type");
    return response.body.entry ?? [];
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
      } as FHIRRequest<FHIRVersion>);

      return (response as unknown as Record<string, unknown>).body as Output;
    }

    const response = await this.request(ctx, {
      fhirVersion,
      type: "invoke-request",
      level: "system",
      operation: op.code,
      body: op.parseToParameters("in", input) as Parameters,
    } as FHIRRequest<FHIRVersion>);

    if (response.type !== "invoke-response")
      throw new Error("Unexpected response type");
    return op.parseToObject("out", response.body);
  }
  async invoke_type<
    FHIRVersion extends FHIR_VERSION,
    Op extends IOperation<any, any> | code,
    Input extends InvokeParameter<FHIRVersion, Op, "Input">,
    Output extends InvokeParameter<FHIRVersion, Op, "Output">,
    T extends ResourceType<FHIRVersion>,
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
        resource: resourceType,
        operation: op,
        body: input,
      } as FHIRRequest<FHIRVersion>);

      return (response as unknown as Record<string, unknown>).body as Output;
    }

    const response = await this.request(ctx, {
      fhirVersion,
      type: "invoke-request",
      level: "type",
      operation: op.code,
      resource: resourceType,
      body: op.parseToParameters("in", input),
    } as FHIRRequest<FHIRVersion>);

    if (response.type !== "invoke-response")
      throw new Error("Unexpected response type");
    return op.parseToObject("out", response.body);
  }
  async invoke_instance<
    FHIRVersion extends FHIR_VERSION,
    Op extends IOperation<any, any> | code,
    Input extends InvokeParameter<FHIRVersion, Op, "Input">,
    Output extends InvokeParameter<FHIRVersion, Op, "Output">,
    T extends ResourceType<FHIRVersion>,
  >(
    op: Op,
    ctx: CTX,
    fhirVersion: FHIRVersion,
    resourceType: T,
    id: NonNullable<Resource<FHIRVersion, ResourceType<FHIRVersion>>["id"]>,
    input: Input,
  ): Promise<Output> {
    if (typeof op === "string") {
      const response = await this.request(ctx, {
        fhirVersion,
        type: "invoke-request",
        level: "instance",
        operation: op,
        resource: resourceType,
        id,
        body: input,
      } as FHIRRequest<FHIRVersion>);

      return (response as unknown as Record<string, unknown>).body as Output;
    }

    const response = await this.request(ctx, {
      fhirVersion,
      type: "invoke-request",
      level: "instance",
      operation: op.code,
      resource: resourceType,
      id,
      body: op.parseToParameters("in", input),
    } as FHIRRequest<FHIRVersion>);
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
    } as FHIRRequest<FHIRVersion>);

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
    } as FHIRRequest<FHIRVersion>);

    if (response.type !== "batch-response") {
      throw new OperationError(
        outcomeError("invalid", "response type must be 'batch-response'"),
      );
    }
    return response.body as Resource<FHIRVersion, "Bundle">;
  }
}
