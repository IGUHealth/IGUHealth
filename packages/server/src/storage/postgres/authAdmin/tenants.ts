import { customAlphabet } from "nanoid";
import * as db from "zapatos/db";
import * as s from "zapatos/schema";

import { id } from "@iguhealth/fhir-types/lib/generated/r4/types";

import { ITenantAdmin } from "../../interfaces/authAdmin/authAdmin.js";

// https://www.rfc-editor.org/rfc/rfc1035#section-2.3.3
// Do not allow uppercase characters.
export const generateTenantId = customAlphabet(
  "1234567890abcdefghijklmnopqrstuvwxyz",
);

export class PostgresTenantAdmin<CTX> implements ITenantAdmin<CTX> {
  private readonly _pgClient: db.Queryable;

  constructor(pgClient: db.Queryable) {
    this._pgClient = pgClient;
  }

  async create(
    _ctx: CTX,
    data: Partial<s.tenants.Insertable>,
  ): Promise<s.tenants.JSONSelectable> {
    const tenantId = typeof data.id === "string" ? data.id : generateTenantId();

    const res = await db
      .insert("tenants", {
        ...data,
        id: tenantId,
      })
      .run(this._pgClient);

    return res;
  }

  async read(ctx: CTX, id: id): Promise<s.tenants.JSONSelectable | undefined> {
    const tenant = await db
      .selectOne("tenants", { id, deleted: false })
      .run(this._pgClient);

    return tenant;
  }

  delete(ctx: CTX, where: s.tenants.Whereable): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
