import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import * as users from "../../db/users/index.js";
import { OIDCRouteHandler } from "../index.js";

type UserInfoResponse = {
  sub?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  email?: string;
  picture?: string;
};

export function userInfo(): OIDCRouteHandler {
  return async (ctx, next) => {
    if (!ctx.state.iguhealth.user) {
      throw new OperationError(
        outcomeError("forbidden", "User is not authenticated."),
      );
    }
    const user = await users.get(
      ctx.state.iguhealth.store.getClient(),
      ctx.state.iguhealth.tenant,
      ctx.state.iguhealth.user.payload.sub,
    );
    ctx.body = {
      sub: user?.id,
      given_name: user?.first_name ?? undefined,
      family_name: user?.last_name ?? undefined,
      email: user?.email ?? undefined,
    } as UserInfoResponse;

    await next();
  };
}
