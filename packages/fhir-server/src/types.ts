import {
  id,
  Resource,
  Bundle,
  CapabilityStatement,
} from "@genfhi/fhir-types/r4/types";
import { FHIRURL } from "@genfhi/fhir-query";

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

type ReadRequest = InstanceLevelInteraction & {
  type: RequestInteractionTypes["read"];
};

type VersionReadRequest = InstanceLevelInteraction & {
  type: RequestInteractionTypes["vread"];
  versionId: string;
};

type UpdateRequest = InstanceLevelInteraction & {
  type: RequestInteractionTypes["update"];
  body: Resource;
};

// TODO - implement patch type
type PatchRequest = InstanceLevelInteraction & {
  type: RequestInteractionTypes["patch"];
  body: Object;
};

type DeleteRequest = InstanceLevelInteraction & {
  type: RequestInteractionTypes["delete"];
};

type HistoryInstanceRequest = InstanceLevelInteraction & {
  type: RequestInteractionTypes["history"];
};

type CreateRequest = TypeLevelInteractions & {
  type: RequestInteractionTypes["create"];
  body: Resource;
};

type TypeSearchRequest = TypeLevelInteractions & {
  query: FHIRURL;
  type: RequestInteractionTypes["search"];
};

type TypeHistoryRequest = TypeLevelInteractions & {
  type: RequestInteractionTypes["history"];
};

type CapabilitiesRequest = SystemInteraction & {
  type: RequestInteractionTypes["capabilities"];
};

type BatchRequest = SystemInteraction & {
  type: RequestInteractionTypes["batch"];
  body: Bundle;
};

type TransactionRequest = SystemInteraction & {
  type: RequestInteractionTypes["transaction"];
  body: Bundle;
};

type SystemHistoryRequest = SystemInteraction & {
  type: RequestInteractionTypes["history"];
};

type SystemSearchRequest = SystemInteraction & {
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

type ReadResponse = InstanceLevelInteraction & {
  type: ResponseInteractionTypes["read"];
  body: Resource;
};

type VersionReadResponse = InstanceLevelInteraction & {
  type: ResponseInteractionTypes["vread"];
  body: Resource;
};

type UpdateResponse = InstanceLevelInteraction & {
  type: ResponseInteractionTypes["update"];
  body: Resource;
};

// TODO - implement patch type
type PatchResponse = InstanceLevelInteraction & {
  type: ResponseInteractionTypes["patch"];
  body: Resource;
};

type DeleteResponse = InstanceLevelInteraction & {
  type: ResponseInteractionTypes["delete"];
};

type HistoryInstanceResponse = InstanceLevelInteraction & {
  type: ResponseInteractionTypes["history"];
  body: Resource[];
};

type CreateResponse = TypeLevelInteractions & {
  type: ResponseInteractionTypes["create"];
  body: Resource;
};

type TypeSearchResponse = TypeLevelInteractions & {
  query: FHIRURL;
  type: ResponseInteractionTypes["search"];
  body: Resource[];
};

type TypeHistoryResponse = TypeLevelInteractions & {
  type: ResponseInteractionTypes["history"];
  body: Resource[];
};

type CapabilitiesResponse = SystemInteraction & {
  type: ResponseInteractionTypes["capabilities"];
  body: CapabilityStatement;
};

type BatchResponse = SystemInteraction & {
  type: ResponseInteractionTypes["batch"];
  body: Bundle;
};

type TransactionResponse = SystemInteraction & {
  type: ResponseInteractionTypes["transaction"];
  body: Bundle;
};

type SystemHistoryResponse = SystemInteraction & {
  type: ResponseInteractionTypes["history"];
  body: Resource[];
};

type SystemSearchResponse = SystemInteraction & {
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
