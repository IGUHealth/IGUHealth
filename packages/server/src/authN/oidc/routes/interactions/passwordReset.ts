import React from "react";
import validator from "validator";
import * as db from "zapatos/db";

import { EmailForm, Feedback, PasswordResetForm } from "@iguhealth/components";
import { OperationOutcome, id } from "@iguhealth/fhir-types/r4/types";
import { R4 } from "@iguhealth/fhir-types/versions";
import { TenantId } from "@iguhealth/jwt";
import {
  OperationError,
  outcomeError,
  outcomeFatal,
} from "@iguhealth/operation-outcomes";

import { asSystemCTX } from "../../../../fhir-api/types.js";
import { FHIRTransaction } from "../../../../fhir-storage/transactions.js";
import * as views from "../../../../views/index.js";
import { userToMembership } from "../../../db/users/utilities.js";
import { OIDC_ROUTES } from "../../constants.js";
import type { OIDCRouteHandler } from "../../index.js";
import { sendPasswordResetEmail } from "../../utilities/sendPasswordResetEmail.js";

function validatePasswordStrength(
  password: string,
): OperationOutcome | undefined {
  if (password.length < 8) {
    return outcomeError(
      "invalid",
      "Password must be at least 8 characters long.",
    );
  }
  return undefined;
}

export function passwordResetGET(): OIDCRouteHandler {
  return async (ctx) => {
    const queryCode = ctx.request.query.code;
    if (typeof queryCode !== "string") {
      throw new OperationError(outcomeError("invalid", "Code not found."));
    }

    const authorizationCodeSearch = await ctx.oidc.codeManagement.search(
      ctx.FHIRContext,
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
      OIDC_ROUTES.PASSWORD_RESET_VERIFY_POST,
      { tenant: ctx.oidc.tenant },
    );
    if (passwordResetPostUrl instanceof Error) throw passwordResetPostUrl;

    ctx.status = 200;
    ctx.body = views.renderString(
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

export function passwordResetPOST(): OIDCRouteHandler {
  return async (ctx) => {
    const body = ctx.request.body as
      | { code?: string; password?: string; passwordConfirm?: string }
      | undefined;

    if (!body?.code) {
      throw new OperationError(outcomeError("invalid", "Code not found."));
    }
    const passwordResetPostUrl = ctx.router.url(
      OIDC_ROUTES.PASSWORD_RESET_VERIFY_POST,
      { tenant: ctx.oidc.tenant },
    );
    if (passwordResetPostUrl instanceof Error) throw passwordResetPostUrl;

    if (!body?.password) {
      ctx.status = 200;
      ctx.body = views.renderString(
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
      ctx.status = 200;
      ctx.body = views.renderString(
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

    const passwordValidStrength = validatePasswordStrength(body.password);
    if (passwordValidStrength) {
      ctx.status = 200;
      ctx.body = views.renderString(
        React.createElement(PasswordResetForm, {
          logo: "/public/img/logo.svg",
          title: "IGUHealth",
          header: "Reset Password",
          action: passwordResetPostUrl,
          code: body.code,
          error: passwordValidStrength,
        }),
      );
      return;
    }

    const res = await ctx.oidc.codeManagement.search(ctx.FHIRContext, {
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

    await FHIRTransaction(
      ctx.FHIRContext,
      db.IsolationLevel.Serializable,
      async (fhirContext) => {
        const update = await ctx.oidc.userManagement.update(
          fhirContext,
          authorizationCode.user_id,
          {
            password: body.password,
            email_verified: true,
          },
        );

        await ctx.FHIRContext.client.update(
          asSystemCTX({
            ...fhirContext,
            tenant: update.tenant as TenantId,
          }),
          R4,
          "Membership",
          update.fhir_user_id as id,
          userToMembership(update),
        );

        await ctx.oidc.codeManagement.delete(fhirContext, { code: body.code });
      },
    );

    const loginRoute = ctx.router.url(
      OIDC_ROUTES.LOGIN_GET,
      {
        tenant: ctx.oidc.tenant,
      },
      { query: { message: "Password reset. Please login." } },
    );

    if (loginRoute instanceof Error) throw loginRoute;
    ctx.redirect(loginRoute);
  };
}

export const passwordResetInitiateGet = (): OIDCRouteHandler => async (ctx) => {
  const passwordResetInitiatePostURL = ctx.router.url(
    OIDC_ROUTES.PASSWORD_RESET_INITIATE_POST,
    { tenant: ctx.oidc.tenant },
  );
  if (typeof passwordResetInitiatePostURL !== "string")
    throw passwordResetInitiatePostURL;

  ctx.status = 200;
  ctx.body = views.renderString(
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
export function passwordResetInitiatePOST(): OIDCRouteHandler {
  return async (ctx) => {
    const body = ctx.request.body as
      | { email?: string; password?: string }
      | undefined;

    if (!ctx.FHIRContext.emailProvider)
      throw new OperationError(
        outcomeFatal(
          "not-supported",
          "Email verification is not supported on this instance.",
        ),
      );

    const email = body?.email ?? "";

    if (!validator.isEmail(email)) {
      throw new OperationError(
        outcomeError("invalid", "Must have a valid email address."),
      );
    }

    const usersWithEmail = await ctx.oidc.userManagement.search(
      ctx.FHIRContext,
      {
        email: email,
      },
    );

    if (usersWithEmail.length > 1) {
      throw new OperationError(
        outcomeError("invalid", "Multiple users found with the same email."),
      );
    }

    const user = usersWithEmail[0];
    // Pretend email sent to avoid phishing for email addresses.
    if (!user) {
      ctx.FHIRContext.logger.warn(
        `not sending password reset for non existing user: '${email}' `,
      );
      ctx.status = 200;
      ctx.body = views.renderString(
        React.createElement(Feedback, {
          logo: "/public/img/logo.svg",
          title: "IGUHealth",
          header: "Email Verification",
          content:
            "An email will arrive in the next few minutes with the next steps to reset your password.",
        }),
      );
      return;
    }

    if (!process.env.EMAIL_FROM) {
      throw new OperationError(
        outcomeFatal(
          "invariant",
          "EMAIL_FROM environment variable is not set.",
        ),
      );
    }

    await sendPasswordResetEmail(
      ctx.router,
      { ...ctx.FHIRContext, tenant: ctx.oidc.tenant },
      ctx.oidc.codeManagement,
      user,
    );

    ctx.status = 200;
    ctx.body = views.renderString(
      React.createElement(Feedback, {
        logo: "/public/img/logo.svg",
        title: "IGUHealth",
        header: "Email Verification",
        content:
          "An email will arrive in the next few minutes with the next steps to reset your password.",
      }),
    );
  };
}
