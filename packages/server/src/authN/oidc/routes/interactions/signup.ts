import React from "react";
import { user_scope } from "zapatos/schema";

import { EmailForm, Feedback } from "@iguhealth/components";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import * as views from "../../../../views/index.js";
import { OIDC_ROUTES } from "../../constants.js";
import type { ManagementRouteHandler } from "../../index.js";
import { sendAlertEmail } from "../../utilities/sendAlertEmail.js";
import { sendPasswordResetEmail } from "../../utilities/sendPasswordResetEmail.js";

export const signupGET =
  (scope: user_scope): ManagementRouteHandler =>
  async (ctx) => {
    const signupURL = ctx.router.url(OIDC_ROUTES(scope).SIGNUP_POST, {
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

export const signupPOST =
  (scope: user_scope): ManagementRouteHandler =>
  async (ctx) => {
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
      await ctx.oidc.userManagement.search(ctx.FHIRContext, {
        email,
      })
    )[0];
    if (existingUser !== undefined) {
      await sendPasswordResetEmail(scope, ctx, existingUser);
    } else {
      const user = await ctx.oidc.userManagement.create(ctx.FHIRContext, {
        email,
      });

      // Alert system admin of new user.
      await sendAlertEmail(
        ctx.FHIRContext.emailProvider,
        "New User",
        `A new user with email '${user.email}' has signed up.`,
      );
      await sendPasswordResetEmail(scope, ctx, user);
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
