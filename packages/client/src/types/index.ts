import { code, id } from "@iguhealth/fhir-types/r4/types";
import {
  FHIR_VERSION,
  Resource,
  ResourceType,
} from "@iguhealth/fhir-types/versions";

import type { ParsedParameter } from "../url.js";
import {
  Request,
  RequestLevel,
  RequestType,
  ResponseType,
} from "./utilities.js";

export interface InstanceInteraction<Version extends FHIR_VERSION>
  extends Request<Version, "instance"> {
  resource: ResourceType<Version>;
  id: id;
}

export interface TypeInteraction<Version extends FHIR_VERSION>
  extends Request<Version, "type"> {
  resource: ResourceType<Version>;
}

export interface SystemInteraction<Version extends FHIR_VERSION>
  extends Request<Version, "system"> {}

export interface ReadRequest<Version extends FHIR_VERSION>
  extends InstanceInteraction<Version> {
  type: RequestType["read"];
}

export interface VersionReadRequest<Version extends FHIR_VERSION>
  extends InstanceInteraction<Version> {
  type: RequestType["vread"];
  versionId: string;
}

export interface InstanceUpdateRequest<Version extends FHIR_VERSION>
  extends InstanceInteraction<Version> {
  type: RequestType["update"];
  body: Resource<Version, ResourceType<Version>>;
}

// TODO - implement patch type
export interface PatchRequest<Version extends FHIR_VERSION>
  extends InstanceInteraction<Version> {
  type: RequestType["patch"];
  body: unknown;
}

export interface InstanceDeleteRequest<Version extends FHIR_VERSION>
  extends InstanceInteraction<Version> {
  type: RequestType["delete"];
}

export interface TypeDeleteRequest<Version extends FHIR_VERSION>
  extends TypeInteraction<Version> {
  parameters: ParsedParameter<string | number>[];
  type: RequestType["delete"];
}

export interface SystemDeleteRequest<Version extends FHIR_VERSION>
  extends SystemInteraction<Version> {
  parameters: ParsedParameter<string | number>[];
  type: RequestType["delete"];
}

export interface HistoryInstanceRequest<Version extends FHIR_VERSION>
  extends InstanceInteraction<Version> {
  type: RequestType["history"];
  parameters?: ParsedParameter<string | number>[];
}

export interface CreateRequest<Version extends FHIR_VERSION>
  extends TypeInteraction<Version> {
  type: RequestType["create"];
  body: Resource<Version, ResourceType<Version>>;
}

export interface ConditionalUpdateRequest<Version extends FHIR_VERSION>
  extends TypeInteraction<Version> {
  type: RequestType["update"];
  parameters: ParsedParameter<string | number>[];
  body: Resource<Version, ResourceType<Version>>;
}

export interface TypeSearchRequest<Version extends FHIR_VERSION>
  extends TypeInteraction<Version> {
  parameters: ParsedParameter<string | number>[];
  type: RequestType["search"];
}

export interface TypeHistoryRequest<Version extends FHIR_VERSION>
  extends TypeInteraction<Version> {
  type: RequestType["history"];
  parameters?: ParsedParameter<string | number>[];
}

export interface CapabilitiesRequest<Version extends FHIR_VERSION>
  extends SystemInteraction<Version> {
  type: RequestType["capabilities"];
}

export interface BatchRequest<Version extends FHIR_VERSION>
  extends SystemInteraction<Version> {
  type: RequestType["batch"];
  body: Resource<Version, "Bundle">;
}

export interface TransactionRequest<Version extends FHIR_VERSION>
  extends SystemInteraction<Version> {
  type: RequestType["transaction"];
  body: Resource<Version, "Bundle">;
}

export interface SystemHistoryRequest<Version extends FHIR_VERSION>
  extends SystemInteraction<Version> {
  type: RequestType["history"];
  parameters?: ParsedParameter<string | number>[];
}

export interface SystemSearchRequest<Version extends FHIR_VERSION>
  extends SystemInteraction<Version> {
  parameters: ParsedParameter<string | number>[];
  type: RequestType["search"];
}

export interface InvokeInstanceRequest<Version extends FHIR_VERSION>
  extends InstanceInteraction<Version> {
  type: RequestType["invoke"];
  operation: code;
  body: Resource<Version, "Parameters">;
}

export interface InvokeTypeRequest<Version extends FHIR_VERSION>
  extends TypeInteraction<Version> {
  type: RequestType["invoke"];
  operation: code;
  body: Resource<Version, "Parameters">;
}

export interface InvokeSystemRequest<Version extends FHIR_VERSION>
  extends SystemInteraction<Version> {
  type: RequestType["invoke"];
  operation: code;
  body: Resource<Version, "Parameters">;
}

export type FHIRRequest<Version extends FHIR_VERSION> =
  | InvokeInstanceRequest<Version>
  | InvokeTypeRequest<Version>
  | InvokeSystemRequest<Version>
  | ReadRequest<Version>
  | VersionReadRequest<Version>
  | UpdateRequest<Version>
  | PatchRequest<Version>
  | HistoryInstanceRequest<Version>
  | InstanceDeleteRequest<Version>
  | CreateRequest<Version>
  | TypeSearchRequest<Version>
  | TypeHistoryRequest<Version>
  | TypeDeleteRequest<Version>
  | CapabilitiesRequest<Version>
  | BatchRequest<Version>
  | TransactionRequest<Version>
  | SystemHistoryRequest<Version>
  | SystemSearchRequest<Version>
  | SystemDeleteRequest<Version>
  | ConditionalUpdateRequest<Version>;

export interface ReadResponse<Version extends FHIR_VERSION>
  extends InstanceInteraction<Version> {
  type: ResponseType["read"];
  body: Resource<Version, ResourceType<Version>>;
}

export interface VersionReadResponse<Version extends FHIR_VERSION>
  extends InstanceInteraction<Version> {
  type: ResponseType["vread"];
  versionId: string;
  body: Resource<Version, ResourceType<Version>>;
}

export interface UpdateResponse<Version extends FHIR_VERSION>
  extends InstanceInteraction<Version> {
  type: ResponseType["update"];
  created?: boolean;
  body: Resource<Version, ResourceType<Version>>;
}

// TODO - implement patch type
export interface PatchResponse<Version extends FHIR_VERSION>
  extends InstanceInteraction<Version> {
  type: ResponseType["patch"];
  body: Resource<Version, ResourceType<Version>>;
}

export interface InstanceDeleteResponse<Version extends FHIR_VERSION>
  extends InstanceInteraction<Version> {
  type: ResponseType["delete"];
}

export interface TypeDeleteResponse<Version extends FHIR_VERSION>
  extends TypeInteraction<Version> {
  parameters: ParsedParameter<string | number>[];
  type: ResponseType["delete"];
  // For conditional deletes include the ids of the resources that were deleted.
  deletions?: { id: id; type: ResourceType<Version> }[];
}

export interface SystemDeleteResponse<Version extends FHIR_VERSION>
  extends SystemInteraction<Version> {
  parameters: ParsedParameter<string | number>[];
  type: ResponseType["delete"];
  // For conditional deletes include the ids of the resources that were deleted.
  deletions?: { id: id; type: ResourceType<Version> }[];
}

export interface InstanceHistoryResponse<Version extends FHIR_VERSION>
  extends InstanceInteraction<Version> {
  type: ResponseType["history"];
  body: Resource<Version, "Bundle">;
}

export interface CreateResponse<Version extends FHIR_VERSION>
  extends TypeInteraction<Version> {
  type: ResponseType["create"];
  body: Resource<Version, ResourceType<Version>>;
}

export interface TypeSearchResponse<Version extends FHIR_VERSION>
  extends TypeInteraction<Version> {
  parameters: ParsedParameter<string | number>[];
  type: ResponseType["search"];
  body: Resource<Version, "Bundle">;
}

export interface TypeHistoryResponse<Version extends FHIR_VERSION>
  extends TypeInteraction<Version> {
  type: ResponseType["history"];
  body: Resource<Version, "Bundle">;
}

export interface CapabilitiesResponse<Version extends FHIR_VERSION>
  extends SystemInteraction<Version> {
  type: ResponseType["capabilities"];
  body: Resource<Version, "CapabilityStatement">;
}

export interface BatchResponse<Version extends FHIR_VERSION>
  extends SystemInteraction<Version> {
  type: ResponseType["batch"];
  body: Resource<Version, "Bundle">;
}

export interface TransactionResponse<Version extends FHIR_VERSION>
  extends SystemInteraction<Version> {
  type: ResponseType["transaction"];
  body: Resource<Version, "Bundle">;
}

export interface SystemHistoryResponse<Version extends FHIR_VERSION>
  extends SystemInteraction<Version> {
  type: ResponseType["history"];
  body: Resource<Version, "Bundle">;
}

export interface SystemSearchResponse<Version extends FHIR_VERSION>
  extends SystemInteraction<Version> {
  parameters: ParsedParameter<string | number>[];
  type: ResponseType["search"];
  body: Resource<Version, "Bundle">;
}

export interface InvokeInstanceResponse<Version extends FHIR_VERSION>
  extends InstanceInteraction<Version> {
  type: ResponseType["invoke"];
  operation: code;
  body: Resource<Version, "Parameters">;
}

export interface InvokeTypeResponse<Version extends FHIR_VERSION>
  extends TypeInteraction<Version> {
  type: ResponseType["invoke"];
  operation: code;
  body: Resource<Version, "Parameters">;
}

export interface InvokeSystemResponse<Version extends FHIR_VERSION>
  extends SystemInteraction<Version> {
  type: ResponseType["invoke"];
  operation: code;
  body: Resource<Version, "Parameters">;
}

export type InvokeResponse<Version extends FHIR_VERSION> =
  | InvokeInstanceResponse<Version>
  | InvokeTypeResponse<Version>
  | InvokeSystemResponse<Version>;

export type InvokeRequest<Version extends FHIR_VERSION> =
  | InvokeInstanceRequest<Version>
  | InvokeTypeRequest<Version>
  | InvokeSystemRequest<Version>;

export type DeleteRequest<Version extends FHIR_VERSION> =
  | InstanceDeleteRequest<Version>
  | TypeDeleteRequest<Version>
  | SystemDeleteRequest<Version>;
export type DeleteResponse<Version extends FHIR_VERSION> =
  | InstanceDeleteResponse<Version>
  | TypeDeleteResponse<Version>
  | SystemDeleteResponse<Version>;

export type UpdateRequest<Version extends FHIR_VERSION> =
  | InstanceUpdateRequest<Version>
  | ConditionalUpdateRequest<Version>;

interface ErrorResponse<
  Version extends FHIR_VERSION,
  Level extends keyof RequestLevel,
> extends Request<Version, Level> {
  type: ResponseType["error"];
  body: Resource<Version, "OperationOutcome">;
}

export type FHIRErrorResponse<Version extends FHIR_VERSION> =
  | ErrorResponse<Version, "system">
  | ErrorResponse<Version, "type">
  | ErrorResponse<Version, "instance">;

export type FHIRResponse<Version extends FHIR_VERSION> =
  | FHIRErrorResponse<Version>
  | InvokeInstanceResponse<Version>
  | InvokeTypeResponse<Version>
  | InvokeSystemResponse<Version>
  | ReadResponse<Version>
  | VersionReadResponse<Version>
  | UpdateResponse<Version>
  | PatchResponse<Version>
  | InstanceHistoryResponse<Version>
  | InstanceDeleteResponse<Version>
  | CreateResponse<Version>
  | TypeSearchResponse<Version>
  | TypeHistoryResponse<Version>
  | TypeDeleteResponse<Version>
  | CapabilitiesResponse<Version>
  | BatchResponse<Version>
  | TransactionResponse<Version>
  | SystemHistoryResponse<Version>
  | SystemSearchResponse<Version>
  | SystemDeleteResponse<Version>;
