import React from "react";
import { user_scope } from "zapatos/schema";

import { EmailForm, Feedback } from "@iguhealth/components";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import * as views from "../../../../views/index.js";
import { OIDC_ROUTES } from "../../constants.js";
import type { ManagementRouteHandler } from "../../index.js";
import { sendPasswordResetEmail } from "../../utilities/sendPasswordResetEmail.js";

export const signupGET =
  (scope: user_scope): ManagementRouteHandler =>
  async (ctx) => {
    const signupURL = ctx.router.url(OIDC_ROUTES(scope).SIGNUP_POST, {
      tenant: ctx.oidc.tenant,
    });
    if (typeof signupURL !== "string") throw signupURL;

    views.renderPipe(
      ctx,
      React.createElement(EmailForm, {
        logo: "/public/img/logo.svg",
        header: "Signup",
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
    try {
      const user = await ctx.oidc.userManagement.create(ctx.postgres, {
        email,
      });

      await sendPasswordResetEmail(scope, ctx, user);
      views.renderPipe(
        ctx,
        React.createElement(Feedback, {
          logo: "/public/img/logo.svg",
          title: "IGUHealth",
          header: "Email Verification",
          content:
            "We have sent an email to your email address. Please verify your email address to login.",
        }),
      );
    } catch (e) {
      const user = await ctx.oidc.userManagement.search(ctx.postgres, {
        email,
      });
      if (user.length === 1) {
        await sendPasswordResetEmail(scope, ctx, user[0]);
      }
      views.renderPipe(
        ctx,
        React.createElement(Feedback, {
          logo: "/public/img/logo.svg",
          title: "IGUHealth",
          header: "Email Verification",
          content:
            "We have sent an email to your email address. Please verify your email address to login.",
        }),
      );
    }
  };
