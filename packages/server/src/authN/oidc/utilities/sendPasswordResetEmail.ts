import React from "react";
import * as s from "zapatos/schema";

import * as views from "../../../views/index.js";
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

  const emailHTML = views.renderString(
    React.createElement("div", {
      children: [
        "To verify your email and set your password click ",
        React.createElement("a", {
          href: new URL(emailVerificationURL, process.env.API_URL),
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
