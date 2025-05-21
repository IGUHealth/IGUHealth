import * as s from "zapatos/schema";

import { id } from "@iguhealth/fhir-types/r4/types";
import { TenantId } from "@iguhealth/jwt/types";

import { IGUHealthServerCTX, asRoot } from "../../../fhir-server/types.js";
import { Scope, parseScopes } from "../../oidc/scopes/parse.js";

export async function getApprovedScope(
  ctx: Omit<IGUHealthServerCTX, "tenant" | "user">,
  tenant: TenantId,
  client_id: id,
  user_id: string,
): Promise<Scope[]> {
  const approvedScopes = await ctx.store.auth.authorization_scope.where(
    await asRoot({ ...ctx, tenant }),
    tenant,
    {
      client_id,
      user_id,
    },
  );

  return parseScopes(approvedScopes[0]?.scope ?? "");
}

export async function getAllUserApprovedScopes(
  ctx: Omit<IGUHealthServerCTX, "tenant" | "user">,
  tenant: TenantId,
  user_id: string,
): Promise<s.authorization_scopes.JSONSelectable[]> {
  return ctx.store.auth.authorization_scope.where(
    await asRoot({ ...ctx, tenant }),
    tenant,
    {
      user_id,
    },
  );
}

export async function deleteUserScope(
  ctx: Omit<IGUHealthServerCTX, "tenant" | "user">,
  tenant: TenantId,
  client_id: id,
  user_id: string,
): Promise<void> {
  return ctx.store.auth.authorization_scope.delete(
    await asRoot({ ...ctx, tenant }),
    tenant,
    {
      client_id,
      user_id,
    },
  );
}
