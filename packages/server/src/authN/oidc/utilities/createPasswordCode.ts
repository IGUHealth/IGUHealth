import db from "zapatos/db";

import { TenantId } from "@iguhealth/jwt";

import * as codes from "../../db/code/index.js";
import { User } from "../../db/users/index.js";

export function createPasswordResetCode(
  pg: db.Queryable,
  tenant: TenantId,
  user: Pick<User, "id" | "email">,
): Promise<codes.AuthorizationCode> {
  return codes.create(pg, tenant, {
    type: "password_reset",
    user_id: user.id,
    expires_in: "15 minutes",
    // include email to verify on the password reset that it aligns with the current user.
    // Scenario is a user requests password change
    // While in the user management they then change the email.
    // We now must verify the email associated with the code matches the user.
    meta: {
      email: user.email,
    },
  });
}
