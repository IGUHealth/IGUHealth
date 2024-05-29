import React from "react";
import { renderToString } from "react-dom/server";

import { FHIRRequest } from "@iguhealth/client/types";
import { Membership, code } from "@iguhealth/fhir-types/r4/types";
import { R4 } from "@iguhealth/fhir-types/versions";
import { IguhealthInviteUser } from "@iguhealth/generated-ops/r4";
import {
  OperationError,
  outcomeError,
  outcomeInfo,
} from "@iguhealth/operation-outcomes";

import TenantAuthorizationCodeManagement from "../../../authN/db/code/provider/tenant.js";
import TenantUserManagement from "../../../authN/db/users/provider/tenant.js";
import {
  EmailTemplate,
  EmailTemplateButton,
  EmailTemplateImage,
  EmailTemplateText,
} from "../../../email/templates/base.js";
import { FHIRServerCTX } from "../../../fhir-api/types.js";
import InlineOperation from "./interface.js";

const IguhealthInviteUserInvoke = InlineOperation(
  IguhealthInviteUser.Op,
  async (ctx: FHIRServerCTX, request: FHIRRequest, input) => {
    if (!ctx.emailProvider)
      throw new OperationError(
        outcomeError("exception", "Encryption provider not configured"),
      );
    const membership = await ctx.client.create(ctx, R4, {
      resourceType: "Membership",
      email: input.email,
      role: "member" as code,
    } as Membership);
    const codeManagement = new TenantAuthorizationCodeManagement(ctx.tenant);
    const userManagement = new TenantUserManagement(ctx.tenant);
    const user = await userManagement.search(ctx, {
      fhir_user_id: membership.id,
    });
    if (!user[0]) {
      throw new OperationError(outcomeError("not-found", "User not found"));
    }
    const code = await codeManagement.create(ctx, {
      type: "password_reset",
      user_id: user[0].id,
      expires_in: "15 minutes",
    });

    const emailHTML = renderToString(
      React.createElement(EmailTemplate, {
        children: [
          React.createElement(EmailTemplateImage, {
            alt: "IGUHealth Logo",
            width: "50px",
            url: new URL(
              "/public/img/logo.png",
              process.env.API_URL,
            ).toString(),
          }),
          React.createElement(EmailTemplateText, {
            text: `You've been invited to join IGUHealth tenant '${ctx.tenant}'. Click below if you'd like to accept the invite.`,
          }),
          React.createElement(EmailTemplateButton, {
            title: "Accept Invite",
            href: new URL(
              `/w/${ctx.tenant}/oidc/interaction/password-reset-verify?code=${code.code}`,
              process.env.API_URL,
            ).toString(),
          }),
        ],
      }),
    );

    await ctx.emailProvider?.sendEmail({
      from: process.env.EMAIL_FROM as string,
      to: user[0].email,
      subject: "IGUHealth Email Verification",
      html: emailHTML,
    });

    return outcomeInfo(
      "value",
      "User has been invited successfully. User should check their email for details of the invite.",
    );
  },
);

export default IguhealthInviteUserInvoke;
