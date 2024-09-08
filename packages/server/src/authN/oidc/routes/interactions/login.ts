import React from "react";

import { Login } from "@iguhealth/components";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import * as views from "../../../../views/index.js";
import type { LoginErrors, User } from "../../../db/users/index.js";
import { OIDC_ROUTES } from "../../constants.js";
import type { OIDCRouteHandler } from "../../index.js";

function getRoutes(ctx: Parameters<OIDCRouteHandler>[0]) {
  const loginRoute = ctx.router.url(
    OIDC_ROUTES.LOGIN_POST,
    {
      tenant: ctx.state.iguhealth.tenant,
    },
    { query: ctx.state.oidc.parameters },
  );
  if (loginRoute instanceof Error) throw loginRoute;

  const signupURL = ctx.router.url(OIDC_ROUTES.SIGNUP_GET, {
    tenant: ctx.state.iguhealth.tenant,
  });

  if (signupURL instanceof Error) throw signupURL;

  const forgotPasswordURL = ctx.router.url(
    OIDC_ROUTES.PASSWORD_RESET_INITIATE_GET,
    { tenant: ctx.state.iguhealth.tenant },
  );
  if (forgotPasswordURL instanceof Error) throw forgotPasswordURL;

  return {
    signupURL: ctx.state.allowSignup ? signupURL : undefined,
    loginRoute,
    forgotPasswordURL,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object";
}

async function login(
  ctx: Parameters<OIDCRouteHandler>[0],
): Promise<{ user: User | undefined; errors: LoginErrors[] }> {
  const body = ctx.request.body;
  if (isRecord(body)) {
    const email = body.email;
    const password = body.password;
    if (typeof email !== "string" || typeof password !== "string") {
      throw new OperationError(
        outcomeError("invalid", "Email and password must be present."),
      );
    }

    return ctx.state.oidc.sessionLogin(ctx, "email-password", {
      email,
      password,
    });
  }

  return { user: undefined, errors: ["invalid-credentials"] };
}

function errorToDescription(error: LoginErrors): string {
  switch (error) {
    case "invalid-credentials": {
      return "Invalid email or password.";
    }
    case "email-not-verified": {
      return "Email not verified.";
    }
    default: {
      return "Unknown error.";
    }
  }
}

export const loginPOST = (): OIDCRouteHandler => async (ctx, next) => {
  const loginURL = ctx.router.url(OIDC_ROUTES.LOGIN_GET, {
    tenant: ctx.state.iguhealth.tenant,
  });

  if (loginURL instanceof Error) throw loginURL;

  const { signupURL, loginRoute, forgotPasswordURL } = getRoutes(ctx);

  const { user, errors } = await login(ctx);
  if (errors.length !== 0 || !user) {
    ctx.status = 401;
    ctx.body = views.renderString(
      React.createElement(Login, {
        title: "IGUHealth",
        logo: "/public/img/logo.svg",
        action: loginRoute,
        signupURL,
        forgotPasswordURL,
        errors: [errorToDescription(errors[0])],
      }),
    );
  } else {
    const authorize_route = ctx.router.url(
      OIDC_ROUTES.AUTHORIZE_GET,
      { tenant: ctx.state.iguhealth.tenant },
      { query: ctx.state.oidc.parameters },
    );
    if (authorize_route instanceof Error) throw authorize_route;
    ctx.redirect(authorize_route);
  }
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
