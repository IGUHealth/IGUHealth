import {
  Bundle,
  BundleEntry,
  CapabilityStatement,
  Parameters,
  Resource,
  ResourceType,
  code,
  id,
  unsignedInt,
} from "@iguhealth/fhir-types/r4/types";

import type { ParsedParameter } from "./url.js";

export type REQUEST_METHOD = "PUT" | "POST" | "DELETE" | "PATCH";

export type RequestLevel = {
  instance: "instance";
  system: "system";
  type: "type";
};

type RequestInteractionTypes = {
  read: "read-request";
  vread: "vread-request";
  update: "update-request";
  patch: "patch-request";
  delete: "delete-request";
  history: "history-request";
  create: "create-request";
  search: "search-request";
  capabilities: "capabilities-request";
  batch: "batch-request";
  transaction: "transaction-request";
  invoke: "invoke-request";
};

type ResponseInteractionTypes = {
  read: "read-response";
  vread: "vread-response";
  update: "update-response";
  patch: "patch-response";
  delete: "delete-response";
  history: "history-response";
  create: "create-response";
  search: "search-response";
  capabilities: "capabilities-response";
  batch: "batch-response";
  transaction: "transaction-response";
  invoke: "invoke-response";
};

export type InstanceInteraction = {
  level: RequestLevel["instance"];
  resourceType: ResourceType;
  id: id;
};

export type TypeInteraction = {
  level: RequestLevel["type"];
  resourceType: ResourceType;
};

export type SystemInteraction = {
  level: RequestLevel["system"];
};

export type ReadRequest = InstanceInteraction & {
  type: RequestInteractionTypes["read"];
};

export type VersionReadRequest = InstanceInteraction & {
  type: RequestInteractionTypes["vread"];
  versionId: string;
};

export type UpdateRequest = InstanceInteraction & {
  type: RequestInteractionTypes["update"];
  body: Resource;
};

// TODO - implement patch type
export type PatchRequest = InstanceInteraction & {
  type: RequestInteractionTypes["patch"];
  body: unknown;
};

export type DeleteRequest = InstanceInteraction & {
  type: RequestInteractionTypes["delete"];
};

export type HistoryInstanceRequest = InstanceInteraction & {
  type: RequestInteractionTypes["history"];
  parameters?: ParsedParameter<string | number>[];
};

export type CreateRequest = TypeInteraction & {
  type: RequestInteractionTypes["create"];
  /**
   * If provided, the server must use the provided id instead of a server assigned id.
   */
  allowIdSet?: boolean;
  body: Resource;
};

export type TypeSearchRequest = TypeInteraction & {
  parameters: ParsedParameter<string | number>[];
  type: RequestInteractionTypes["search"];
};

export type TypeHistoryRequest = TypeInteraction & {
  type: RequestInteractionTypes["history"];
  parameters?: ParsedParameter<string | number>[];
};

export type CapabilitiesRequest = SystemInteraction & {
  type: RequestInteractionTypes["capabilities"];
};

export type BatchRequest = SystemInteraction & {
  type: RequestInteractionTypes["batch"];
  body: Bundle;
};

export type TransactionRequest = SystemInteraction & {
  type: RequestInteractionTypes["transaction"];
  body: Bundle;
};

export type SystemHistoryRequest = SystemInteraction & {
  type: RequestInteractionTypes["history"];
  parameters?: ParsedParameter<string | number>[];
};

export type SystemSearchRequest = SystemInteraction & {
  parameters: ParsedParameter<string | number>[];
  type: RequestInteractionTypes["search"];
};

export type InvokeInstanceRequest = InstanceInteraction & {
  type: RequestInteractionTypes["invoke"];
  operation: code;
  body: Parameters;
};

export type InvokeTypeRequest = TypeInteraction & {
  type: RequestInteractionTypes["invoke"];
  operation: code;
  body: Parameters;
};

export type InvokeSystemRequest = SystemInteraction & {
  type: RequestInteractionTypes["invoke"];
  operation: code;
  body: Parameters;
};

export type FHIRRequest =
  | InvokeInstanceRequest
  | InvokeTypeRequest
  | InvokeSystemRequest
  | ReadRequest
  | VersionReadRequest
  | UpdateRequest
  | PatchRequest
  | DeleteRequest
  | HistoryInstanceRequest
  | CreateRequest
  | TypeSearchRequest
  | TypeHistoryRequest
  | CapabilitiesRequest
  | BatchRequest
  | TransactionRequest
  | SystemHistoryRequest
  | SystemSearchRequest;

export type ReadResponse = InstanceInteraction & {
  type: ResponseInteractionTypes["read"];
  body: Resource;
};

export type VersionReadResponse = InstanceInteraction & {
  type: ResponseInteractionTypes["vread"];
  versionId: string;
  body: Resource;
};

export type UpdateResponse = InstanceInteraction & {
  type: ResponseInteractionTypes["update"];
  body: Resource;
};

// TODO - implement patch type
export type PatchResponse = InstanceInteraction & {
  type: ResponseInteractionTypes["patch"];
  body: Resource;
};

export type DeleteResponse = InstanceInteraction & {
  type: ResponseInteractionTypes["delete"];
};

type HISTORY_BODY = BundleEntry[];

export type InstanceHistoryResponse = InstanceInteraction & {
  type: ResponseInteractionTypes["history"];
  body: HISTORY_BODY;
};

export type CreateResponse = TypeInteraction & {
  type: ResponseInteractionTypes["create"];
  body: Resource;
};

export type TypeSearchResponse = TypeInteraction & {
  parameters: ParsedParameter<string | number>[];
  type: ResponseInteractionTypes["search"];
  total?: unsignedInt;
  body: Resource[];
};

export type TypeHistoryResponse = TypeInteraction & {
  type: ResponseInteractionTypes["history"];
  body: HISTORY_BODY;
};

export type CapabilitiesResponse = SystemInteraction & {
  type: ResponseInteractionTypes["capabilities"];
  body: CapabilityStatement;
};

export type BatchResponse = SystemInteraction & {
  type: ResponseInteractionTypes["batch"];
  body: Bundle;
};

export type TransactionResponse = SystemInteraction & {
  type: ResponseInteractionTypes["transaction"];
  body: Bundle;
};

export type SystemHistoryResponse = SystemInteraction & {
  type: ResponseInteractionTypes["history"];
  body: HISTORY_BODY;
};

export type SystemSearchResponse = SystemInteraction & {
  parameters: ParsedParameter<string | number>[];
  type: ResponseInteractionTypes["search"];
  total?: unsignedInt;
  body: Resource[];
};

export type InvokeInstanceResponse = InstanceInteraction & {
  type: ResponseInteractionTypes["invoke"];
  operation: code;
  body: Parameters;
};

export type InvokeTypeResponse = TypeInteraction & {
  type: ResponseInteractionTypes["invoke"];
  operation: code;
  body: Parameters;
};

export type InvokeSystemResponse = SystemInteraction & {
  type: ResponseInteractionTypes["invoke"];
  operation: code;
  body: Parameters;
};

export type InvokeResponse =
  | InvokeInstanceResponse
  | InvokeTypeResponse
  | InvokeSystemResponse;

export type InvokeRequest =
  | InvokeInstanceRequest
  | InvokeTypeRequest
  | InvokeSystemRequest;

export type FHIRResponse =
  | InvokeInstanceResponse
  | InvokeTypeResponse
  | InvokeSystemResponse
  | ReadResponse
  | VersionReadResponse
  | UpdateResponse
  | PatchResponse
  | DeleteResponse
  | InstanceHistoryResponse
  | CreateResponse
  | TypeSearchResponse
  | TypeHistoryResponse
  | CapabilitiesResponse
  | BatchResponse
  | TransactionResponse
  | SystemHistoryResponse
  | SystemSearchResponse;
