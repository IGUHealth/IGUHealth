import { customAlphabet } from "nanoid";
import * as db from "zapatos/db";
import * as s from "zapatos/schema";

import { TenantId } from "@iguhealth/jwt";

import { IGUHealthServerCTX } from "../../fhir-server/types.js";

// https://www.rfc-editor.org/rfc/rfc1035#section-2.3.3
// Do not allow uppercase characters.
const generateTenantId = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz");

export async function create(
  ctx: Omit<IGUHealthServerCTX, "tenant" | "user">,
  model: Partial<s.tenants.Insertable>,
): Promise<s.tenants.Insertable> {
  const tenantId = typeof model.id === "string" ? model.id : generateTenantId();

  return {
    ...model,
    id: tenantId,
  };
}

export async function getTenant(
  pg: db.Queryable,
  tenantId: TenantId,
): Promise<db.JSONOnlyColsForTable<"tenants", "id"[]> | undefined> {
  const tenant = await db
    .selectOne("tenants", { id: tenantId, deleted: false }, { columns: ["id"] })
    .run(pg);

  return tenant;
}

export async function getActiveTenants(
  pool: db.Queryable,
): Promise<TenantId[]> {
  const tenants = await db.sql<s.tenants.SQL, s.tenants.Selectable[]>`
      SELECT ${"id"} from ${"tenants"} where ${{ deleted: false }}
    `.run(pool);

  return tenants.map((w) => w.id as TenantId);
}
