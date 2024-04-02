import type koa from "koa";
import React from "react";
import { user_scope } from "zapatos/schema";

import { Login } from "@iguhealth/components";

import * as views from "../../../../views/index.js";
import { OIDC_ROUTES } from "../../constants.js";
import type { ManagementRouteHandler } from "../../index.js";

function getRoutes(
  ctx: Parameters<ManagementRouteHandler>[0],
  scope: user_scope,
) {
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

  return {
    signupURL: ctx.oidc.allowSignup ? signupURL : undefined,
    loginRoute,
    forgotPasswordURL,
  };
}

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
      async (_err, user, _info, _status) => {
        const { signupURL, loginRoute, forgotPasswordURL } = getRoutes(
          ctx,
          scope,
        );
        if (user === false) {
          views.renderPipe(
            ctx,
            React.createElement(Login, {
              title: "IGUHealth",
              logo: "/public/img/logo.svg",
              action: loginRoute,
              signupURL,
              forgotPasswordURL,
              errors: ["Invalid email or password. Please try again."],
            }),
            401,
          );
        } else {
          const redirectURL = getLoginRedirectURL(ctx.session);

          await ctx.login(user);

          if (redirectURL) {
            removeLoginRedirectURL(ctx.session);
            ctx.redirect(redirectURL);
            return;
          }

          // If logged in but no redirect display login with success message.
          return views.renderPipe(
            ctx,
            React.createElement(Login, {
              title: "IGUHealth",
              logo: "/public/img/logo.svg",
              action: loginRoute,
              signupURL,
              forgotPasswordURL,
              messages: ["You have successfully logged in."],
            }),
            201,
          );
        }
      },
    )(ctx, next);
  };

export const loginGET =
  (scope: user_scope): ManagementRouteHandler =>
  async (ctx) => {
    const { signupURL, loginRoute, forgotPasswordURL } = getRoutes(ctx, scope);
    const message = ctx.request.query["message"]?.toString();

    views.renderPipe(
      ctx,
      React.createElement(Login, {
        title: "IGUHealth",
        logo: "/public/img/logo.svg",
        messages: message ? [message] : [],
        action: loginRoute,
        signupURL,
        forgotPasswordURL,
      }),
    );
  };
