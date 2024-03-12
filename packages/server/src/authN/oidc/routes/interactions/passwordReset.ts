import React from "react";
import * as db from "zapatos/db";
import { user_scope } from "zapatos/schema";

import { EmailForm, Feedback, PasswordResetForm } from "@iguhealth/components";
import {
  OperationError,
  outcomeError,
  outcomeFatal,
} from "@iguhealth/operation-outcomes";

import * as views from "../../../../views/index.js";
import { OIDC_ROUTES } from "../../constants.js";
import type { ManagementRouteHandler } from "../../index.js";
import { validateEmail } from "../../utilities.js";

export function passwordResetGET(scope: user_scope): ManagementRouteHandler {
  return async (ctx) => {
    const queryCode = ctx.request.query.code;
    if (typeof queryCode !== "string") {
      throw new OperationError(outcomeError("invalid", "Code not found."));
    }

    const authorizationCodeSearch = await ctx.oidc.codeManagement.search(
      ctx.postgres,
      {
        type: "password_reset",
        code: queryCode,
      },
    );

    if (
      authorizationCodeSearch.length !== 1 ||
      authorizationCodeSearch[0].is_expired
    ) {
      throw new OperationError(
        outcomeError(
          "invalid",
          "Your code has expired. Please request a new one.",
        ),
      );
    }

    const passwordResetPostUrl = ctx.router.url(
      OIDC_ROUTES(scope).PASSWORD_RESET_VERIFY_POST,
      { tenant: ctx.oidc.tenant },
    );
    if (passwordResetPostUrl instanceof Error) throw passwordResetPostUrl;

    views.renderPipe(
      ctx,
      React.createElement(PasswordResetForm, {
        logo: "/public/img/logo.svg",
        title: "IGUHealth",
        header: "Reset Password",
        action: passwordResetPostUrl,
        code: authorizationCodeSearch[0].code,
      }),
    );
  };
}

export function passwordResetPOST(scope: user_scope): ManagementRouteHandler {
  return async (ctx) => {
    const body = ctx.request.body as
      | { code?: string; password?: string; passwordConfirm?: string }
      | undefined;

    if (!body?.code) {
      throw new OperationError(outcomeError("invalid", "Code not found."));
    }
    const passwordResetPostUrl = ctx.router.url(
      OIDC_ROUTES(scope).PASSWORD_RESET_VERIFY_POST,
      { tenant: ctx.oidc.tenant },
    );
    if (passwordResetPostUrl instanceof Error) throw passwordResetPostUrl;

    if (!body?.password) {
      views.renderPipe(
        ctx,
        React.createElement(PasswordResetForm, {
          logo: "/public/img/logo.svg",
          title: "IGUHealth",
          header: "Reset Password",
          action: passwordResetPostUrl,
          code: body.code,
          error: outcomeError("invalid", "You must enter a password"),
        }),
      );
      return;
    }

    if (body?.password !== body?.passwordConfirm) {
      views.renderPipe(
        ctx,
        React.createElement(PasswordResetForm, {
          logo: "/public/img/logo.svg",
          title: "IGUHealth",
          header: "Reset Password",
          action: passwordResetPostUrl,
          code: body.code,
          error: outcomeError(
            "invalid",
            "Passwords do not match. Please re-enter and try again.",
          ),
        }),
      );
      return;
    }

    const res = await ctx.oidc.codeManagement.search(ctx.postgres, {
      type: "password_reset",
      code: body.code,
    });

    if (res.length !== 1) {
      throw new OperationError(outcomeError("invalid", "Code not found."));
    }

    const authorizationCode = res[0];

    if (!authorizationCode || authorizationCode.is_expired) {
      throw new OperationError(
        outcomeError(
          "invalid",
          "Your code has expired. Please request a new one.",
        ),
      );
    }

    db.serializable(ctx.postgres, async (txnClient) => {
      await ctx.oidc.userManagement.update(
        txnClient,
        authorizationCode.user_id,
        {
          password: body.password,
          email_verified: true,
        },
      );
      await ctx.oidc.codeManagement.delete(txnClient, { code: body.code });
    });

    views.renderPipe(
      ctx,
      React.createElement(Feedback, {
        logo: "/public/img/logo.svg",
        title: "IGUHealth",
        header: "Password Reset",
        content: "Your password has been set.",
      }),
    );
  };
}

export const passwordResetInitiateGet =
  (scope: user_scope): ManagementRouteHandler =>
  async (ctx) => {
    const passwordResetInitiatePostURL = ctx.router.url(
      OIDC_ROUTES(scope).PASSWORD_RESET_INITIATE_POST,
      { tenant: ctx.oidc.tenant },
    );
    if (typeof passwordResetInitiatePostURL !== "string")
      throw passwordResetInitiatePostURL;

    views.renderPipe(
      ctx,
      React.createElement(EmailForm, {
        logo: "/public/img/logo.svg",
        header: "Password Reset",
        action: passwordResetInitiatePostURL,
      }),
    );
  };

/**
 * Initiates password reset process by sending an email to the user with a link to reset their password.
 * @param ctx Koa fhir context
 */
export function passwordResetInitiatePOST(
  scope: user_scope,
): ManagementRouteHandler {
  return async (ctx) => {
    const body = ctx.request.body as
      | { email?: string; password?: string }
      | undefined;

    if (!ctx.emailProvider)
      throw new OperationError(
        outcomeFatal(
          "not-supported",
          "Email verification is not supported on this instance.",
        ),
      );

    if (!validateEmail(body?.email)) {
      throw new OperationError(
        outcomeError("invalid", "Must have a valid email address."),
      );
    }

    const usersWithEmail = await ctx.oidc.userManagement.search(ctx.postgres, {
      email: body.email,
    });
    if (usersWithEmail.length > 1) {
      throw new OperationError(
        outcomeError("invalid", "Multiple users found with the same email."),
      );
    }

    let user = usersWithEmail[0];
    // TODO Should user be created?
    if (!user) {
      user = await ctx.oidc.userManagement.create(ctx.postgres, {
        email: body.email,
      });
    }

    if (!process.env.EMAIL_FROM) {
      throw new OperationError(
        outcomeFatal(
          "invariant",
          "EMAIL_FROM environment variable is not set.",
        ),
      );
    }

    if (
      (
        await ctx.oidc.codeManagement.search(ctx.postgres, {
          user_id: user.id,
          type: "password_reset",
        })
      ).length === 0
    ) {
      const code = await ctx.oidc.codeManagement.create(ctx.postgres, {
        type: "password_reset",
        user_id: user.id,
        expires_in: "15 minutes",
      });

      const emailVerificationURL = ctx.router.url(
        OIDC_ROUTES(scope).PASSWORD_RESET_VERIFY_GET,
        { tenant: ctx.oidc.tenant },
        { query: { code: code.code } },
      );
      if (typeof emailVerificationURL !== "string") throw emailVerificationURL;

      const emailHTML = views.renderString(
        React.createElement("div", {
          children: [
            "To verify your email and set your password click ",
            React.createElement("a", {
              href: `${process.env.API_URL}${emailVerificationURL}`,
              clicktracking: "off",
              children: "  Here ",
            }),
          ],
        }),
      );

      await ctx.emailProvider.sendEmail({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: "IGUHealth Email Verification",
        html: emailHTML,
      });
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
  };
}
