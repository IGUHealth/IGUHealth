import { dateTime, id } from "@iguhealth/fhir-types/r4/types";
import { IguhealthListScopes } from "@iguhealth/generated-ops/r4";

import * as scopes from "../../../../../authN/db/scopes/index.js";
import { IGUHealthServerCTX } from "../../../../../fhir-server/types.js";
import InlineOperation from "../../interface.js";

export const IguhealthListScopesInvoke = InlineOperation(
  IguhealthListScopes.Op,
  async (ctx: IGUHealthServerCTX) => {
    const approvedScopes = await scopes.getAllUserApprovedScopes(
      ctx.store.getClient(),
      ctx.tenant,
      ctx.user.payload.sub,
    );

    return {
      scopes: approvedScopes.map((scope) => ({
        client_id: scope.client_id as id,
        scopes: scope.scope,
        created_at: scope.created_at as dateTime,
      })),
    };
  },
);
