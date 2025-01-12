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

type Insertables = {
  users: s.users.Insertable;
  tenants: s.tenants.Insertable;
  resources: s.resources.Insertable;
};

export type MutationType = keyof Insertables;

type Whereables = {
  users: s.users.Whereable;
  tenants: s.tenants.Whereable;
  resources: s.resources.Whereable;
};

type Columns = {
  users: s.users.Column;
  tenants: s.tenants.Column;
  resources: s.resources.Column;
};

type Whereable<Type extends MutationType> = Whereables[Type];

type Insertable<Type extends MutationType> = Insertables[Type];

type Column<Type extends MutationType> = Columns[Type];

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
  where: Whereable<Type>;
  singular?: boolean;
}

export interface UpdateOperation<Type extends MutationType>
  extends IMutation<Type, "update"> {
  constraint: Column<Type>[];
  value: Insertable<Type>;
  onConflict: Column<Type>[];
}

export interface CreateOperation<Type extends MutationType>
  extends IMutation<Type, "create"> {
  value: Insertable<Type>;
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
  send(tenant: TenantId, topic_id: string, messages: Message[]): Promise<void>;
  batch(): Promise<IQueueTransaction>;
  isBatch(): boolean;
}

export interface IQueueTransaction extends IQueue {
  commit(): Promise<void>;
  abort(): Promise<void>;
}
