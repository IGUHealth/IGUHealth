import * as s from "zapatos/schema";

import { TenantId } from "@iguhealth/jwt";

export type IType = keyof Insertables;

type Insertables = {
  users: s.users.Insertable;
  tenants: s.tenants.Insertable;
  resources: s.resources.Insertable;
};

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

type Whereable<Type extends IType> = Whereables[Type];

type Insertable<Type extends IType> = Insertables[Type];

type Column<Type extends IType> = Columns[Type];

export type IInteraction = "create" | "delete" | "update";

interface IMutation<Type extends IType, Interaction extends IInteraction> {
  type: Type;
  interaction: Interaction;
}

export interface DeleteMutation<Type extends IType>
  extends IMutation<Type, "delete"> {
  where: Whereable<Type>;
  singular?: boolean;
}

export interface UpdateMutation<Type extends IType>
  extends IMutation<Type, "update"> {
  constraint: Column<Type>[];
  value: Insertable<Type>;
  onConflict: Column<Type>[];
}

export interface CreateMutation<Type extends IType>
  extends IMutation<Type, "create"> {
  value: Insertable<Type>;
}

type MutationMap<Type extends IType> = {
  create: CreateMutation<Type>;
  delete: DeleteMutation<Type>;
  update: UpdateMutation<Type>;
};

export type Mutation<
  Type extends IType,
  Interaction extends IInteraction,
> = MutationMap<Type>[Interaction];

export type Mutations = (
  | CreateMutation<IType>
  | DeleteMutation<IType>
  | UpdateMutation<IType>
)[];

export type Message = {
  key?: string;
  value: Mutations;
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
