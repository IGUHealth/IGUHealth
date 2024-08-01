import { customAlphabet } from "nanoid";
import * as db from "zapatos/db";
import * as s from "zapatos/schema";

import { IGUHealthServerCTX } from "../../fhir-api/types.js";

// https://www.rfc-editor.org/rfc/rfc1035#section-2.3.3
// Do not allow uppercase characters.
const generateTenantId = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz");

export async function create(
  ctx: Omit<IGUHealthServerCTX, "tenant" | "user">,
  model: Partial<s.tenants.Insertable>,
): Promise<s.tenants.JSONSelectable> {
  const tenantId = typeof model.id === "string" ? model.id : generateTenantId();

  const tenant = await db
    .insert("tenants", {
      ...model,
      id: tenantId,
    })
    .run(ctx.db);

  return tenant;
}
