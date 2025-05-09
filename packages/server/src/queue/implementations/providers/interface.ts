import { AllInteractions, FHIRResponse } from "@iguhealth/client/lib/types";
import { id } from "@iguhealth/fhir-types/lib/generated/r4/types";
import { FHIR_VERSION } from "@iguhealth/fhir-types/versions";
import { CUSTOM_CLAIMS, TOKEN_RESOURCE_TYPES, TenantId } from "@iguhealth/jwt";

import {
  IConsumerGroupID,
  ITopic,
  ITopicMessage,
  TenantTopic,
  TopicType,
} from "../topics/index.js";

interface IOperation {
  author: {
    [CUSTOM_CLAIMS.RESOURCE_TYPE]: TOKEN_RESOURCE_TYPES;
    [CUSTOM_CLAIMS.RESOURCE_ID]: id;
  };
}

export type MutationTypes = Extract<
  AllInteractions,
  "create" | "update" | "delete" | "patch" | "error"
>;

export interface Operation<
  Version extends FHIR_VERSION,
  Type extends MutationTypes,
> extends IOperation {
  fhirVersion: Version;
  type: Type;
  response: FHIRResponse<Version, Type>;
}

export function isOperationType<I extends MutationTypes>(
  interaction: I,
  operation: Operation<FHIR_VERSION, MutationTypes>,
): operation is Operation<FHIR_VERSION, I> {
  return operation.type === interaction;
}

export type Operations = Operation<FHIR_VERSION, MutationTypes>[];

export interface IMessage<Value> {
  key?: string;
  headers?: Record<string, string>;
  value: Value;
}

export type TenantMessage = IMessage<Operations>;

export type DynamicMessage = IMessage<{
  action: "subscribe";
  topic: ITopic;
  consumer_groups: IConsumerGroupID[];
}>;

export interface IQueue {
  send<T extends ITopic>(
    topic_id: T,
    messages: ITopicMessage<T>[],
  ): Promise<void>;

  createTopic<T extends ITopic>(topic: T): Promise<boolean>;

  sendTenant<
    Tenant extends TenantId,
    Type extends TopicType,
    T extends TenantTopic<Tenant, Type>,
  >(
    tenant: Tenant,
    topic: T,
    messages: ITopicMessage<T>[],
  ): Promise<void>;

  batch(): Promise<IQueueBatch>;

  isBatch(): boolean;

  disconnect(): Promise<void>;
}

export interface IQueueBatch extends IQueue {
  commit(): Promise<void>;
  abort(): Promise<void>;
}
