import {
  ResourceType,
  FHIR_VERSION,
  Resource,
} from "@iguhealth/fhir-types/versions";
import { code, id } from "@iguhealth/fhir-types/r4/types";

import type { ParsedParameter } from "../url.js";
import {
  Request,
  RequestInteractionTypes,
  RequestLevel,
  ResponseInteractionTypes,
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
  type: RequestInteractionTypes["read"];
}

export interface VersionReadRequest<Version extends FHIR_VERSION>
  extends InstanceInteraction<Version> {
  type: RequestInteractionTypes["vread"];
  versionId: string;
}

export interface UpdateRequest<Version extends FHIR_VERSION>
  extends InstanceInteraction<Version> {
  type: RequestInteractionTypes["update"];
  body: Resource<Version, ResourceType<Version>>;
}

// TODO - implement patch type
export interface PatchRequest<Version extends FHIR_VERSION>
  extends InstanceInteraction<Version> {
  type: RequestInteractionTypes["patch"];
  body: unknown;
}

export interface InstanceDeleteRequest<Version extends FHIR_VERSION>
  extends InstanceInteraction<Version> {
  type: RequestInteractionTypes["delete"];
}

export interface TypeDeleteRequest<Version extends FHIR_VERSION>
  extends TypeInteraction<Version> {
  parameters: ParsedParameter<string | number>[];
  type: RequestInteractionTypes["delete"];
}

export interface SystemDeleteRequest<Version extends FHIR_VERSION>
  extends SystemInteraction<Version> {
  parameters: ParsedParameter<string | number>[];
  type: RequestInteractionTypes["delete"];
}

export interface HistoryInstanceRequest<Version extends FHIR_VERSION>
  extends InstanceInteraction<Version> {
  type: RequestInteractionTypes["history"];
  parameters?: ParsedParameter<string | number>[];
}

export interface CreateRequest<Version extends FHIR_VERSION>
  extends TypeInteraction<Version> {
  type: RequestInteractionTypes["create"];
  body: Resource<Version, ResourceType<Version>>;
}

export interface ConditinalUpdateRequest<Version extends FHIR_VERSION>
  extends TypeInteraction<Version> {
  type: RequestInteractionTypes["update"];
  parameters: ParsedParameter<string | number>[];
  body: Resource<Version, ResourceType<Version>>;
}

export interface TypeSearchRequest<Version extends FHIR_VERSION>
  extends TypeInteraction<Version> {
  parameters: ParsedParameter<string | number>[];
  type: RequestInteractionTypes["search"];
}

export interface TypeHistoryRequest<Version extends FHIR_VERSION>
  extends TypeInteraction<Version> {
  type: RequestInteractionTypes["history"];
  parameters?: ParsedParameter<string | number>[];
}

export interface CapabilitiesRequest<Version extends FHIR_VERSION>
  extends SystemInteraction<Version> {
  type: RequestInteractionTypes["capabilities"];
}

export interface BatchRequest<Version extends FHIR_VERSION>
  extends SystemInteraction<Version> {
  type: RequestInteractionTypes["batch"];
  body: Resource<Version, "Bundle">;
}

export interface TransactionRequest<Version extends FHIR_VERSION>
  extends SystemInteraction<Version> {
  type: RequestInteractionTypes["transaction"];
  body: Resource<Version, "Bundle">;
}

export interface SystemHistoryRequest<Version extends FHIR_VERSION>
  extends SystemInteraction<Version> {
  type: RequestInteractionTypes["history"];
  parameters?: ParsedParameter<string | number>[];
}

export interface SystemSearchRequest<Version extends FHIR_VERSION>
  extends SystemInteraction<Version> {
  parameters: ParsedParameter<string | number>[];
  type: RequestInteractionTypes["search"];
}

export interface InvokeInstanceRequest<Version extends FHIR_VERSION>
  extends InstanceInteraction<Version> {
  type: RequestInteractionTypes["invoke"];
  operation: code;
  body: Resource<Version, "Parameters">;
}

export interface InvokeTypeRequest<Version extends FHIR_VERSION>
  extends TypeInteraction<Version> {
  type: RequestInteractionTypes["invoke"];
  operation: code;
  body: Resource<Version, "Parameters">;
}

export interface InvokeSystemRequest<Version extends FHIR_VERSION>
  extends SystemInteraction<Version> {
  type: RequestInteractionTypes["invoke"];
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
  | ConditinalUpdateRequest<Version>;

export interface ReadResponse<Version extends FHIR_VERSION>
  extends InstanceInteraction<Version> {
  type: ResponseInteractionTypes["read"];
  body: Resource<Version, ResourceType<Version>>;
}

export interface VersionReadResponse<Version extends FHIR_VERSION>
  extends InstanceInteraction<Version> {
  type: ResponseInteractionTypes["vread"];
  versionId: string;
  body: Resource<Version, ResourceType<Version>>;
}

export interface UpdateResponse<Version extends FHIR_VERSION>
  extends InstanceInteraction<Version> {
  type: ResponseInteractionTypes["update"];
  created?: boolean;
  body: Resource<Version, ResourceType<Version>>;
}

// TODO - implement patch type
export interface PatchResponse<Version extends FHIR_VERSION>
  extends InstanceInteraction<Version> {
  type: ResponseInteractionTypes["patch"];
  body: Resource<Version, ResourceType<Version>>;
}

export interface InstanceDeleteResponse<Version extends FHIR_VERSION>
  extends InstanceInteraction<Version> {
  type: ResponseInteractionTypes["delete"];
}

export interface TypeDeleteResponse<Version extends FHIR_VERSION>
  extends TypeInteraction<Version> {
  parameters: ParsedParameter<string | number>[];
  type: ResponseInteractionTypes["delete"];
  // For conditional deletes include the ids of the resources that were deleted.
  deletions?: { id: id; type: ResourceType<Version> }[];
}

export interface SystemDeleteResponse<Version extends FHIR_VERSION>
  extends SystemInteraction<Version> {
  parameters: ParsedParameter<string | number>[];
  type: ResponseInteractionTypes["delete"];
  // For conditional deletes include the ids of the resources that were deleted.
  deletions?: { id: id; type: ResourceType<Version> }[];
}

export interface InstanceHistoryResponse<Version extends FHIR_VERSION>
  extends InstanceInteraction<Version> {
  type: ResponseInteractionTypes["history"];
  body: Resource<Version, "Bundle">;
}

export interface CreateResponse<Version extends FHIR_VERSION>
  extends TypeInteraction<Version> {
  type: ResponseInteractionTypes["create"];
  body: Resource<Version, ResourceType<Version>>;
}

export interface TypeSearchResponse<Version extends FHIR_VERSION>
  extends TypeInteraction<Version> {
  parameters: ParsedParameter<string | number>[];
  type: ResponseInteractionTypes["search"];
  body: Resource<Version, "Bundle">;
}

export interface TypeHistoryResponse<Version extends FHIR_VERSION>
  extends TypeInteraction<Version> {
  type: ResponseInteractionTypes["history"];
  body: Resource<Version, "Bundle">;
}

export interface CapabilitiesResponse<Version extends FHIR_VERSION>
  extends SystemInteraction<Version> {
  type: ResponseInteractionTypes["capabilities"];
  body: Resource<Version, "CapabilityStatement">;
}

export interface BatchResponse<Version extends FHIR_VERSION>
  extends SystemInteraction<Version> {
  type: ResponseInteractionTypes["batch"];
  body: Resource<Version, "Bundle">;
}

export interface TransactionResponse<Version extends FHIR_VERSION>
  extends SystemInteraction<Version> {
  type: ResponseInteractionTypes["transaction"];
  body: Resource<Version, "Bundle">;
}

export interface SystemHistoryResponse<Version extends FHIR_VERSION>
  extends SystemInteraction<Version> {
  type: ResponseInteractionTypes["history"];
  body: Resource<Version, "Bundle">;
}

export interface SystemSearchResponse<Version extends FHIR_VERSION>
  extends SystemInteraction<Version> {
  parameters: ParsedParameter<string | number>[];
  type: ResponseInteractionTypes["search"];
  body: Resource<Version, "Bundle">;
}

export interface InvokeInstanceResponse<Version extends FHIR_VERSION>
  extends InstanceInteraction<Version> {
  type: ResponseInteractionTypes["invoke"];
  operation: code;
  body: Resource<Version, "Parameters">;
}

export interface InvokeTypeResponse<Version extends FHIR_VERSION>
  extends TypeInteraction<Version> {
  type: ResponseInteractionTypes["invoke"];
  operation: code;
  body: Resource<Version, "Parameters">;
}

export interface InvokeSystemResponse<Version extends FHIR_VERSION>
  extends SystemInteraction<Version> {
  type: ResponseInteractionTypes["invoke"];
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

interface ErrorResponse<
  Version extends FHIR_VERSION,
  Level extends keyof RequestLevel,
> extends Request<Version, Level> {
  type: ResponseInteractionTypes["error"];
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
