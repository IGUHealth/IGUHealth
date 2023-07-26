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
  resourceType: string;
  id: id;
};

export type TypeInteraction = {
  level: RequestLevel["type"];
  resourceType: string;
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
  body: Object;
};

export type DeleteRequest = InstanceInteraction & {
  type: RequestInteractionTypes["delete"];
};

export type HistoryInstanceRequest = InstanceInteraction & {
  type: RequestInteractionTypes["history"];
};

export type CreateRequest = TypeInteraction & {
  type: RequestInteractionTypes["create"];
  body: Resource;
};

export type TypeSearchRequest = TypeInteraction & {
  query: FHIRURL;
  type: RequestInteractionTypes["search"];
};

export type TypeHistoryRequest = TypeInteraction & {
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

export type InvokeInstanceRequest = InstanceInteraction & {
  query: FHIRURL;
  type: RequestInteractionTypes["invoke"];
  operation: string;
  body: Parameters;
};

export type InvokeTypeRequest = TypeInteraction & {
  query: FHIRURL;
  type: RequestInteractionTypes["invoke"];
  operation: string;
  body: Parameters;
};

export type InvokeSystemRequest = SystemInteraction & {
  query: FHIRURL;
  type: RequestInteractionTypes["invoke"];
  operation: string;
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

export type HistoryInstanceResponse = InstanceInteraction & {
  type: ResponseInteractionTypes["history"];
  body: Resource[];
};

export type CreateResponse = TypeInteraction & {
  type: ResponseInteractionTypes["create"];
  body: Resource;
};

export type TypeSearchResponse = TypeInteraction & {
  query: FHIRURL;
  type: ResponseInteractionTypes["search"];
  body: Resource[];
};

export type TypeHistoryResponse = TypeInteraction & {
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

export type InvokeInstanceResponse = InstanceInteraction & {
  query: FHIRURL;
  type: ResponseInteractionTypes["invoke"];
  operation: string;
  body: Parameters;
};

export type InvokeTypeResponse = TypeInteraction & {
  query: FHIRURL;
  type: ResponseInteractionTypes["invoke"];
  operation: string;
  body: Parameters;
};

export type InvokeSystemResponse = SystemInteraction & {
  query: FHIRURL;
  type: ResponseInteractionTypes["invoke"];
  operation: string;
  body: Parameters;
};

export type FHIRResponse =
  | InvokeInstanceResponse
  | InvokeTypeResponse
  | InvokeSystemResponse
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
