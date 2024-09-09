import React from "react";
import { renderToString } from "react-dom/server";
import * as db from "zapatos/db";

import { FHIRRequest } from "@iguhealth/client/types";
import { Membership, id } from "@iguhealth/fhir-types/r4/types";
import { R4 } from "@iguhealth/fhir-types/versions";
import { IguhealthInviteUser } from "@iguhealth/generated-ops/r4";
import {
  OperationError,
  outcomeError,
  outcomeInfo,
} from "@iguhealth/operation-outcomes";

import * as codes from "../../../../authN/db/code/index.js";
import * as users from "../../../../authN/db/users/index.js";
import { createPasswordResetCode } from "../../../../authN/oidc/utilities/createPasswordResetCode.js";
import {
  EmailTemplate,
  EmailTemplateButton,
  EmailTemplateImage,
  EmailTemplateText,
} from "../../../../email/templates/base.js";
import { IGUHealthServerCTX } from "../../../../fhir-api/types.js";
import { FHIRTransaction } from "../../../../fhir-storage/transactions.js";
import InlineOperation from "../interface.js";

export const IguhealthInviteUserInvoke = InlineOperation(
  IguhealthInviteUser.Op,
  async (ctx: IGUHealthServerCTX, request: FHIRRequest, input) => {
    if (!ctx.emailProvider)
      throw new OperationError(
        outcomeError("exception", "Encryption provider not configured"),
      );

    const [user, inviteCode] = await FHIRTransaction(
      ctx,
      db.IsolationLevel.Serializable,
      async (ctx) => {
        const membership = await ctx.client.create(ctx, R4, {
          resourceType: "Membership",
          email: input.email,
          role: input.role,
        } as Membership);

        const accessPolicyId = input.accessPolicy?.reference?.split("/")[1];
        if (accessPolicyId) {
          const accessPolicy = await ctx.client.read(
            ctx,
            R4,
            "AccessPolicy",
            accessPolicyId as id,
          );

          if (accessPolicy) {
            await ctx.client.update(
              ctx,
              R4,
              "AccessPolicy",
              accessPolicy.id as id,
              {
                ...accessPolicy,
                target: [
                  ...(accessPolicy.target || []),
                  {
                    link: {
                      reference: `${membership.resourceType}/${membership.id}`,
                    },
                  },
                ],
              },
            );
          }
        }

        const user = await users.search(ctx.db, ctx.tenant, {
          fhir_user_id: membership.id,
        });

        if (!user[0]) {
          throw new OperationError(outcomeError("not-found", "User not found"));
        }

        const code = await createPasswordResetCode(ctx.db, ctx.tenant, user[0]);
        return [user, code];
      },
    );

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
              `/w/${ctx.tenant}/oidc/interaction/password-reset-verify?code=${inviteCode.code}`,
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
