import { IAdminModel } from "./authAdmin.js";

export interface IAuthAdmin<CTX> {
  tenant: IAdminModel<CTX, "tenants">;
}
