import type koa from "koa";
import React from "react";
import { user_scope } from "zapatos/schema";

import { Login } from "@iguhealth/components";

import * as views from "../../../../views/index.js";
import { OIDC_ROUTES } from "../../constants.js";
import type { ManagementRouteHandler } from "../../index.js";

/**
 * This function sets the login redirect url on the session.
 * @param session Koa Session
 * @param redirectUrl redirect url to set on the session for login.
 */
export function setLoginRedirectSession(
  session: koa.BaseContext["session"],
  redirectUrl: string,
) {
  if (session) {
    session.loginRedirect = redirectUrl;
  }
}

/**
 * Deletes the login redirect url from the session
 * @param session
 */
export function removeLoginRedirectURL(session: koa.BaseContext["session"]) {
  delete session?.loginRedirect;
}

/**
 * Get the login redirect url that is set using setLoginRedirectSession
 * @param session Koa Session
 * @returns Login redirect set on the session
 */
export function getLoginRedirectURL(
  session: koa.BaseContext["session"],
): string | undefined {
  return session?.loginRedirect;
}

export const loginPOST =
  (scope: user_scope): ManagementRouteHandler =>
  async (ctx, next) => {
    const loginURL = ctx.router.url(OIDC_ROUTES(scope).LOGIN_GET, {
      tenant: ctx.oidc.tenant,
    });

    if (loginURL instanceof Error) throw loginURL;

    return ctx.oidc.passport.authenticate(
      "local",
      (_err, user, _info, _status) => {
        if (user === false) {
          ctx.body = { success: false };
          ctx.throw(401);
        } else {
          const redirecTURL =
            getLoginRedirectURL(ctx.session) ??
            (ctx.router.url(OIDC_ROUTES(scope).LOGIN_GET, {
              tenant: ctx.oidc.tenant,
            }) as string);
          removeLoginRedirectURL(ctx.session);

          ctx.redirect(redirecTURL);
          return ctx.login(user);
        }
      },
    )(ctx, next);
  };

export const loginGET =
  (scope: user_scope): ManagementRouteHandler =>
  async (ctx) => {
    const loginRoute = ctx.router.url(OIDC_ROUTES(scope).LOGIN_POST, {
      tenant: ctx.oidc.tenant,
    });
    if (loginRoute instanceof Error) throw loginRoute;
    const signupURL = ctx.router.url(OIDC_ROUTES(scope).SIGNUP_GET, {
      tenant: ctx.oidc.tenant,
    });
    if (signupURL instanceof Error) throw signupURL;
    const forgotPasswordURL = ctx.router.url(
      OIDC_ROUTES(scope).PASSWORD_RESET_INITIATE_GET,
      { tenant: ctx.oidc.tenant },
    );

    if (forgotPasswordURL instanceof Error) throw forgotPasswordURL;

    views.renderPipe(
      ctx,
      React.createElement(Login, {
        logo: "/public/img/logo.svg",
        title: "IGUHealth",
        action: loginRoute,
        signupURL,
        forgotPasswordURL,
      }),
    );
  };
