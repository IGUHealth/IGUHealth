/**
 * Session utilities for managing user session login.
 */

import { asRoot } from "../../../fhir-server/types.js";
import {
  LoginParameters,
  LoginResult,
  User,
} from "../../../storage/interfaces/authAdmin/authAdmin.js";
import { OIDCRouteHandler } from "../index.js";
import { USER_SESSION_KEY } from "./constants.js";

export function serializeUser(user: User): string {
  return user.fhir_user_id;
}

export async function deserializeUser(
  ctx: Parameters<OIDCRouteHandler>[0],
): Promise<User | undefined> {
  try {
    const id = ctx.session?.[USER_SESSION_KEY];
    if (!id) return undefined;
    const user = await ctx.state.iguhealth.store.auth.user.read(
      asRoot(ctx.state.iguhealth),
      ctx.state.iguhealth.tenant,
      id,
    );

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

export function sessionSetUserLogin(
  ctx: Parameters<OIDCRouteHandler>[0],
  user: User | undefined,
) {
  if (!ctx.session) {
    throw new Error("Session not found in context.");
  }
  ctx.session[USER_SESSION_KEY] = user ? serializeUser(user) : undefined;
}

/**
 * Log in the user and set the loggedin session key.
 * @param ctx Koa context
 * @returns True if the user is logged in. False otherwise.
 */
export async function sessionCredentialsLogin<
  Method extends keyof LoginParameters,
>(
  ctx: Parameters<OIDCRouteHandler>[0],
  method: Method,
  credentials: LoginParameters[Method],
): Promise<LoginResult> {
  const result = await ctx.state.iguhealth.store.auth.user.login(
    asRoot(ctx.state.iguhealth),
    ctx.state.iguhealth.tenant,
    method,
    credentials,
  );

  if (result.type === "failed") {
    sessionSetUserLogin(ctx, undefined);
  } else {
    sessionSetUserLogin(ctx, result.user);
  }

  return result;
}

/**
 * Logout the current user.
 * @param ctx Koa context
 */
export function sessionLogout(ctx: Parameters<OIDCRouteHandler>[0]) {
  if (!ctx.session) {
    return;
  }
  ctx.session = null;
}
