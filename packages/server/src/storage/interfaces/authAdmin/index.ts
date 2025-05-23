import * as s from "zapatos/schema";

import { IGUHealthServerCTX } from "../../../fhir-server/types.js";
import { AuthorizationCode } from "../../postgres/authAdmin/codes.js";
import {
  ITenantAdmin,
  ITenantAuthModel,
  LoginProvider,
  User,
} from "./authAdmin.js";

export interface IAuthAdmin<CTX extends IGUHealthServerCTX> {
  tenant: ITenantAdmin<CTX>;

  authorization_code: ITenantAuthModel<
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

  authorization_scope: ITenantAuthModel<CTX, "authorization_scopes">;

  user: ITenantAuthModel<
    CTX,
    "users",
    Omit<s.users.Insertable, "password">,
    User
  > &
    LoginProvider<CTX>;
}
