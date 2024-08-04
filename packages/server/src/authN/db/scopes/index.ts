import * as db from "zapatos/db";

import { id } from "@iguhealth/fhir-types/r4/types";
import { TenantId } from "@iguhealth/jwt";

import { Scope, parseScopes } from "../../oidc/scopes/parse.js";

export async function getApprovedScope(
  pg: db.Queryable,
  tenant: TenantId,
  client_id: id,
  user_id: string,
): Promise<Scope[]> {
  const approvedScopes = await db
    .selectOne("authorization_scopes", {
      tenant: tenant,
      client_id: client_id,
      user_id,
    })
    .run(pg);

  return parseScopes(approvedScopes?.scope ?? "");
}
