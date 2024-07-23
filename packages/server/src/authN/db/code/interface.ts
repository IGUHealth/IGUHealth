import * as s from "zapatos/schema";

import { ModelManagement } from "../interface.js";
import { AuthorizationCode } from "./types.js";

export interface AuthorizationCodeManagement
  extends ModelManagement<
    AuthorizationCode,
    s.authorization_code.Whereable,
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
    >,
    s.authorization_code.Updatable
  > {}
