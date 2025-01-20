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

import { TenantTopic, TopicType } from "./topics/tenants.js";

export type MutationType = Extract<s.Table, "users" | "tenants" | "resources">;

export type IType = "create" | "delete" | "update" | "invoke";

interface IOperation<Type extends IType> {
  type: Type;
}

interface IMutation<Resource extends MutationType, Interaction extends IType>
  extends IOperation<Interaction> {
  resource: Resource;
}

export interface DeleteOperation<Type extends MutationType>
  extends IMutation<Type, "delete"> {
  where: s.WhereableForTable<Type>;
  singular?: boolean;
}

export interface UpdateOperation<Type extends MutationType>
  extends IMutation<Type, "update"> {
  constraint: s.ColumnForTable<Type>[];
  value: s.InsertableForTable<Type>;
  onConflict: s.ColumnForTable<Type>[];
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
  delete: DeleteOperation<Type>;
  update: UpdateOperation<Type>;
  invoke: InvokeOperation;
};

export type Operation<
  Type extends MutationType,
  Interaction extends IType,
> = OperationMap<Type>[Interaction];

export type Operations = (
  | CreateOperation<MutationType>
  | DeleteOperation<MutationType>
  | UpdateOperation<MutationType>
  | InvokeOperation
)[];

export type Message = {
  key?: string;
  value: Operations;
  headers?: Record<string, string>;
};

export interface IQueue {
  send<T extends TenantId, Topic extends TopicType>(
    tenant: T,
    topic_id: TenantTopic<T, Topic>,
    messages: Message[],
  ): Promise<void>;
  batch(): Promise<IQueueBatch>;
  isBatch(): boolean;
}

export interface IQueueBatch extends IQueue {
  commit(): Promise<void>;
  abort(): Promise<void>;
}
