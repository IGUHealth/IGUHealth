/**
 * Session utilities for managing user session login.
 */

import { LoginParameters, User } from "../../db/users/types.js";
import { USER_SESSION_KEY } from "../constants.js";
import { OIDCRouteHandler } from "../index.js";

export function serializeUser(user: User): string {
  return user.id;
}

export async function deserializeUser(
  ctx: Parameters<OIDCRouteHandler>[0],
): Promise<User | undefined> {
  try {
    const id = ctx.session?.[USER_SESSION_KEY];
    if (!id) return undefined;
    const user = await ctx.state.oidc.userManagement.get(ctx.state.iguhealth, id);
    if (!user) {
      return undefined;
    }
    return user;
  } catch (err) {
    ctx.state.iguhealth.logger.error(err);
    return undefined;
  }
}

export async function isAuthenticated(
  ctx: Parameters<OIDCRouteHandler>[0],
): Promise<boolean> {
  return ctx.state.oidc.user !== undefined;
}

/**
 * Log in the user and set the loggedin session key.
 * @param ctx Koa context
 * @returns True if the user is logged in. False otherwise.
 */
export async function sessionLogin<Method extends keyof LoginParameters>(
  ctx: Parameters<OIDCRouteHandler>[0],
  method: Method,
  credentials: LoginParameters[Method],
): Promise<User | undefined> {
  if (!ctx.session) {
    throw new Error("Session not found in context.");
  }

  const user = await ctx.state.oidc.userManagement.login(
    ctx.state.iguhealth,
    method,
    credentials,
  );

  if (!user) {
    ctx.session[USER_SESSION_KEY] = undefined;
    return undefined;
  }

  ctx.session[USER_SESSION_KEY] = serializeUser(user);

  return user;
}

/**
 * Logout the current user.
 * @param ctx Koa context
 */
export function sessionLogout(ctx: Parameters<OIDCRouteHandler>[0]) {
  if (!ctx.session) {
    return;
  }
  ctx.session[USER_SESSION_KEY] = undefined;
}
