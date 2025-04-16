import * as db from "zapatos/db";
import * as s from "zapatos/schema";

import {
  ITenantAdmin,
  ITenantAuthModel,
  LoginProvider,
  User,
} from "../../interfaces/authAdmin/authAdmin.js";
import { IAuthAdmin } from "../../interfaces/authAdmin/index.js";
import { PostgresTenantAdmin } from "./tenants.js";
import { PostgresUserAdmin } from "./users.js";

export class PostgresAuthAdmin<CTX> implements IAuthAdmin<CTX> {
  public tenant: ITenantAdmin<CTX>;
  public user: ITenantAuthModel<
    CTX,
    "users",
    Omit<s.users.Insertable, "password">,
    User
  > &
    LoginProvider<CTX>;

  constructor(pgClient: db.Queryable) {
    this.tenant = new PostgresTenantAdmin(pgClient);
    this.user = new PostgresUserAdmin(pgClient);
  }
}
