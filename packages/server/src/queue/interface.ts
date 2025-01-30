import * as s from "zapatos/schema";

import {
  R4BInvokeInstanceRequest,
  R4BInvokeSystemRequest,
  R4BInvokeTypeRequest,
  R4InvokeInstanceRequest,
  R4InvokeSystemRequest,
  R4InvokeTypeRequest,
} from "@iguhealth/client/lib/types";
import { TenantId } from "@iguhealth/jwt";

import { DynamicTopic } from "./topics/dynamic-topic.js";
import { ITopic, TenantTopic, TopicType } from "./topics/index.js";

export type MutationType = Extract<s.Table, "resources">;

export type IType = "create" | "invoke";

interface IOperation<Type extends IType> {
  type: Type;
}

interface IMutation<Resource extends MutationType, Interaction extends IType>
  extends IOperation<Interaction> {
  resource: Resource;
}

export interface CreateOperation<Type extends MutationType>
  extends IMutation<Type, "create"> {
  value: s.InsertableForTable<Type>;
}

export interface InvokeOperation extends IOperation<"invoke"> {
  value:
    | R4BInvokeInstanceRequest
    | R4BInvokeTypeRequest
    | R4BInvokeSystemRequest
    | R4InvokeInstanceRequest
    | R4InvokeTypeRequest
    | R4InvokeSystemRequest;
}

type OperationMap<Type extends MutationType> = {
  create: CreateOperation<Type>;

  invoke: InvokeOperation;
};

export type Operation<
  Type extends MutationType,
  Interaction extends IType,
> = OperationMap<Type>[Interaction];

export type Operations = (CreateOperation<MutationType> | InvokeOperation)[];

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
