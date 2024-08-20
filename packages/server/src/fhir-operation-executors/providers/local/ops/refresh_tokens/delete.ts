import { IguhealthDeleteRefreshToken } from "@iguhealth/generated-ops/r4";
import { outcomeInfo } from "@iguhealth/operation-outcomes";

import * as codes from "../../../../../authN/db/code/index.js";
import { IGUHealthServerCTX } from "../../../../../fhir-api/types.js";
import InlineOperation from "../../interface.js";

export const IguhealthDeleteRefreshTokenInvoke = InlineOperation(
  IguhealthDeleteRefreshToken.Op,
  async (ctx: IGUHealthServerCTX, _request, input) => {
    await codes.remove(ctx.db, ctx.tenant, {
      user_id: ctx.user.payload.sub,
      type: "refresh_token",
      code: input.refresh_token,
    });

    return outcomeInfo("informational", "Refresh token deleted.");
  },
);
