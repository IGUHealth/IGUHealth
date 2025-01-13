import { IguhealthDeleteRefreshToken } from "@iguhealth/generated-ops/r4";
import { outcomeInfo } from "@iguhealth/operation-outcomes";

import * as codes from "../../../../../authN/db/code/index.js";
import { IGUHealthServerCTX } from "../../../../../fhir-server/types.js";
import InlineOperation from "../../interface.js";

export const IguhealthDeleteRefreshTokenInvoke = InlineOperation(
  IguhealthDeleteRefreshToken.Op,
  async (ctx: IGUHealthServerCTX, _request, input) => {
    await codes.remove(ctx.store.getClient(), ctx.tenant, {
      user_id: ctx.user.payload.sub,
      type: "refresh_token",
      id: input.id,
    });

    return outcomeInfo("informational", "Refresh token deleted.");
  },
);
