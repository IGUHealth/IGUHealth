/**
 * Session utilities for managing user session login.
 */
import { LoginParameters, User } from "../../db/users/types.js";
import { USER_SESSION_KEY } from "../constants.js";
import { ManagementRouteHandler } from "../index.js";

export function serializeUser(user: User): string {
  return user.id;
}

export async function deserializeUser(
  ctx: Parameters<ManagementRouteHandler>[0],
  id?: string,
): Promise<User | undefined> {
  try {
    if (!id) return undefined;
    const user = await ctx.oidc.userManagement.get(ctx.postgres, id);
    if (!user) {
      return undefined;
    }
    return user;
  } catch (err) {
    console.error(err);
    return undefined;
  }
}

export async function isAuthenticated(
  ctx: Parameters<ManagementRouteHandler>[0],
): Promise<boolean> {
  return ctx.oidc.user !== undefined;
}

/**
 * Log in the user and set the loggedin session key.
 * @param ctx Koa context
 * @returns True if the user is logged in. False otherwise.
 */
export async function sessionLogin<Method extends keyof LoginParameters>(
  ctx: Parameters<ManagementRouteHandler>[0],
  method: Method,
  credentials: LoginParameters[Method],
): Promise<boolean> {
  if (!ctx.session) {
    throw new Error("Session not found in context.");
  }

  const user = await ctx.oidc.userManagement.login(
    ctx.postgres,
    method,
    credentials,
  );

  if (!user) {
    ctx.session[USER_SESSION_KEY] = undefined;
    return false;
  }

  ctx.session[USER_SESSION_KEY] = serializeUser(user);

  return true;
}

/**
 * Logout the current user.
 * @param ctx Koa context
 */
export function sessionLogout(ctx: Parameters<ManagementRouteHandler>[0]) {
  if (!ctx.session) {
    return;
  }
  ctx.session[USER_SESSION_KEY] = undefined;
}
