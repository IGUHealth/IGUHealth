import { FHIRRequest } from "@iguhealth/client/types";
import { Membership, Parameters, id } from "@iguhealth/fhir-types/r4/types";
import { R4 } from "@iguhealth/fhir-types/versions";
import {
  IguhealthInviteUser,
  IguhealthPasswordReset,
} from "@iguhealth/generated-ops/r4";
import {
  OperationError,
  outcomeError,
  outcomeInfo,
} from "@iguhealth/operation-outcomes";

import { sendPasswordResetEmail } from "../../../../authN/sendPasswordReset.js";
import { IGUHealthServerCTX } from "../../../../fhir-server/types.js";
import { QueueBatch } from "../../../../storage/transactions.js";
import { OPERATIONS_QUEUE } from "../../../../worker/kafka/constants.js";
import InlineOperation from "../interface.js";

export const IguhealthInviteUserInvoke = InlineOperation(
  IguhealthInviteUser.Op,
  async (ctx: IGUHealthServerCTX, request: FHIRRequest, input) => {
    if (!ctx.emailProvider)
      throw new OperationError(
        outcomeError("exception", "Encryption provider not configured"),
      );

    await QueueBatch(ctx, async (ctx) => {
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
          "AccessPolicyV2",
          accessPolicyId as id,
        );

        if (accessPolicy) {
          await ctx.client.update(
            ctx,
            R4,
            "AccessPolicyV2",
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

      await sendPasswordResetEmail(ctx, membership, {
        email: {
          subject: "IGUHealth Email Verification",
          body: `You've been invited to join IGUHealth tenant '${ctx.tenant}'. Click below if you'd like to accept the invite.`,
          acceptText: "Accept Invite",
        },
      });
    });

    return outcomeInfo(
      "value",
      "User has been invited successfully. User should check their email for details of the invite.",
    );
  },
);
