import React from "react";

import { Login } from "@iguhealth/components";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import * as views from "../../../../views/index.js";
import { User } from "../../../db/users/types.js";
import { OIDC_ROUTES } from "../../constants.js";
import * as adminApp from "../../hardcodedClients/admin-app.js";
import type { OIDCRouteHandler } from "../../index.js";

function getRoutes(ctx: Parameters<OIDCRouteHandler>[0]) {
  const loginRoute = ctx.router.url(
    OIDC_ROUTES.LOGIN_POST,
    {
      tenant: ctx.oidc.tenant,
    },
    { query: { state: ctx.query.state } },
  );
  if (loginRoute instanceof Error) throw loginRoute;

  const signupURL = ctx.router.url(OIDC_ROUTES.SIGNUP_GET, {
    tenant: ctx.oidc.tenant,
  });
  if (signupURL instanceof Error) throw signupURL;

  const forgotPasswordURL = ctx.router.url(
    OIDC_ROUTES.PASSWORD_RESET_INITIATE_GET,
    { tenant: ctx.oidc.tenant },
  );
  if (forgotPasswordURL instanceof Error) throw forgotPasswordURL;

  return {
    signupURL: ctx.oidc.allowSignup ? signupURL : undefined,
    loginRoute,
    forgotPasswordURL,
  };
}

type LoginState = { redirectUrl: string };

export function encodeState(state: LoginState): string {
  // https://developer.mozilla.org/en-US/docs/Glossary/Base64
  // A common variant is "Base64 URL safe", which omits the padding and replaces +/ with -_ to avoid characters that might cause problems in URL path segments or query parameters.
  return btoa(JSON.stringify(state)).replace("+", "-").replace("/", "_");
}

export function decodeState(
  ctx: Parameters<OIDCRouteHandler>[0],
  stateString: string | undefined,
): LoginState | undefined {
  if (!stateString) return undefined;
  try {
    const state = JSON.parse(
      atob(stateString.replace("-", "+").replace("_", "/")),
    );
    if (Object.keys(state).length !== 1) {
      return undefined;
    }
    if (typeof state.redirectUrl !== "string") {
      return undefined;
    }
    // Strict enforcement so redirect can only happen on authorize endpoint.
    if (
      !state.redirectUrl.startsWith(
        ctx.router.url(OIDC_ROUTES.AUTHORIZE_GET, {
          tenant: ctx.oidc.tenant,
        }),
      )
    ) {
      throw new OperationError(
        outcomeError(
          "invalid",
          "Redirect URL must be a relative path for login.",
        ),
      );
    }

    return state;
  } catch (e) {
    return undefined;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object";
}

async function validateCredentials(
  ctx: Parameters<OIDCRouteHandler>[0],
): Promise<User | undefined> {
  const body = ctx.request.body;
  if (isRecord(body)) {
    const email = body.email;
    const password = body.password;
    if (typeof email !== "string" || typeof password !== "string") {
      throw new OperationError(
        outcomeError("invalid", "Email and password must be present."),
      );
    }

    return await ctx.oidc.sessionLogin(ctx, "email-password", {
      email,
      password,
    });
  }

  return undefined;
}

export const loginPOST = (): OIDCRouteHandler => async (ctx, next) => {
  const loginURL = ctx.router.url(OIDC_ROUTES.LOGIN_GET, {
    tenant: ctx.oidc.tenant,
  });

  if (loginURL instanceof Error) throw loginURL;

  const { signupURL, loginRoute, forgotPasswordURL } = getRoutes(ctx);

  const user = await validateCredentials(ctx);

  if (user !== undefined) {
    const state = decodeState(ctx, ctx.query.state?.toString());

    if (state?.redirectUrl) {
      ctx.redirect(state?.redirectUrl);
      return;
    } else if (adminApp.ADMIN_APP() !== undefined) {
      const tenantClaims = await ctx.oidc.userManagement.getTenantClaims(
        ctx.iguhealth,
        user.id,
      );
      const tenantId = tenantClaims[0]?.id;
      if (tenantId) {
        ctx.redirect(adminApp.redirectURL(tenantId) as string);
      }
      return;
    }

    // If logged in but no redirect display login with success message.
    ctx.status = 201;
    ctx.body = views.renderString(
      React.createElement(Login, {
        title: "IGUHealth",
        logo: "/public/img/logo.svg",
        action: loginRoute,
        signupURL,
        forgotPasswordURL,
        messages: ["You have successfully logged in."],
      }),
    );
  } else {
    ctx.status = 401;
    ctx.body = views.renderString(
      React.createElement(Login, {
        title: "IGUHealth",
        logo: "/public/img/logo.svg",
        action: loginRoute,
        signupURL,
        forgotPasswordURL,
        errors: ["Invalid email or password. Please try again."],
      }),
    );
    return;
  }

  await next();
};

export const loginGET = (): OIDCRouteHandler => async (ctx) => {
  const { signupURL, loginRoute, forgotPasswordURL } = getRoutes(ctx);
  const message = ctx.request.query["message"]?.toString();
  const email = ctx.request.query["email"]?.toString();

  ctx.status = 200;
  ctx.body = views.renderString(
    React.createElement(Login, {
      title: "IGUHealth",
      logo: "/public/img/logo.svg",
      email,
      messages: message ? [message] : [],
      action: loginRoute,
      signupURL,
      forgotPasswordURL,
    }),
  );
};
