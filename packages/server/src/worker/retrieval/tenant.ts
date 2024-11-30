import * as db from "zapatos/db";
import * as s from "zapatos/schema";

import { TenantId } from "@iguhealth/jwt";

export async function getActiveTenants(
  pool: db.Queryable,
): Promise<TenantId[]> {
  const tenants = await db.sql<s.tenants.SQL, s.tenants.Selectable[]>`
      SELECT ${"id"} from ${"tenants"} where ${{ deleted: false }}
    `.run(pool);

  return tenants.map((w) => w.id as TenantId);
}
