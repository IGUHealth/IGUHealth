import React from "react";

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
import { FHIRServerCTX } from "../../../fhir-api/types.js";
import { renderString } from "../../../views/index.js";
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
    const user = await userManagement.search(ctx.db, {
      fhir_user_id: membership.id,
    });
    if (!user[0]) {
      throw new OperationError(outcomeError("not-found", "User not found"));
    }
    const code = await codeManagement.create(ctx.db, {
      type: "password_reset",
      user_id: user[0].id,
      expires_in: "15 minutes",
    });
    const element = React.createElement("div", {
      children: [
        `You've been invited to join IGUHealth tenant '${ctx.tenant}'. Click `,
        React.createElement("a", {
          href: new URL(
            `/w/${ctx.tenant}/oidc/interaction/password-reset-verify?code=${code.code}`,
            process.env.API_URL,
          ),
          clicktracking: "off",
          children: "here",
        }),
        " to set your password. Disregard this email if you did not request this.",
      ],
    });

    const emailHTML = renderString(element);
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
