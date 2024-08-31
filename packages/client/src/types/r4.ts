import {
  Bundle,
  CapabilityStatement,
  OperationOutcome,
  Parameters,
  Resource,
  ResourceType,
  code,
  id,
} from "@iguhealth/fhir-types/r4/types";
import { R4 } from "@iguhealth/fhir-types/versions";

import type { ParsedParameter } from "../url.js";
import {
  Request,
  RequestInteractionTypes,
  RequestLevel,
  ResponseInteractionTypes,
} from "./utilities.js";

export interface R4InstanceInteraction extends Request<R4, "instance"> {
  resource: ResourceType;
  id: id;
}

export interface R4TypeInteraction extends Request<R4, "type"> {
  resource: ResourceType;
}

export interface R4SystemInteraction extends Request<R4, "system"> {}

export type R4ReadRequest = R4InstanceInteraction & {
  type: RequestInteractionTypes["read"];
};

export type R4VersionReadRequest = R4InstanceInteraction & {
  type: RequestInteractionTypes["vread"];
  versionId: string;
};

export type R4UpdateRequest = R4InstanceInteraction & {
  type: RequestInteractionTypes["update"];
  body: Resource;
};

// TODO - implement patch type
export type R4PatchRequest = R4InstanceInteraction & {
  type: RequestInteractionTypes["patch"];
  body: unknown;
};

export type R4InstanceDeleteRequest = R4InstanceInteraction & {
  type: RequestInteractionTypes["delete"];
};

export type R4TypeDeleteRequest = R4TypeInteraction & {
  parameters: ParsedParameter<string | number>[];
  type: RequestInteractionTypes["delete"];
};

export type R4SystemDeleteRequest = R4SystemInteraction & {
  parameters: ParsedParameter<string | number>[];
  type: RequestInteractionTypes["delete"];
};

export type R4HistoryInstanceRequest = R4InstanceInteraction & {
  type: RequestInteractionTypes["history"];
  parameters?: ParsedParameter<string | number>[];
};

export type R4CreateRequest = R4TypeInteraction & {
  type: RequestInteractionTypes["create"];
  body: Resource;
};

export type R4ConditinalUpdateRequest = R4TypeInteraction & {
  type: RequestInteractionTypes["update"];
  parameters: ParsedParameter<string | number>[];
  body: Resource;
};

export type R4TypeSearchRequest = R4TypeInteraction & {
  parameters: ParsedParameter<string | number>[];
  type: RequestInteractionTypes["search"];
};

export type R4TypeHistoryRequest = R4TypeInteraction & {
  type: RequestInteractionTypes["history"];
  parameters?: ParsedParameter<string | number>[];
};

export type R4CapabilitiesRequest = R4SystemInteraction & {
  type: RequestInteractionTypes["capabilities"];
};

export type R4BatchRequest = R4SystemInteraction & {
  type: RequestInteractionTypes["batch"];
  body: Bundle;
};

export type R4TransactionRequest = R4SystemInteraction & {
  type: RequestInteractionTypes["transaction"];
  body: Bundle;
};

export type R4SystemHistoryRequest = R4SystemInteraction & {
  type: RequestInteractionTypes["history"];
  parameters?: ParsedParameter<string | number>[];
};

export type R4SystemSearchRequest = R4SystemInteraction & {
  parameters: ParsedParameter<string | number>[];
  type: RequestInteractionTypes["search"];
};

export type R4InvokeInstanceRequest = R4InstanceInteraction & {
  type: RequestInteractionTypes["invoke"];
  operation: code;
  body: Resource;
};

export type R4InvokeTypeRequest = R4TypeInteraction & {
  type: RequestInteractionTypes["invoke"];
  operation: code;
  body: Resource;
};

export type R4InvokeSystemRequest = R4SystemInteraction & {
  type: RequestInteractionTypes["invoke"];
  operation: code;
  body: Resource;
};

export type R4FHIRRequest =
  | R4InvokeInstanceRequest
  | R4InvokeTypeRequest
  | R4InvokeSystemRequest
  | R4ReadRequest
  | R4VersionReadRequest
  | R4UpdateRequest
  | R4PatchRequest
  | R4HistoryInstanceRequest
  | R4InstanceDeleteRequest
  | R4CreateRequest
  | R4TypeSearchRequest
  | R4TypeHistoryRequest
  | R4TypeDeleteRequest
  | R4CapabilitiesRequest
  | R4BatchRequest
  | R4TransactionRequest
  | R4SystemHistoryRequest
  | R4SystemSearchRequest
  | R4SystemDeleteRequest
  | R4ConditinalUpdateRequest;

export type R4ReadResponse = R4InstanceInteraction & {
  type: ResponseInteractionTypes["read"];
  body: Resource;
};

export type R4VersionReadResponse = R4InstanceInteraction & {
  type: ResponseInteractionTypes["vread"];
  versionId: string;
  body: Resource;
};

export type R4UpdateResponse = R4InstanceInteraction & {
  type: ResponseInteractionTypes["update"];
  created?: boolean;
  body: Resource;
};

// TODO - implement patch type
export type R4PatchResponse = R4InstanceInteraction & {
  type: ResponseInteractionTypes["patch"];
  body: Resource;
};

export type R4InstanceDeleteResponse = R4InstanceInteraction & {
  type: ResponseInteractionTypes["delete"];
};

export type R4TypeDeleteResponse = R4TypeInteraction & {
  parameters: ParsedParameter<string | number>[];
  type: ResponseInteractionTypes["delete"];
};

export type R4SystemDeleteResponse = R4SystemInteraction & {
  parameters: ParsedParameter<string | number>[];
  type: ResponseInteractionTypes["delete"];
};

export type R4InstanceHistoryResponse = R4InstanceInteraction & {
  type: ResponseInteractionTypes["history"];
  body: Bundle;
};

export type R4CreateResponse = R4TypeInteraction & {
  type: ResponseInteractionTypes["create"];
  body: Resource;
};

export type R4TypeSearchResponse = R4TypeInteraction & {
  parameters: ParsedParameter<string | number>[];
  type: ResponseInteractionTypes["search"];
  body: Bundle;
};

export type R4TypeHistoryResponse = R4TypeInteraction & {
  type: ResponseInteractionTypes["history"];
  body: Bundle;
};

export type R4CapabilitiesResponse = R4SystemInteraction & {
  type: ResponseInteractionTypes["capabilities"];
  body: CapabilityStatement;
};

export type R4BatchResponse = R4SystemInteraction & {
  type: ResponseInteractionTypes["batch"];
  body: Bundle;
};

export type R4TransactionResponse = R4SystemInteraction & {
  type: ResponseInteractionTypes["transaction"];
  body: Bundle;
};

export type R4SystemHistoryResponse = R4SystemInteraction & {
  type: ResponseInteractionTypes["history"];
  body: Bundle;
};

export type R4SystemSearchResponse = R4SystemInteraction & {
  parameters: ParsedParameter<string | number>[];
  type: ResponseInteractionTypes["search"];
  body: Bundle;
};

export type R4InvokeInstanceResponse = R4InstanceInteraction & {
  type: ResponseInteractionTypes["invoke"];
  operation: code;
  body: Parameters;
};

export type R4InvokeTypeResponse = R4TypeInteraction & {
  type: ResponseInteractionTypes["invoke"];
  operation: code;
  body: Parameters;
};

export type R4InvokeSystemResponse = R4SystemInteraction & {
  type: ResponseInteractionTypes["invoke"];
  operation: code;
  body: Parameters;
};

export type R4InvokeResponse =
  | R4InvokeInstanceResponse
  | R4InvokeTypeResponse
  | R4InvokeSystemResponse;

export type R4InvokeRequest =
  | R4InvokeInstanceRequest
  | R4InvokeTypeRequest
  | R4InvokeSystemRequest;

interface R4ErrorResponse<Level extends keyof RequestLevel>
  extends Request<R4, Level> {
  type: ResponseInteractionTypes["error"];
  body: OperationOutcome;
}

export type R4FHIRErrorResponse =
  | R4ErrorResponse<"system">
  | R4ErrorResponse<"type">
  | R4ErrorResponse<"instance">;

export type R4FHIRResponse =
  | R4FHIRErrorResponse
  | R4InvokeInstanceResponse
  | R4InvokeTypeResponse
  | R4InvokeSystemResponse
  | R4ReadResponse
  | R4VersionReadResponse
  | R4UpdateResponse
  | R4PatchResponse
  | R4InstanceHistoryResponse
  | R4InstanceDeleteResponse
  | R4CreateResponse
  | R4TypeSearchResponse
  | R4TypeHistoryResponse
  | R4TypeDeleteResponse
  | R4CapabilitiesResponse
  | R4BatchResponse
  | R4TransactionResponse
  | R4SystemHistoryResponse
  | R4SystemSearchResponse
  | R4SystemDeleteResponse;
