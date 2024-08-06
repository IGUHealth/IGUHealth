import * as db from "zapatos/db";
import * as s from "zapatos/schema";

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

export async function getAllUserApprovedScopes(
  pg: db.Queryable,
  tenant: TenantId,
  user_id: string,
): Promise<s.authorization_scopes.JSONSelectable[]> {
  return db
    .select("authorization_scopes", {
      tenant,
      user_id,
    })
    .run(pg);
}

export async function deleteUserScope(
  pg: db.Queryable,
  tenant: TenantId,
  client_id: id,
  user_id: string,
): Promise<s.authorization_scopes.JSONSelectable[]> {
  return db
    .deletes("authorization_scopes", {
      tenant,
      client_id,
      user_id,
    })
    .run(pg);
}
