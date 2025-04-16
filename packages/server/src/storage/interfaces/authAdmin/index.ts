import * as s from "zapatos/schema";

import {
  ITenantAdmin,
  ITenantAuthModel,
  LoginProvider,
  User,
} from "./authAdmin.js";

export interface IAuthAdmin<CTX> {
  tenant: ITenantAdmin<CTX>;
  user: ITenantAuthModel<
    CTX,
    "users",
    Omit<s.users.Insertable, "password">,
    User
  > &
    LoginProvider<CTX>;
}
