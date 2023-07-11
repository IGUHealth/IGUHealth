import {
  id,
  Resource,
  Bundle,
  CapabilityStatement,
} from "@iguhealth/fhir-types/r4/types";
import { FHIRURL } from "@iguhealth/fhir-query";

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
};

export type InstanceLevelInteraction = {
  level: RequestLevel["instance"];
  resourceType: string;
  id: id;
};

export type TypeLevelInteractions = {
  level: RequestLevel["type"];
  resourceType: string;
};

export type SystemInteraction = {
  level: RequestLevel["system"];
};

export type ReadRequest = InstanceLevelInteraction & {
  type: RequestInteractionTypes["read"];
};

export type VersionReadRequest = InstanceLevelInteraction & {
  type: RequestInteractionTypes["vread"];
  versionId: string;
};

export type UpdateRequest = InstanceLevelInteraction & {
  type: RequestInteractionTypes["update"];
  body: Resource;
};

// TODO - implement patch type
export type PatchRequest = InstanceLevelInteraction & {
  type: RequestInteractionTypes["patch"];
  body: Object;
};

export type DeleteRequest = InstanceLevelInteraction & {
  type: RequestInteractionTypes["delete"];
};

export type HistoryInstanceRequest = InstanceLevelInteraction & {
  type: RequestInteractionTypes["history"];
};

export type CreateRequest = TypeLevelInteractions & {
  type: RequestInteractionTypes["create"];
  body: Resource;
};

export type TypeSearchRequest = TypeLevelInteractions & {
  query: FHIRURL;
  type: RequestInteractionTypes["search"];
};

export type TypeHistoryRequest = TypeLevelInteractions & {
  type: RequestInteractionTypes["history"];
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
};

export type SystemSearchRequest = SystemInteraction & {
  query: FHIRURL;
  type: RequestInteractionTypes["search"];
};

export type FHIRRequest =
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

export type ReadResponse = InstanceLevelInteraction & {
  type: ResponseInteractionTypes["read"];
  body: Resource;
};

export type VersionReadResponse = InstanceLevelInteraction & {
  type: ResponseInteractionTypes["vread"];
  body: Resource;
};

export type UpdateResponse = InstanceLevelInteraction & {
  type: ResponseInteractionTypes["update"];
  body: Resource;
};

// TODO - implement patch type
export type PatchResponse = InstanceLevelInteraction & {
  type: ResponseInteractionTypes["patch"];
  body: Resource;
};

export type DeleteResponse = InstanceLevelInteraction & {
  type: ResponseInteractionTypes["delete"];
};

export type HistoryInstanceResponse = InstanceLevelInteraction & {
  type: ResponseInteractionTypes["history"];
  body: Resource[];
};

export type CreateResponse = TypeLevelInteractions & {
  type: ResponseInteractionTypes["create"];
  body: Resource;
};

export type TypeSearchResponse = TypeLevelInteractions & {
  query: FHIRURL;
  type: ResponseInteractionTypes["search"];
  body: Resource[];
};

export type TypeHistoryResponse = TypeLevelInteractions & {
  type: ResponseInteractionTypes["history"];
  body: Resource[];
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
  body: Resource[];
};

export type SystemSearchResponse = SystemInteraction & {
  query: FHIRURL;
  type: ResponseInteractionTypes["search"];
  body: Resource[];
};

export type FHIRResponse =
  | ReadResponse
  | VersionReadResponse
  | UpdateResponse
  | PatchResponse
  | DeleteResponse
  | HistoryInstanceResponse
  | CreateResponse
  | TypeSearchResponse
  | TypeHistoryResponse
  | CapabilitiesResponse
  | BatchResponse
  | TransactionResponse
  | SystemHistoryResponse
  | SystemSearchResponse;
