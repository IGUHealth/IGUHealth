import * as db from "zapatos/db";
import * as s from "zapatos/schema";

import { IGUHealthServerCTX } from "../../../fhir-server/types.js";
import {
  ITenantAdmin,
  ITenantAuthModel,
  LoginProvider,
  User,
} from "../../interfaces/authAdmin/authAdmin.js";
import { IAuthAdmin } from "../../interfaces/authAdmin/index.js";
import { AuthorizationCode, PostgresAuthorizationCodeAdmin } from "./codes.js";
import { PostgresAuthorizationScopeAdmin } from "./scopes.js";
import { PostgresTenantAdmin } from "./tenants.js";
import { PostgresUserAdmin } from "./users.js";

export class PostgresAuthAdmin<CTX extends IGUHealthServerCTX>
  implements IAuthAdmin<CTX>
{
  public tenant: ITenantAdmin<CTX>;

  public user: ITenantAuthModel<
    CTX,
    "users",
    Omit<s.users.Insertable, "password">,
    User
  > &
    LoginProvider<CTX>;

  public authorization_code: ITenantAuthModel<
    CTX,
    "authorization_code",
    Pick<
      s.authorization_code.Insertable,
      | "type"
      | "user_id"
      | "tenant"
      | "expires_in"
      | "client_id"
      | "redirect_uri"
      | "pkce_code_challenge"
      | "pkce_code_challenge_method"
      | "meta"
    >,
    AuthorizationCode
  >;

  public authorization_scope: ITenantAuthModel<CTX, "authorization_scopes">;

  constructor(pgClient: db.Queryable) {
    this.tenant = new PostgresTenantAdmin(pgClient);
    this.user = new PostgresUserAdmin(pgClient);
    this.authorization_code = new PostgresAuthorizationCodeAdmin(pgClient);
    this.authorization_scope = new PostgresAuthorizationScopeAdmin(pgClient);
  }
}
