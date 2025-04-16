import * as db from "zapatos/db";
import { authorization_scopes } from "zapatos/schema";

import { id } from "@iguhealth/fhir-types/lib/generated/r4/types";
import { TenantId } from "@iguhealth/jwt";

import { ITenantAuthModel } from "../../interfaces/authAdmin/authAdmin.js";

export class PostgresAuthorizationScopeAdmin<CTX>
  implements ITenantAuthModel<CTX, "authorization_scopes">
{
  private readonly _pgClient: db.Queryable;

  constructor(pgClient: db.Queryable) {
    this._pgClient = pgClient;
  }

  async create(
    ctx: CTX,
    tenant: TenantId,
    data: authorization_scopes.Insertable,
  ): Promise<authorization_scopes.JSONSelectable> {
    const scope = await db
      .upsert(
        "authorization_scopes",
        [{ ...data, tenant }],
        db.constraint("authorization_scopes_pkey"),
        {
          updateColumns: ["scope"],
        },
      )
      .run(this._pgClient);
    return scope[0];
  }

  read(
    ctx: CTX,
    tenant: TenantId,
    id: id,
  ): Promise<authorization_scopes.JSONSelectable | undefined> {
    throw new Error("Method not implemented.");
  }

  update(
    ctx: CTX,
    tenant: TenantId,
    id: id,
    data: authorization_scopes.Updatable,
  ): Promise<authorization_scopes.JSONSelectable> {
    throw new Error("Method not implemented.");
  }

  async delete(
    ctx: CTX,
    tenant: TenantId,
    where: authorization_scopes.Whereable,
  ): Promise<void> {
    await db
      .deletes("authorization_scopes", {
        ...where,
        tenant,
      })
      .run(this._pgClient);
  }

  where(
    ctx: CTX,
    tenant: TenantId,
    where: authorization_scopes.Whereable,
  ): Promise<authorization_scopes.JSONSelectable[]> {
    return db
      .select("authorization_scopes", {
        ...where,
        tenant,
      })
      .run(this._pgClient);
  }
}
