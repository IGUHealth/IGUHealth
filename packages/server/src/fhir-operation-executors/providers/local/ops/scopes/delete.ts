import { IguhealthDeleteScope } from "@iguhealth/generated-ops/r4";
import { outcomeInfo } from "@iguhealth/operation-outcomes";

import * as scopes from "../../../../../authN/db/scopes/index.js";
import { IGUHealthServerCTX } from "../../../../../fhir-server/types.js";
import InlineOperation from "../../interface.js";

export const IguhealthDeleteScopeInvoke = InlineOperation(
  IguhealthDeleteScope.Op,
  async (ctx: IGUHealthServerCTX, _request, input) => {
    await scopes.deleteUserScope(
      ctx,
      ctx.tenant,
      input.client_id,
      ctx.user.payload.sub,
    );

    return outcomeInfo("informational", "Scopes deleted successfully.");
  },
);
