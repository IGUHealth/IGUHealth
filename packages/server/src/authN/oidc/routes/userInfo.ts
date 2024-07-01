import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

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
    if (!ctx.state.user) {
      throw new OperationError(
        outcomeError("forbidden", "User is not authenticated."),
      );
    }
    const user = await ctx.state.oidc.userManagement.get(
      ctx.state.iguhealth,
      ctx.state.user.sub,
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
