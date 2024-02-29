import * as s from "zapatos/schema";

export type AuthorizationCode = s.authorization_code.JSONSelectable & {
  is_expired: boolean;
};
