import { ManagementRouteHandler } from "../index.js";

type UserInfoResponse = {
  sub?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  email?: string;
  picture?: string;
};

export function userInfo(): ManagementRouteHandler {
  return async (ctx, next) => {
    const user = await ctx.oidc.userManagement.get(
      ctx.FHIRContext,
      // [TODO]
      //@ts-ignore
      ctx.FHIRContext.user.jwt.sub,
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
