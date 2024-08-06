import { dateTime, id } from "@iguhealth/fhir-types/r4/types";
import { IguhealthListScopes } from "@iguhealth/generated-ops/r4";

import * as scopes from "../../../../authN/db/scopes/index.js";
import { IGUHealthServerCTX } from "../../../../fhir-api/types.js";
import InlineOperation from "../interface.js";

const IguhealthEncryptInvoke = InlineOperation(
  IguhealthListScopes.Op,
  async (ctx: IGUHealthServerCTX) => {
    const approvedScopes = await scopes.getAllUserApprovedScopes(
      ctx.db,
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

export default IguhealthEncryptInvoke;
