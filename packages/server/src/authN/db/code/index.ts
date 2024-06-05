import { randomBytes } from "node:crypto";
import * as db from "zapatos/db";
import * as s from "zapatos/schema";

import { TenantId } from "@iguhealth/jwt";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { KoaContext } from "../../../fhir-api/types.js";
import { AuthorizationCodeManagement } from "./interface.js";
import { AuthorizationCode } from "./types.js";
import { is_expired, is_not_expired } from "./utilities.js";

export default class TenantAuthorizationCodeManagement
  implements AuthorizationCodeManagement
{
  private tenantId: TenantId;
  constructor(tenantId: TenantId) {
    this.tenantId = tenantId;
  }
  async get(
    ctx: KoaContext.FHIRServices["FHIRContext"],
    id: string,
  ): Promise<AuthorizationCode | undefined> {
    return db
      .selectOne(
        "authorization_code",
        { id, scope: "tenant", tenant: this.tenantId },
        {
          extras: { is_expired },
        },
      )
      .run(ctx.db);
  }
  search(
    ctx: KoaContext.FHIRServices["FHIRContext"],
    where: s.authorization_code.Whereable,
  ): Promise<AuthorizationCode[]> {
    const whereable: s.authorization_code.Whereable = {
      ...where,
      scope: "tenant",
      tenant: this.tenantId,
    };

    return db
      .select(
        "authorization_code",
        db.sql`${whereable} AND ${is_not_expired}`,
        {
          extras: { is_expired },
        },
      )
      .run(ctx.db);
  }
  create(
    ctx: KoaContext.FHIRServices["FHIRContext"],
    model: Pick<
      s.authorization_code.Insertable,
      "type" | "user_id" | "tenant" | "expires_in" | "client_id" | "payload"
    >,
  ): Promise<AuthorizationCode> {
    return db
      .insert(
        "authorization_code",
        {
          ...model,
          code: randomBytes(32).toString("hex"),
          scope: "tenant",
          tenant: this.tenantId,
        },
        { extras: { is_expired } },
      )
      .run(ctx.db);
  }
  update(
    ctx: KoaContext.FHIRServices["FHIRContext"],
    id: string,
    update: s.authorization_code.Updatable,
  ): Promise<AuthorizationCode> {
    return db.serializable(ctx.db, async (txnClient) => {
      const where: s.authorization_code.Whereable = {
        scope: "tenant",
        tenant: this.tenantId,
        id,
      };
      const authorization_codes = await db
        .selectOne("authorization_code", where)
        .run(txnClient);

      if (!authorization_codes)
        throw new OperationError(outcomeError("not-found", "Code not found."));

      const updatedAuthorizationCode = await db
        .update(
          "authorization_code",
          {
            ...update,
            scope: "tenant",
            tenant: this.tenantId,
          },
          where,
          { extras: { is_expired } },
        )
        .run(txnClient);
      return updatedAuthorizationCode[0];
    });
  }
  delete(
    ctx: KoaContext.FHIRServices["FHIRContext"],
    where_: s.authorization_code.Whereable,
  ): Promise<void> {
    return db.serializable(ctx.db, async (txnClient) => {
      const where: s.authorization_code.Whereable = {
        ...where_,
        scope: "tenant",
        tenant: this.tenantId,
      };
      const authorization_code = await db
        .select("authorization_code", where)
        .run(txnClient);
      if (authorization_code.length > 1) {
        throw new OperationError(
          outcomeError(
            "invariant",
            "Deletion only allowed for one code at a time.",
          ),
        );
      }
      await db.deletes("authorization_code", where).run(txnClient);
    });
  }
}
