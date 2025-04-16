import { IguhealthDeleteRefreshToken } from "@iguhealth/generated-ops/r4";
import { outcomeInfo } from "@iguhealth/operation-outcomes";

import { IGUHealthServerCTX } from "../../../../../fhir-server/types.js";
import InlineOperation from "../../interface.js";

export const IguhealthDeleteRefreshTokenInvoke = InlineOperation(
  IguhealthDeleteRefreshToken.Op,
  async (ctx: IGUHealthServerCTX, _request, input) => {
    await ctx.store.auth.authorization_code.delete(ctx, ctx.tenant, {
      user_id: ctx.user.payload.sub,
      type: "refresh_token",
      id: input.id,
    });

    return outcomeInfo("informational", "Refresh token deleted.");
  },
);
