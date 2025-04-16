import { randomBytes } from "node:crypto";
import * as db from "zapatos/db";
import * as s from "zapatos/schema";

import { TenantId } from "@iguhealth/jwt/types";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

/**
 * SQL eval that returns true if the code has expired.
 * Generally used in extras parameter for select queries.
 */
const is_expired = db.sql<
  s.authorization_code.SQL,
  boolean
>`NOW() > ${"created_at"} + ${"expires_in"}`;

/**
 * Filter for only non-expired codes.
 */
const is_not_expired = db.sql<
  s.authorization_code.SQL,
  boolean
>`NOW() <= ${"created_at"} + ${"expires_in"}`;

export type AuthorizationCode = s.authorization_code.JSONSelectable & {
  is_expired: boolean;
};

export async function get(
  pg: db.Queryable,
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
    .run(pg);
}

export async function search(
  pg: db.Queryable,
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
    .run(pg);
}
export async function create(
  pg: db.Queryable,
  tenant: TenantId,
  model: Pick<
    s.authorization_code.Insertable,
    | "type"
    | "user_id"
    | "tenant"
    | "expires_in"
    | "client_id"
    | "redirect_uri"
    | "pkce_code_challenge"
    | "pkce_code_challenge_method"
    | "meta"
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
    .run(pg);
}
export async function update(
  pg: db.Queryable,
  tenant: TenantId,
  id: string,
  update: s.authorization_code.Updatable,
): Promise<AuthorizationCode> {
  return db.serializable(pg, async (tx) => {
    const where: s.authorization_code.Whereable = {
      scope: "tenant",
      tenant,
      id,
    };
    const authorization_codes = await db
      .selectOne("authorization_code", where)
      .run(tx);

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
      .run(tx);
    return updatedAuthorizationCode[0];
  });
}

export async function remove(
  pg: db.Queryable,
  tenant: TenantId,
  where_: s.authorization_code.Whereable,
): Promise<void> {
  const where: s.authorization_code.Whereable = {
    ...where_,
    scope: "tenant",
    tenant,
  };
  const authorization_code = await db
    .select("authorization_code", where)
    .run(pg);

  if (authorization_code.length > 1) {
    throw new OperationError(
      outcomeError(
        "invariant",
        "Deletion only allowed for one code at a time.",
      ),
    );
  }

  await db.deletes("authorization_code", where).run(pg);
}
