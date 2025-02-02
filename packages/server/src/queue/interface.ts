import {
  AllInteractions,
  FHIRRequest,
  FHIRResponse,
} from "@iguhealth/client/lib/types";
import { id } from "@iguhealth/fhir-types/lib/generated/r4/types";
import { FHIR_VERSION } from "@iguhealth/fhir-types/versions";
import { CUSTOM_CLAIMS, TOKEN_RESOURCE_TYPES, TenantId } from "@iguhealth/jwt";

import { DynamicTopic } from "./topics/dynamic-topic.js";
import { ITopic, TenantTopic, TopicType } from "./topics/index.js";

interface IOperation {
  author: {
    [CUSTOM_CLAIMS.RESOURCE_TYPE]: TOKEN_RESOURCE_TYPES;
    [CUSTOM_CLAIMS.RESOURCE_ID]: id;
  };
}

export type MutationTypes = Extract<
  AllInteractions,
  "create" | "update" | "delete" | "invoke" | "patch"
>;

export interface Operation<
  Version extends FHIR_VERSION,
  Type extends MutationTypes,
> extends IOperation {
  type: Type;
  request: FHIRRequest<Version, Type>;
  response: Type extends "invoke" ? undefined : FHIRResponse<Version, Type>;
}

export function isOperationType<I extends MutationTypes>(
  interaction: I,
  operation: Operation<FHIR_VERSION, MutationTypes>,
): operation is Operation<FHIR_VERSION, I> {
  return operation.type === interaction;
}

export type Operations = Operation<FHIR_VERSION, MutationTypes>[];

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
