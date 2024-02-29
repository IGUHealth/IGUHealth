import * as s from "zapatos/schema";

import { ModelManagement } from "../interface.js";
import { AuthorizationCode } from "./types.js";

export interface AuthorizationCodeManagement
  extends ModelManagement<
    AuthorizationCode,
    s.authorization_code.Whereable,
    s.authorization_code.Insertable,
    s.authorization_code.Updatable
  > {}
