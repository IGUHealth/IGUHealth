import Router from "@koa/router";
import React from "react";
import { renderToString } from "react-dom/server";

import {
  EmailTemplate,
  EmailTemplateButton,
  EmailTemplateImage,
  EmailTemplateText,
} from "../../../email/templates/base.js";
import { IGUHealthServerCTX } from "../../../fhir-api/types.js";
import * as codes from "../../db/code/index.js";
import type { User } from "../../db/users/index.js";
import { OIDC_ROUTES } from "../constants.js";

/**
 * Check if a password reset should be sent.
 * @param ctx Management Context.
 * @param user User to check if password reset should be sent.
 * @returns True if password reset should be sent. Based on no existing codes in the last 15 minutes.
 */
async function shouldSendPasswordReset(
  ctx: Omit<IGUHealthServerCTX, "user">,
  user: User,
): Promise<boolean> {
  // Prevent code creation if one already exists in the last 15 minutes.
  const existingCodes = await codes.search(ctx, ctx.tenant, {
    user_id: user.id,
    type: "password_reset",
  });

  return existingCodes.length === 0;
}

export async function sendPasswordResetEmail(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  router: Router<any, any>,
  ctx: Omit<IGUHealthServerCTX, "user">,
  user: User,
) {
  if (!ctx.emailProvider) {
    ctx.logger.warn(
      "Email provider not set. Cannot send password reset email.",
    );
    return;
  }

  if (!(await shouldSendPasswordReset(ctx, user))) {
    ctx.logger.warn(
      `Password reset already sent in the last 15 minutes. For user '${user.id}' with email '${user.email}'`,
    );
    return;
  }

  const code = await codes.create(ctx, ctx.tenant, {
    type: "password_reset",
    user_id: user.id,
    expires_in: "15 minutes",
  });

  const emailVerificationURL = router.url(
    OIDC_ROUTES.PASSWORD_RESET_VERIFY_GET,
    { tenant: ctx.tenant },
    { query: { code: code.code } },
  );

  if (typeof emailVerificationURL !== "string") throw emailVerificationURL;

  const emailHTML = renderToString(
    React.createElement(EmailTemplate, {
      children: [
        React.createElement(EmailTemplateImage, {
          alt: "IGUHealth Logo",
          width: "50px",
          url: new URL("/public/img/logo.png", process.env.API_URL).toString(),
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

  await ctx.emailProvider.sendEmail({
    from: process.env.EMAIL_FROM as string,
    to: user.email,
    subject: "IGUHealth Email Verification",
    html: emailHTML,
  });
}
