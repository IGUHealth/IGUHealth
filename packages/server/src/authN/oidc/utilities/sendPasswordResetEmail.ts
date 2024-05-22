import React from "react";
import { renderToString } from "react-dom/server";
import * as s from "zapatos/schema";

import {
  EmailTemplate,
  EmailTemplateButton,
  EmailTemplateImage,
  EmailTemplateText,
} from "../../../email/templates/base.js";
import { User } from "../../db/users/types.js";
import { OIDC_ROUTES } from "../constants.js";
import { ManagementRouteHandler } from "../index.js";

/**
 * Check if a password reset should be sent.
 * @param ctx Management Context.
 * @param user User to check if password reset should be sent.
 * @returns True if password reset should be sent. Based on no existing codes in the last 15 minutes.
 */
export async function shouldSendPasswordReset(
  ctx: Parameters<ManagementRouteHandler>[0],
  user: User,
): Promise<boolean> {
  // Prevent code creation if one already exists in the last 15 minutes.
  const existingCodes = await ctx.oidc.codeManagement.search(ctx.postgres, {
    user_id: user.id,
    type: "password_reset",
  });

  return existingCodes.length === 0;
}

export async function sendPasswordResetEmail(
  scope: s.user_scope,
  ctx: Parameters<ManagementRouteHandler>[0],
  user: User,
) {
  if (!(await shouldSendPasswordReset(ctx, user))) {
    console.warn(
      `Password reset already sent in the last 15 minutes. For user '${user.id}' with email '${user.email}'`,
    );
    return;
  }

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

  const emailHTML = renderToString(
    React.createElement(EmailTemplate, {
      children: [
        React.createElement(EmailTemplateImage, {
          alt: "IGUHealth Logo",
          url: `${process.env.API_URL}/public/img/logo.svg`,
        }),
        React.createElement(EmailTemplateText, {
          text: "To verify your email and set your password click below.",
        }),
        React.createElement(EmailTemplateButton, {
          title: "Reset Password",
          href: new URL(emailVerificationURL, process.env.API_URL).toString(),
        }),
      ],
    }),
  );

  await ctx.FHIRContext.emailProvider?.sendEmail({
    from: process.env.EMAIL_FROM as string,
    to: user.email,
    subject: "IGUHealth Email Verification",
    html: emailHTML,
  });
}
