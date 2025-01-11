import { dateTime, id } from "@iguhealth/fhir-types/r4/types";
import { IguhealthListRefreshTokens } from "@iguhealth/generated-ops/r4";

import * as codes from "../../../../../authN/db/code/index.js";
import { IGUHealthServerCTX } from "../../../../../fhir-api/types.js";
import InlineOperation from "../../interface.js";

export const IguhealthListRefreshTokensInvoke = InlineOperation(
  IguhealthListRefreshTokens.Op,
  async (ctx: IGUHealthServerCTX) => {
    const refreshTokens = await codes.search(
      ctx.store.getClient(),
      ctx.tenant,
      {
        user_id: ctx.user.payload.sub,
        type: "refresh_token",
      },
    );

    return {
      "refresh-tokens": refreshTokens.map((refreshToken) => ({
        id: refreshToken.id as id,
        client_id: refreshToken.client_id as id,
        created_at: refreshToken.created_at as dateTime,
      })),
    };
  },
);
