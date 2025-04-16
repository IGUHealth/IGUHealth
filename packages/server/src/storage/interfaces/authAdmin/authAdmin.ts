import * as s from "zapatos/schema";

import { id } from "@iguhealth/fhir-types/r4/types";
import { TenantId } from "@iguhealth/jwt";

export type AuthTypes = Extract<s.Table, "tenants" | "users" | "authorization_code"  | "authorization_scopes">;


export interface ITenantAuthModel<
  CTX,
  T extends AuthTypes,
  CreateModel = s.InsertableForTable<T>,
  ReadModel = s.JSONSelectableForTable<T>,
  UpdateModel = s.UpdatableForTable<T>,
  Whereable = s.WhereableForTable<T>,
> {
  create(ctx: CTX, tenant: TenantId, data: CreateModel): Promise<ReadModel>;

  read(ctx: CTX, tenant: TenantId, id: id): Promise<ReadModel | undefined>;

  update(
    ctx: CTX,
    tenant: TenantId,
    id: id,
    data: UpdateModel,
  ): Promise<ReadModel>;

  delete(ctx: CTX, tenant: TenantId, where: Whereable): Promise<void>;

  where(ctx: CTX, tenant: TenantId, where: Whereable): Promise<ReadModel[]>;
}

export interface ITenantAdmin<CTX> {
  create(
    _ctx: CTX,
    data: Partial<s.Insertable>,
  ): Promise<s.tenants.JSONSelectable>;

  read(ctx: CTX, id: id): Promise<s.tenants.JSONSelectable | undefined>;

  delete(ctx: CTX, where: s.tenants.Whereable): Promise<void>;
}

export const USER_QUERY_COLS = <const>[
  "fhir_user_id",
  "tenant",
  "email",
  "email_verified",
  "role",
];

export type User = s.users.OnlyCols<typeof USER_QUERY_COLS>;

export type LoginErrors = "invalid-credentials" | "email-not-verified";
type SuccessfulLogin = { type: "successful"; user: User };
type FailedLogin = { type: "failed"; errors: LoginErrors[] };
export type LoginResult = SuccessfulLogin | FailedLogin;

export type LoginParameters = {
  "email-password": {
    email: string;
    password: string;
  };
  "oidc-provider": {
    email: string;
    provider: string;
  };
};

export interface LoginProvider<CTX> {
  login<T extends keyof LoginParameters>(
    ctx: CTX,
    tenant: TenantId,
    type: T,
    parameters: LoginParameters[T],
  ): Promise<LoginResult>;
}
