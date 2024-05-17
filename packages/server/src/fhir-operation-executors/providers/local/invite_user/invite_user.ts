import { FHIRRequest } from "@iguhealth/client/types";
import { code } from "@iguhealth/fhir-types/r4/types";
import { R4 } from "@iguhealth/fhir-types/versions";
import { IguhealthInviteUser } from "@iguhealth/generated-ops/r4";
import {
  OperationError,
  outcomeError,
  outcomeInfo,
} from "@iguhealth/operation-outcomes";

import { FHIRServerCTX } from "../../../../fhir-api/types.js";
import InlineOperation from "../interface.js";



const IguhealthInviteUserInvoke = InlineOperation(
  IguhealthInviteUser.Op,
  async (ctx: FHIRServerCTX, request: FHIRRequest, input) => {
    if (!ctx.emailProvider)
      throw new OperationError(
        outcomeError("exception", "Encryption provider not configured"),
      );

    await ctx.client.create(ctx, R4, {
      resourceType: "Membership",
      email: input.email,
      role: "member" as code,
    });

    const response = await ctx.emailProvider?.sendEmail({
      to: input.email,
      from: process.env.EMAIL_FROM as string,
      subject: "SIGNUP",
      text: "SIGNUP",
    });

    return outcomeInfo(
      "value",
      "User has been invited successfully. User should check their email for details of the invite.",
    );
  },
);

export default IguhealthInviteUserInvoke;
