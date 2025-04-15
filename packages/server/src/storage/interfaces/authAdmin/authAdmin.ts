import * as s from "zapatos/schema";

import { id } from "@iguhealth/fhir-types/r4/types";

export type AuthTypes = Extract<s.Table, "tenants">; // | "users"

export interface IAdminModel<
  CTX,
  T extends AuthTypes,
  CreateModel = s.InsertableForTable<T>,
  ReadModel = s.JSONSelectableForTable<T>,
  UpdateModel = s.UpdatableForTable<T>,
  Whereable = s.WhereableForTable<T>,
> {
  create(ctx: CTX, data: CreateModel): Promise<ReadModel>;

  read(ctx: CTX, id: id): Promise<ReadModel | undefined>;

  update(ctx: CTX, id: id, data: UpdateModel): Promise<ReadModel>;

  delete(ctx: CTX, where: Whereable): Promise<void>;

  where(ctx: CTX, where: Whereable): Promise<ReadModel[]>;
}
