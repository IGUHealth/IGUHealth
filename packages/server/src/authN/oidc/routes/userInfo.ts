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
    const user = await ctx.oidc.userManagement.get(
      ctx.iguhealth,
      // [TODO]
      //@ts-ignore
      ctx.iguhealth.user.jwt.sub,
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
