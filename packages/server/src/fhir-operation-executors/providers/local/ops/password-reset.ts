import React from "react";
import { renderToString } from "react-dom/server";
import * as db from "zapatos/db";

import { FHIRRequest } from "@iguhealth/client/types";
import { Membership } from "@iguhealth/fhir-types/lib/generated/r4/types";
import { R4 } from "@iguhealth/fhir-types/versions";
import { IguhealthPasswordReset } from "@iguhealth/generated-ops/r4";
import { TenantId } from "@iguhealth/jwt";
import { outcomeError, outcomeInfo } from "@iguhealth/operation-outcomes";

import * as codes from "../../../../authN/db/code/index.js";
import {
  EmailTemplate,
  EmailTemplateButton,
  EmailTemplateImage,
  EmailTemplateText,
} from "../../../../email/templates/base.js";
import { IGUHealthServerCTX } from "../../../../fhir-server/types.js";
import InlineOperation from "../interface.js";

function createPasswordResetCode(
  pg: db.Queryable,
  tenant: TenantId,
  member: Membership,
): Promise<codes.AuthorizationCode> {
  return codes.create(pg, tenant, {
    type: "password_reset",
    user_id: member.id as string,
    expires_in: "15 minutes",
    // include email to verify on the password reset that it aligns with the current user.
    // Scenario is a user requests password change
    // While in the user management they then change the email.
    // We now must verify the email associated with the code matches the user.
    meta: {
      email: member.email,
    },
  });
}

/**
 * Check if a password reset should be sent.
 * @param ctx Management Context.
 * @param user User to check if password reset should be sent.
 * @returns True if password reset should be sent. Based on no existing codes in the last 15 minutes.
 */
async function shouldSendPasswordReset(
  ctx: Omit<IGUHealthServerCTX, "user">,
  member: Membership,
): Promise<boolean> {
  // Prevent code creation if one already exists in the last 15 minutes.
  const existingCodes = await codes.search(ctx.store.getClient(), ctx.tenant, {
    user_id: member.id,
    type: "password_reset",
  });

  return existingCodes.length === 0;
}

async function sendPasswordResetEmail(
  ctx: Omit<IGUHealthServerCTX, "user">,
  membership: Membership,
  message: {
    subject: string;
    body: string;
    acceptText: string;
  },
) {
  if (!ctx.emailProvider) {
    ctx.logger.warn(
      "Email provider not set. Cannot send password reset email.",
    );
    return;
  }

  if (!(await shouldSendPasswordReset(ctx, membership))) {
    ctx.logger.warn(
      `Password reset already sent in the last 15 minutes. For user '${membership.id}' with email '${membership.email}'`,
    );
    return;
  }

  const code = await createPasswordResetCode(
    ctx.store.getClient(),
    ctx.tenant,
    membership,
  );

  const emailVerificationURL = new URL(
    `/w/${ctx.tenant}/oidc/interaction/password-reset-verify?code=${code.code}`,
    process.env.API_URL,
  ).toString();

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
          text: message.body,
        }),
        React.createElement(EmailTemplateButton, {
          title: message.acceptText,
          href: new URL(emailVerificationURL, process.env.API_URL).toString(),
        }),
      ],
    }),
  );

  await ctx.emailProvider.sendEmail({
    from: process.env.EMAIL_FROM as string,
    to: membership.email,
    subject: message.subject,
    html: emailHTML,
  });
}

export const IguhealthPasswordResetInvoke = InlineOperation(
  IguhealthPasswordReset.Op,
  async (ctx: IGUHealthServerCTX, request: FHIRRequest, input) => {
    if (request.level !== "instance") {
      return outcomeError(
        "invalid",
        "Operation must be invoked at the instance level.",
      );
    }

    if (request.resource !== "Membership") {
      return outcomeError(
        "invalid",
        "Operation must be invoked on Membership resources.",
      );
    }

    const membership = await ctx.store.readLatestResourceById(
      ctx,
      R4,
      request.id,
    );

    if (!membership || membership.resourceType !== "Membership") {
      return outcomeError("not-found", "User was not found");
    }

    await sendPasswordResetEmail(ctx, membership, input.email);

    return outcomeInfo("informational", "Password reset email sent.");
  },
);
