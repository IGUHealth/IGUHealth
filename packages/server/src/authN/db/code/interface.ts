import * as s from "zapatos/schema";

import { ModelManagement } from "../interface.js";
import { AuthorizationCode } from "./types.js";

export interface AuthorizationCodeManagement
  extends ModelManagement<
    AuthorizationCode,
    s.authorization_code.Whereable,
    Pick<
      s.authorization_code.Insertable,
      "type" | "user_id" | "tenant" | "expires_in" | "client_id" | "payload"
    >,
    s.authorization_code.Updatable
  > {}
