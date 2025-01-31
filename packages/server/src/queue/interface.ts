import {
  CreateRequest,
  CreateResponse,
  DeleteRequest,
  DeleteResponse,
  InvokeRequest,
  PatchRequest,
  PatchResponse,
  UpdateRequest,
  UpdateResponse,
} from "@iguhealth/client/lib/types";
import { Reference } from "@iguhealth/fhir-types/lib/generated/r4/types";
import { FHIR_VERSION } from "@iguhealth/fhir-types/versions";
import { TenantId } from "@iguhealth/jwt";

import { DynamicTopic } from "./topics/dynamic-topic.js";
import { ITopic, TenantTopic, TopicType } from "./topics/index.js";

interface IOperation {
  author: Reference;
}

interface CreateOperation<Version extends FHIR_VERSION> extends IOperation {
  request: CreateRequest<Version>;
  response: CreateResponse<Version>;
}

interface UpdateOperation<Version extends FHIR_VERSION> extends IOperation {
  request: UpdateRequest<Version>;
  response: UpdateResponse<Version>;
}

interface PatchOperation<Version extends FHIR_VERSION> extends IOperation {
  request: PatchRequest<Version>;
  response: PatchResponse<Version>;
}

interface DeleteOperation<Version extends FHIR_VERSION> extends IOperation {
  request: DeleteRequest<Version>;
  response: DeleteResponse<Version>;
}

interface InvokeOperation<Version extends FHIR_VERSION> extends IOperation {
  request: InvokeRequest<Version>;
}

export type Operation<Version extends FHIR_VERSION> =
  | CreateOperation<Version>
  | UpdateOperation<Version>
  | DeleteOperation<Version>
  | InvokeOperation<Version>
  | PatchOperation<Version>;

export type Operations = Operation<FHIR_VERSION>[];

export interface IMessage {
  key?: string;
  headers?: Record<string, string>;
}

export interface TenantMessage extends IMessage {
  value: Operations;
}

export interface DynamicMessage extends IMessage {
  value: {
    action: "subscribe";
    topic: ITopic;
    consumer_groups: string[];
  };
}

export type Message<T extends ITopic> =
  T extends TenantTopic<TenantId, TopicType>
    ? TenantMessage
    : T extends DynamicTopic
      ? DynamicMessage
      : never;

export interface IQueue {
  send<T extends ITopic>(topic_id: T, messages: Message<T>[]): Promise<void>;

  sendTenant<
    Tenant extends TenantId,
    Type extends TopicType,
    T extends TenantTopic<Tenant, Type>,
  >(
    tenant: Tenant,
    topic: T,
    messages: Message<T>[],
  ): Promise<void>;

  batch(): Promise<IQueueBatch>;

  isBatch(): boolean;
}

export interface IQueueBatch extends IQueue {
  commit(): Promise<void>;
  abort(): Promise<void>;
}
