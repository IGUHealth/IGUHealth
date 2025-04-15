import * as db from "zapatos/db";

import { IAdminModel } from "../../interfaces/authAdmin/authAdmin.js";
import { IAuthAdmin } from "../../interfaces/authAdmin/index.js";
import { PostgresTenantAdmin } from "./tenants.js";

export class PostgresAuthAdmin<CTX> implements IAuthAdmin<CTX> {
  public tenant: IAdminModel<CTX, "tenants">;
  constructor(pgClient: db.Queryable) {
    this.tenant = new PostgresTenantAdmin(pgClient);
  }
}
