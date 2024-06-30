import React from "react";

import { EmailForm, Feedback } from "@iguhealth/components";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import * as views from "../../../../views/index.js";
import { OIDC_ROUTES } from "../../constants.js";
import type { OIDCRouteHandler } from "../../index.js";
import { sendAlertEmail } from "../../utilities/sendAlertEmail.js";
import { sendPasswordResetEmail } from "../../utilities/sendPasswordResetEmail.js";

export const signupGET = (): OIDCRouteHandler => async (ctx) => {
  const signupURL = ctx.router.url(OIDC_ROUTES.SIGNUP_POST, {
    tenant: ctx.oidc.tenant,
  });
  if (typeof signupURL !== "string") throw signupURL;

  ctx.status = 200;
  ctx.body = views.renderString(
    React.createElement(EmailForm, {
      logo: "/public/img/logo.svg",
      header: "Sign up",
      action: signupURL,
    }),
  );
};

export const signupPOST = (): OIDCRouteHandler => async (ctx) => {
  if (!ctx.oidc.allowSignup) {
    throw new OperationError(
      outcomeError("forbidden", "Signup is not allowed."),
    );
  }

  const body = ctx.request.body as
    | { email?: string; password?: string }
    | undefined;

  const email = body?.email;

  if (!email) {
    throw new OperationError(outcomeError("invalid", "Email is required."));
  }

  const existingUser = (
    await ctx.oidc.userManagement.search(ctx.state.iguhealth, {
      email,
    })
  )[0];
  if (existingUser !== undefined) {
    await sendPasswordResetEmail(
      ctx.router,
      { ...ctx.state.iguhealth, tenant: ctx.oidc.tenant },
      ctx.oidc.codeManagement,
      existingUser,
    );
  } else {
    const user = await ctx.oidc.userManagement.create(ctx.state.iguhealth, {
      email,
    });

    // Alert system admin of new user.
    await sendAlertEmail(
      ctx.state.iguhealth.emailProvider,
      "New User",
      `A new user with email '${user.email}' has signed up.`,
    );
    await sendPasswordResetEmail(
      ctx.router,
      { ...ctx.state.iguhealth, tenant: ctx.oidc.tenant },
      ctx.oidc.codeManagement,
      user,
    );
  }

  ctx.status = 200;
  ctx.body = views.renderString(
    React.createElement(Feedback, {
      logo: "/public/img/logo.svg",
      title: "IGUHealth",
      header: "Email Verification",
      content:
        "An email will arrive in the next few minutes with the next steps to complete your registration.",
    }),
  );
};
