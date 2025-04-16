import { randomBytes } from "node:crypto";
import * as db from "zapatos/db";
import * as s from "zapatos/schema";

import { id } from "@iguhealth/fhir-types/lib/generated/r4/types";
import { TenantId } from "@iguhealth/jwt/types";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { ITenantAuthModel } from "../../interfaces/authAdmin/authAdmin.js";

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

export class PostgresAuthorizationCodeAdmin<CTX, T extends "authorization_code">
  implements
    ITenantAuthModel<
      CTX,
      T,
      Pick<
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
      AuthorizationCode
    >
{
  private readonly _pgClient: db.Queryable;

  constructor(pgClient: db.Queryable) {
    this._pgClient = pgClient;
  }

  async create(
    ctx: CTX,
    tenant: TenantId,
    data: Pick<
      s.authorization_code.Insertable,
      | "client_id"
      | "expires_in"
      | "meta"
      | "pkce_code_challenge"
      | "pkce_code_challenge_method"
      | "redirect_uri"
      | "tenant"
      | "type"
      | "user_id"
    >,
  ): Promise<AuthorizationCode> {
    return db
      .insert(
        "authorization_code",
        {
          ...data,
          code: randomBytes(32).toString("hex"),
          scope: "tenant",
          tenant,
        },
        { extras: { is_expired } },
      )
      .run(this._pgClient);
  }

  async read(
    ctx: CTX,
    tenant: TenantId,
    id: id,
  ): Promise<AuthorizationCode | undefined> {
    return db
      .selectOne(
        "authorization_code",
        { id, scope: "tenant", tenant },
        {
          extras: { is_expired },
        },
      )
      .run(this._pgClient);
  }

  async update(
    ctx: CTX,
    tenant: TenantId,
    id: id,
    data: s.UpdatableForTable<T>,
  ): Promise<AuthorizationCode> {
    return db.serializable(this._pgClient, async (tx) => {
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
            ...data,
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

  async delete(
    ctx: CTX,
    tenant: TenantId,
    where_: s.WhereableForTable<T>,
  ): Promise<void> {
    const where: s.authorization_code.Whereable = {
      ...where_,
      scope: "tenant",
      tenant,
    };
    const authorization_code = await db
      .select("authorization_code", where)
      .run(this._pgClient);

    if (authorization_code.length > 1) {
      throw new OperationError(
        outcomeError(
          "invariant",
          "Deletion only allowed for one code at a time.",
        ),
      );
    }

    await db.deletes("authorization_code", where).run(this._pgClient);
  }

  where(
    ctx: CTX,
    tenant: TenantId,
    where: s.WhereableForTable<T>,
  ): Promise<AuthorizationCode[]> {
    const whereable: s.authorization_code.Whereable = {
      ...where,
      scope: "tenant",
      tenant,
    };

    return db
      .select(
        "authorization_code",
        db.sql`${whereable} AND ${is_not_expired}`,
        {
          extras: { is_expired },
        },
      )
      .run(this._pgClient);
  }
}
