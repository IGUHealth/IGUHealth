import { user_scope } from "zapatos/schema";

import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { ManagementRouteHandler } from "../index.js";

type UserInfoResponse = {
  sub?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  email?: string;
  picture?: string;
};

export function userInfo(_scope: user_scope): ManagementRouteHandler {
  return async (ctx, next) => {
    if ((await ctx.oidc.isAuthenticated(ctx)) || !ctx.oidc.user) {
      throw new OperationError(
        outcomeError("login", "User is not authenticated."),
      );
    }

    const userInfoResponse: UserInfoResponse = {
      sub: ctx.oidc.user?.id,
      name:
        ctx.oidc.user?.first_name && ctx.oidc.user?.last_name
          ? ctx.oidc.user?.first_name + " " + ctx.oidc.user?.last_name
          : undefined,
      given_name: ctx.oidc.user?.first_name ?? undefined,
      family_name: ctx.oidc.user?.last_name ?? undefined,
      email: ctx.oidc.user?.email ?? undefined,
    };
    ctx.body = userInfoResponse;
    await next();
  };
}
