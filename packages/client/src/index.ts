import {
  AResource,
  Bundle,
  BundleEntry,
  CapabilityStatement,
  Parameters,
  Resource,
  ResourceType,
  id,
} from "@iguhealth/fhir-types/r4/types";
import {
  FHIR_VERSION,
  VERSIONED_FHIR,
  VersionedAResource,
  VersionedResourceType,
} from "@iguhealth/fhir-types/versions";
import type { IOperation, OPMetadata } from "@iguhealth/operation-execution";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import type { FHIRClientAsync, VersionedFHIRClientAsync } from "./interface.js";
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
  async capabilities(ctx: CTX): Promise<CapabilityStatement> {
    const response = await this.request(ctx, {
      fhirVersion: "4.0",
      type: "capabilities-request",
      level: "system",
    });
    if (response.type !== "capabilities-response")
      throw new Error("Unexpected response type");
    return response.body as CapabilityStatement;
  }
  async request(ctx: CTX, request: FHIRRequest): Promise<FHIRResponse> {
    const res = await this.middleware({ ctx, state: this.state, request });
    if (!res.response) throw new Error("No Response was returned.");
    return res.response;
  }
  async invoke_system<Op extends IOperation<unknown, unknown>>(
    op: Op,
    ctx: CTX,
    input: OPMetadata<Op>["Input"],
  ): Promise<OPMetadata<Op>["Output"]> {
    const response = await this.request(ctx, {
      fhirVersion: "4.0",
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
    Op extends IOperation<unknown, unknown>,
    T extends ResourceType,
  >(
    op: Op,
    ctx: CTX,
    resourceType: T,
    input: OPMetadata<Op>["Input"],
  ): Promise<OPMetadata<Op>["Output"]> {
    const response = await this.request(ctx, {
      fhirVersion: "4.0",
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
    Op extends IOperation<unknown, unknown>,
    T extends ResourceType,
  >(
    op: Op,
    ctx: CTX,
    resourceType: T,
    id: id,
    input: OPMetadata<Op>["Input"],
  ): Promise<OPMetadata<Op>["Output"]> {
    const response = await this.request(ctx, {
      fhirVersion: "4.0",
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
      fhirVersion: "4.0",
      type: "search-request",
      level: "system",
      parameters: parsedParameters,
    });
    if (response.type !== "search-response")
      throw new Error("Unexpected response type");
    return { total: response.total, resources: response.body as Resource[] };
  }
  async search_type<T extends ResourceType>(
    ctx: CTX,
    resourceType: T,
    parameters?: ParsedParameter<string | number>[] | string,
  ): Promise<{ total?: number; resources: AResource<T>[] }> {
    const parsedParameters: ParsedParameter<string | number>[] =
      typeof parameters === "string" || parameters === undefined
        ? parseQuery(parameters)
        : parameters;
    const response = await this.request(ctx, {
      fhirVersion: "4.0",
      type: "search-request",
      level: "type",
      resourceType: resourceType,
      parameters: parsedParameters,
    });
    if (response.type !== "search-response")
      throw new Error(`Unexpected response type '${response.type}'`);
    return {
      total: response.total,
      resources: response.body as AResource<T>[],
    };
  }
  async create<T extends Resource>(
    ctx: CTX,
    resource: T,
    allowIdSet = false,
  ): Promise<T> {
    const response = await this.request(ctx, {
      fhirVersion: "4.0",
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
  async update<T extends ResourceType>(
    ctx: CTX,
    resourceType: T,
    id: id,
    resource: AResource<T>,
  ): Promise<AResource<T>> {
    if (resource.id === undefined)
      throw new Error("Cannot update resource without id");
    const response = await this.request(ctx, {
      fhirVersion: "4.0",
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
  async patch<T extends ResourceType>(
    ctx: CTX,
    resourceType: T,
    id: id,
    patches: any,
  ): Promise<AResource<T>> {
    const response = await this.request(ctx, {
      fhirVersion: "4.0",
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
  async read<T extends ResourceType>(
    ctx: CTX,
    resourceType: T,
    id: id,
  ): Promise<AResource<T> | undefined> {
    const response = await this.request(ctx, {
      fhirVersion: "4.0",
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
    versionId: id,
  ): Promise<AResource<T>> {
    const response = await this.request(ctx, {
      fhirVersion: "4.0",
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
      fhirVersion: "4.0",
      type: "delete-request",
      level: "instance",
      resourceType: resourceType,
      id: id,
    });
    if (response.type !== "delete-response")
      throw new Error("Unexpected response type");
  }
  async historySystem(
    ctx: CTX,
    parameters?: ParsedParameter<string | number>[] | string,
  ): Promise<BundleEntry[]> {
    const parsedParameters: ParsedParameter<string | number>[] =
      typeof parameters === "string"
        ? parseQuery(parameters)
        : parameters
          ? parameters
          : [];

    const response = await this.request(ctx, {
      fhirVersion: "4.0",
      type: "history-request",
      level: "system",
      parameters: parsedParameters,
    });
    if (response.type !== "history-response")
      throw new Error("Unexpected response type");
    return response.body as BundleEntry[];
  }
  async historyType<T extends ResourceType>(
    ctx: CTX,
    resourceType: T,
    parameters?: ParsedParameter<string | number>[] | string,
  ): Promise<BundleEntry[]> {
    const parsedParameters: ParsedParameter<string | number>[] =
      typeof parameters === "string"
        ? parseQuery(parameters)
        : parameters
          ? parameters
          : [];
    const response = await this.request(ctx, {
      fhirVersion: "4.0",
      type: "history-request",
      level: "type",
      resourceType: resourceType,
      parameters: parsedParameters,
    });
    if (response.type !== "history-response")
      throw new Error("Unexpected response type");
    return response.body as BundleEntry[];
  }
  async historyInstance<T extends ResourceType>(
    ctx: CTX,
    resourceType: T,
    id: string,
    parameters?: ParsedParameter<string | number>[] | string,
  ): Promise<BundleEntry[]> {
    const parsedParameters: ParsedParameter<string | number>[] =
      typeof parameters === "string"
        ? parseQuery(parameters)
        : parameters
          ? parameters
          : [];
    const response = await this.request(ctx, {
      fhirVersion: "4.0",
      type: "history-request",
      level: "instance",
      resourceType: resourceType,
      id: id as id,
      parameters: parsedParameters,
    });
    if (response.type !== "history-response")
      throw new Error("Unexpected response type");
    return response.body as BundleEntry[];
  }
  async transaction(ctx: CTX, bundle: Bundle): Promise<Bundle> {
    if (bundle.type !== "transaction")
      throw new OperationError(
        outcomeError("invalid", "Bundle must be of type 'transaction'"),
      );
    const response = await this.request(ctx, {
      fhirVersion: "4.0",
      type: "transaction-request",
      level: "system",
      body: bundle,
    });
    if (response.type !== "transaction-response") {
      throw new OperationError(
        outcomeError("invalid", "response type must be 'transaction-response'"),
      );
    }
    return response.body as Bundle;
  }
  async batch(ctx: CTX, bundle: Bundle): Promise<Bundle> {
    if (bundle.type !== "batch")
      throw new OperationError(
        outcomeError("invalid", "Bundle must be of type 'batch'"),
      );
    const response = await this.request(ctx, {
      fhirVersion: "4.0",
      type: "batch-request",
      level: "system",
      body: bundle,
    });
    if (response.type !== "batch-response") {
      throw new OperationError(
        outcomeError("invalid", "response type must be 'batch-response'"),
      );
    }
    return response.body as Bundle;
  }
}

export class VersionedAsynchronousClient<State, CTX>
  implements VersionedFHIRClientAsync<CTX>
{
  private state: State;
  private middleware: MiddlewareAsync<State, CTX>;
  constructor(initialState: State, middleware: MiddlewareAsync<State, CTX>) {
    this.state = initialState;
    this.middleware = middleware;
  }

  async request(ctx: CTX, request: FHIRRequest): Promise<FHIRResponse> {
    const res = await this.middleware({ ctx, state: this.state, request });
    if (!res.response) throw new Error("No Response was returned.");
    return res.response;
  }
  async capabilities<FHIRVersion extends FHIR_VERSION>(
    ctx: CTX,
    fhirVersion: FHIRVersion,
  ): Promise<VERSIONED_FHIR[FHIRVersion]["CapabilityStatement"]> {
    const response = await this.request(ctx, {
      fhirVersion,
      type: "capabilities-request",
      level: "system",
    });
    if (response.type !== "capabilities-response")
      throw new Error("Unexpected response type");
    return response.body;
  }
  async search_system<FHIRVersion extends FHIR_VERSION>(
    ctx: CTX,
    fhirVersion: FHIRVersion,
    parameters: ParsedParameter<string | number>[] | string,
  ): Promise<{
    total?: number;
    resources: VERSIONED_FHIR[FHIRVersion]["Resource"][];
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
    return { total: response.total, resources: response.body };
  }
  async search_type<
    FHIRVersion extends FHIR_VERSION,
    T extends VersionedResourceType<FHIRVersion>,
  >(
    ctx: CTX,
    fhirVersion: FHIRVersion,
    type: T,
    parameters: ParsedParameter<string | number>[] | string,
  ): Promise<{
    total?: number;
    resources: VersionedAResource<FHIRVersion, T>[];
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
      resources: response.body as VersionedAResource<FHIRVersion, T>[],
    };
  }
  async create<
    FHIRVersion extends FHIR_VERSION,
    T extends VERSIONED_FHIR[FHIRVersion]["Resource"],
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
  async update<
    FHIRVersion extends FHIR_VERSION,
    T extends VersionedResourceType<FHIRVersion>,
  >(
    ctx: CTX,
    fhirVersion: FHIRVersion,
    resourceType: T,
    id: VERSIONED_FHIR[FHIRVersion]["id"],
    resource: VersionedAResource<FHIRVersion, T>,
  ): Promise<VersionedAResource<FHIRVersion, T>> {
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
    return response.body as VersionedAResource<FHIRVersion, T>;
  }
  async patch<
    FHIRVersion extends FHIR_VERSION,
    T extends VersionedResourceType<FHIRVersion>,
  >(
    ctx: CTX,
    fhirVersion: FHIRVersion,
    resourceType: T,
    id: VERSIONED_FHIR[FHIRVersion]["id"],
    patches: any,
  ): Promise<VersionedAResource<FHIRVersion, T>> {
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
    return response.body as VersionedAResource<FHIRVersion, T>;
  }
  async read<
    FHIRVersion extends FHIR_VERSION,
    T extends VersionedResourceType<FHIRVersion>,
  >(
    ctx: CTX,
    fhirVersion: FHIRVersion,
    resourceType: T,
    id: VERSIONED_FHIR[FHIRVersion]["id"],
  ): Promise<VersionedAResource<FHIRVersion, T> | undefined> {
    const response = await this.request(ctx, {
      fhirVersion,
      type: "read-request",
      level: "instance",
      resourceType: resourceType,
      id: id,
    } as FHIRRequest);
    if (response.type !== "read-response")
      throw new Error("Unexpected response type");
    return response.body as VersionedAResource<FHIRVersion, T> | undefined;
  }
  async vread<
    FHIRVersion extends FHIR_VERSION,
    T extends VersionedResourceType<FHIRVersion>,
  >(
    ctx: CTX,
    fhirVersion: FHIRVersion,
    resourceType: T,
    id: VERSIONED_FHIR[FHIRVersion]["id"],
    versionId: VERSIONED_FHIR[FHIRVersion]["id"],
  ): Promise<VersionedAResource<FHIRVersion, T> | undefined> {
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
    return response.body as VersionedAResource<FHIRVersion, T> | undefined;
  }
  async delete<
    FHIRVersion extends FHIR_VERSION,
    T extends VersionedResourceType<FHIRVersion>,
  >(
    ctx: CTX,
    fhirVersion: FHIRVersion,
    resourceType: T,
    id: VERSIONED_FHIR[FHIRVersion]["id"],
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
  ): Promise<VERSIONED_FHIR[FHIRVersion]["BundleEntry"][]> {
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
    return response.body as BundleEntry[];
  }
  async historyType<
    FHIRVersion extends FHIR_VERSION,
    T extends VersionedResourceType<FHIRVersion>,
  >(
    ctx: CTX,
    fhirVersion: FHIRVersion,
    resourceType: T,
    parameters?: ParsedParameter<string | number>[] | string,
  ): Promise<VERSIONED_FHIR[FHIRVersion]["BundleEntry"][]> {
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
    return response.body;
  }
  async historyInstance<
    FHIRVersion extends FHIR_VERSION,
    T extends VersionedResourceType<FHIRVersion>,
  >(
    ctx: CTX,
    fhirVersion: FHIRVersion,
    resourceType: T,
    id: VERSIONED_FHIR[FHIRVersion]["id"],
    parameters?: ParsedParameter<string | number>[] | string,
  ): Promise<VERSIONED_FHIR[FHIRVersion]["BundleEntry"][]> {
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
    return response.body;
  }
  async invoke_system<
    FHIRVersion extends FHIR_VERSION,
    Op extends IOperation<any, any>,
  >(
    op: Op,
    ctx: CTX,
    fhirVersion: FHIRVersion,
    input: OPMetadata<Op>["Input"],
  ): Promise<OPMetadata<Op>["Output"]> {
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
    Op extends IOperation<any, any>,
    T extends VersionedResourceType<FHIRVersion>,
  >(
    op: Op,
    ctx: CTX,
    fhirVersion: FHIRVersion,
    resourceType: T,
    input: OPMetadata<Op>["Input"],
  ): Promise<OPMetadata<Op>["Output"]> {
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
    Op extends IOperation<any, any>,
    T extends VersionedResourceType<FHIRVersion>,
  >(
    op: Op,
    ctx: CTX,
    fhirVersion: FHIRVersion,
    resourceType: T,
    id: VERSIONED_FHIR[FHIRVersion]["id"],
    input: OPMetadata<Op>["Input"],
  ): Promise<OPMetadata<Op>["Output"]> {
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
    bundle: VERSIONED_FHIR[FHIRVersion]["Bundle"],
  ): Promise<VERSIONED_FHIR[FHIRVersion]["Bundle"]> {
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
    return response.body;
  }
  async batch<FHIRVersion extends FHIR_VERSION>(
    ctx: CTX,
    fhirVersion: FHIRVersion,
    bundle: VERSIONED_FHIR[FHIRVersion]["Bundle"],
  ): Promise<VERSIONED_FHIR[FHIRVersion]["Bundle"]> {
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
    return response.body;
  }
}
