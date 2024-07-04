import { customAlphabet } from "nanoid";
import * as db from "zapatos/db";
import * as s from "zapatos/schema";

import { IGUHealthServerCTX } from "../../fhir-api/types.js";
import { ModelManagement } from "./interface.js";

// https://www.rfc-editor.org/rfc/rfc1035#section-2.3.3
// Do not allow uppercase characters.
const generateTenantId = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz");

export class TenantManagement
  implements
    ModelManagement<
      s.tenants.JSONSelectable,
      s.tenants.Whereable,
      Partial<s.tenants.Insertable>,
      s.tenants.Updatable
    >
{
  get(
    ctx: Omit<IGUHealthServerCTX, "tenant" | "user">,
    id: string,
  ): Promise<s.tenants.JSONSelectable | undefined> {
    throw new Error("Method not implemented.");
  }
  search(
    ctx: Omit<IGUHealthServerCTX, "tenant" | "user">,
    where: s.tenants.Whereable,
  ): Promise<s.tenants.JSONSelectable[]> {
    throw new Error("Method not implemented.");
  }
  async create(
    ctx: Omit<IGUHealthServerCTX, "tenant" | "user">,
    model: Partial<s.tenants.Insertable>,
  ): Promise<s.tenants.JSONSelectable> {
    const tenantId =
      typeof model.id === "string" ? model.id : generateTenantId();

    const tenant = await db
      .insert("tenants", {
        ...model,
        id: tenantId,
      })
      .run(ctx.db);

    return tenant;
  }
  update(
    ctx: Omit<IGUHealthServerCTX, "tenant" | "user">,
    id: string,
    update: s.tenants.Updatable,
  ): Promise<s.tenants.JSONSelectable> {
    throw new Error("Method not implemented.");
  }
  delete(
    ctx: Omit<IGUHealthServerCTX, "tenant" | "user">,
    where: s.tenants.Whereable,
  ): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
