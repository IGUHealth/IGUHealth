import {
  Bundle,
  CapabilityStatement,
  OperationOutcome,
  Parameters,
  Resource,
  ResourceType,
  code,
  id,
} from "@iguhealth/fhir-types/r4b/types";
import { R4B } from "@iguhealth/fhir-types/versions";

import type { ParsedParameter } from "../url.js";
import {
  Request,
  RequestInteractionTypes,
  RequestLevel,
  ResponseInteractionTypes,
} from "./utilities.js";

export interface R4BInstanceInteraction extends Request<R4B, "instance"> {
  resource: ResourceType;
  id: id;
}

export interface R4BTypeInteraction extends Request<R4B, "type"> {
  resource: ResourceType;
}

export interface R4BSystemInteraction extends Request<R4B, "system"> {}

export type R4BReadRequest = R4BInstanceInteraction & {
  type: RequestInteractionTypes["read"];
};

export type R4BVersionReadRequest = R4BInstanceInteraction & {
  type: RequestInteractionTypes["vread"];
  versionId: string;
};

export type R4BUpdateRequest = R4BInstanceInteraction & {
  type: RequestInteractionTypes["update"];
  body: Resource;
};

// TODO - implement patch type
export type R4BPatchRequest = R4BInstanceInteraction & {
  type: RequestInteractionTypes["patch"];
  body: unknown;
};

export type R4BInstanceDeleteRequest = R4BInstanceInteraction & {
  type: RequestInteractionTypes["delete"];
};

export type R4BTypeDeleteRequest = R4BTypeInteraction & {
  parameters: ParsedParameter<string | number>[];
  type: RequestInteractionTypes["delete"];
};

export type R4BSystemDeleteRequest = R4BSystemInteraction & {
  parameters: ParsedParameter<string | number>[];
  type: RequestInteractionTypes["delete"];
};

export type R4BHistoryInstanceRequest = R4BInstanceInteraction & {
  type: RequestInteractionTypes["history"];
  parameters?: ParsedParameter<string | number>[];
};

export type R4BCreateRequest = R4BTypeInteraction & {
  type: RequestInteractionTypes["create"];
  body: Resource;
};

export type R4BConditinalUpdateRequest = R4BTypeInteraction & {
  type: RequestInteractionTypes["update"];
  parameters: ParsedParameter<string | number>[];
  body: Resource;
};

export type R4BTypeSearchRequest = R4BTypeInteraction & {
  parameters: ParsedParameter<string | number>[];
  type: RequestInteractionTypes["search"];
};

export type R4BTypeHistoryRequest = R4BTypeInteraction & {
  type: RequestInteractionTypes["history"];
  parameters?: ParsedParameter<string | number>[];
};

export type R4BCapabilitiesRequest = R4BSystemInteraction & {
  type: RequestInteractionTypes["capabilities"];
};

export type R4BBatchRequest = R4BSystemInteraction & {
  type: RequestInteractionTypes["batch"];
  body: Bundle;
};

export type R4BTransactionRequest = R4BSystemInteraction & {
  type: RequestInteractionTypes["transaction"];
  body: Bundle;
};

export type R4BSystemHistoryRequest = R4BSystemInteraction & {
  type: RequestInteractionTypes["history"];
  parameters?: ParsedParameter<string | number>[];
};

export type R4BSystemSearchRequest = R4BSystemInteraction & {
  parameters: ParsedParameter<string | number>[];
  type: RequestInteractionTypes["search"];
};

export type R4BInvokeInstanceRequest = R4BInstanceInteraction & {
  type: RequestInteractionTypes["invoke"];
  operation: code;
  body: Resource;
};

export type R4BInvokeTypeRequest = R4BTypeInteraction & {
  type: RequestInteractionTypes["invoke"];
  operation: code;
  body: Resource;
};

export type R4BInvokeSystemRequest = R4BSystemInteraction & {
  type: RequestInteractionTypes["invoke"];
  operation: code;
  body: Resource;
};

export type R4BFHIRRequest =
  | R4BInvokeInstanceRequest
  | R4BInvokeTypeRequest
  | R4BInvokeSystemRequest
  | R4BReadRequest
  | R4BVersionReadRequest
  | R4BUpdateRequest
  | R4BPatchRequest
  | R4BInstanceDeleteRequest
  | R4BHistoryInstanceRequest
  | R4BCreateRequest
  | R4BTypeSearchRequest
  | R4BTypeHistoryRequest
  | R4BTypeDeleteRequest
  | R4BCapabilitiesRequest
  | R4BBatchRequest
  | R4BTransactionRequest
  | R4BSystemHistoryRequest
  | R4BSystemSearchRequest
  | R4BSystemDeleteRequest
  | R4BConditinalUpdateRequest;

export type R4BReadResponse = R4BInstanceInteraction & {
  type: ResponseInteractionTypes["read"];
  body: Resource;
};

export type R4BVersionReadResponse = R4BInstanceInteraction & {
  type: ResponseInteractionTypes["vread"];
  versionId: string;
  body: Resource;
};

export type R4BUpdateResponse = R4BInstanceInteraction & {
  type: ResponseInteractionTypes["update"];
  created?: boolean;
  body: Resource;
};

// TODO - implement patch type
export type R4BPatchResponse = R4BInstanceInteraction & {
  type: ResponseInteractionTypes["patch"];
  body: Resource;
};

export type R4BInstanceDeleteResponse = R4BInstanceInteraction & {
  type: ResponseInteractionTypes["delete"];
};

export type R4BTypeDeleteResponse = R4BTypeInteraction & {
  parameters: ParsedParameter<string | number>[];
  type: ResponseInteractionTypes["delete"];
};

export type R4BSystemDeleteResponse = R4BSystemInteraction & {
  parameters: ParsedParameter<string | number>[];
  type: ResponseInteractionTypes["delete"];
};

export type R4BInstanceHistoryResponse = R4BInstanceInteraction & {
  type: ResponseInteractionTypes["history"];
  body: Bundle;
};

export type R4BCreateResponse = R4BTypeInteraction & {
  type: ResponseInteractionTypes["create"];
  body: Resource;
};

export type R4BTypeSearchResponse = R4BTypeInteraction & {
  parameters: ParsedParameter<string | number>[];
  type: ResponseInteractionTypes["search"];
  body: Bundle;
};

export type R4BTypeHistoryResponse = R4BTypeInteraction & {
  type: ResponseInteractionTypes["history"];
  body: Bundle;
};

export type R4BCapabilitiesResponse = R4BSystemInteraction & {
  type: ResponseInteractionTypes["capabilities"];
  body: CapabilityStatement;
};

export type R4BBatchResponse = R4BSystemInteraction & {
  type: ResponseInteractionTypes["batch"];
  body: Bundle;
};

export type R4BTransactionResponse = R4BSystemInteraction & {
  type: ResponseInteractionTypes["transaction"];
  body: Bundle;
};

export type R4BSystemHistoryResponse = R4BSystemInteraction & {
  type: ResponseInteractionTypes["history"];
  body: Bundle;
};

export type R4BSystemSearchResponse = R4BSystemInteraction & {
  parameters: ParsedParameter<string | number>[];
  type: ResponseInteractionTypes["search"];
  body: Bundle;
};

export type R4BInvokeInstanceResponse = R4BInstanceInteraction & {
  type: ResponseInteractionTypes["invoke"];
  operation: code;
  body: Parameters;
};

export type R4BInvokeTypeResponse = R4BTypeInteraction & {
  type: ResponseInteractionTypes["invoke"];
  operation: code;
  body: Parameters;
};

export type R4BInvokeSystemResponse = R4BSystemInteraction & {
  type: ResponseInteractionTypes["invoke"];
  operation: code;
  body: Parameters;
};

export type R4BInvokeResponse =
  | R4BInvokeInstanceResponse
  | R4BInvokeTypeResponse
  | R4BInvokeSystemResponse;

export type R4BInvokeRequest =
  | R4BInvokeInstanceRequest
  | R4BInvokeTypeRequest
  | R4BInvokeSystemRequest;

interface R4BErrorResponse<Level extends keyof RequestLevel>
  extends Request<R4B, Level> {
  type: ResponseInteractionTypes["error"];
  body: OperationOutcome;
}
export type R4BFHIRErrorResponse =
  | R4BErrorResponse<"system">
  | R4BErrorResponse<"type">
  | R4BErrorResponse<"instance">;

export type R4BFHIRResponse =
  | R4BFHIRErrorResponse
  | R4BInvokeInstanceResponse
  | R4BInvokeTypeResponse
  | R4BInvokeSystemResponse
  | R4BReadResponse
  | R4BVersionReadResponse
  | R4BUpdateResponse
  | R4BPatchResponse
  | R4BInstanceDeleteResponse
  | R4BInstanceHistoryResponse
  | R4BCreateResponse
  | R4BTypeSearchResponse
  | R4BTypeHistoryResponse
  | R4BTypeDeleteResponse
  | R4BCapabilitiesResponse
  | R4BBatchResponse
  | R4BTransactionResponse
  | R4BSystemHistoryResponse
  | R4BSystemSearchResponse
  | R4BSystemDeleteResponse;
