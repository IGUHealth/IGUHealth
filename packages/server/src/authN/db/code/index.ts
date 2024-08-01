import { randomBytes } from "node:crypto";
import * as db from "zapatos/db";
import * as s from "zapatos/schema";

import { TenantId } from "@iguhealth/jwt";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { KoaExtensions } from "../../../fhir-api/types.js";
import { FHIRTransaction } from "../../../fhir-storage/transactions.js";
import { is_expired, is_not_expired } from "./utilities.js";

export type AuthorizationCode = s.authorization_code.JSONSelectable & {
  is_expired: boolean;
};

export async function get(
  ctx: KoaExtensions.IGUHealthServices["iguhealth"],
  tenant: TenantId,
  id: string,
): Promise<AuthorizationCode | undefined> {
  return db
    .selectOne(
      "authorization_code",
      { id, scope: "tenant", tenant },
      {
        extras: { is_expired },
      },
    )
    .run(ctx.db);
}
export async function search(
  ctx: KoaExtensions.IGUHealthServices["iguhealth"],
  tenant: TenantId,
  where: s.authorization_code.Whereable,
): Promise<AuthorizationCode[]> {
  const whereable: s.authorization_code.Whereable = {
    ...where,
    scope: "tenant",
    tenant,
  };

  return db
    .select("authorization_code", db.sql`${whereable} AND ${is_not_expired}`, {
      extras: { is_expired },
    })
    .run(ctx.db);
}
export async function create(
  ctx: KoaExtensions.IGUHealthServices["iguhealth"],
  tenant: TenantId,
  model: Pick<
    s.authorization_code.Insertable,
    "type" | "user_id" | "tenant" | "expires_in" | "client_id" | "redirect_uri"
  >,
): Promise<AuthorizationCode> {
  return db
    .insert(
      "authorization_code",
      {
        ...model,
        code: randomBytes(32).toString("hex"),
        scope: "tenant",
        tenant,
      },
      { extras: { is_expired } },
    )
    .run(ctx.db);
}
export async function update(
  ctx: KoaExtensions.IGUHealthServices["iguhealth"],
  tenant: TenantId,
  id: string,
  update: s.authorization_code.Updatable,
): Promise<AuthorizationCode> {
  return FHIRTransaction(ctx, db.IsolationLevel.Serializable, async (ctx) => {
    const where: s.authorization_code.Whereable = {
      scope: "tenant",
      tenant,
      id,
    };
    const authorization_codes = await db
      .selectOne("authorization_code", where)
      .run(ctx.db);

    if (!authorization_codes)
      throw new OperationError(outcomeError("not-found", "Code not found."));

    const updatedAuthorizationCode = await db
      .update(
        "authorization_code",
        {
          ...update,
          scope: "tenant",
          tenant,
        },
        where,
        { extras: { is_expired } },
      )
      .run(ctx.db);
    return updatedAuthorizationCode[0];
  });
}

export async function remove(
  ctx: KoaExtensions.IGUHealthServices["iguhealth"],
  tenant: TenantId,
  where_: s.authorization_code.Whereable,
): Promise<void> {
  return FHIRTransaction(ctx, db.IsolationLevel.Serializable, async (ctx) => {
    const where: s.authorization_code.Whereable = {
      ...where_,
      scope: "tenant",
      tenant,
    };
    const authorization_code = await db
      .select("authorization_code", where)
      .run(ctx.db);
    if (authorization_code.length > 1) {
      throw new OperationError(
        outcomeError(
          "invariant",
          "Deletion only allowed for one code at a time.",
        ),
      );
    }
    await db.deletes("authorization_code", where).run(ctx.db);
  });
}
