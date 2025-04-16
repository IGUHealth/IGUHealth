import * as db from "zapatos/db";
import type * as s from "zapatos/schema";

import { id } from "@iguhealth/fhir-types/lib/generated/r4/types";
import { TenantId } from "@iguhealth/jwt/types";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import {
  ITenantAuthModel,
  LoginParameters,
  LoginProvider,
  LoginResult,
  USER_QUERY_COLS,
  User,
} from "../../interfaces/authAdmin/authAdmin.js";

export class PostgresUserAdmin<CTX, T extends "users">
  implements
    ITenantAuthModel<CTX, T, Omit<s.users.Insertable, "password">, User>,
    LoginProvider<CTX>
{
  private readonly _pgClient: db.Queryable;
  constructor(pgClient: db.Queryable) {
    this._pgClient = pgClient;
  }
  create(
    ctx: CTX,
    tenant: TenantId,
    data: Omit<s.users.Insertable, "password">,
  ): Promise<User> {
    return db
      .insert("users", { ...data, tenant }, { returning: USER_QUERY_COLS })
      .run(this._pgClient);
  }
  async read(ctx: CTX, tenant: TenantId, id: id): Promise<User | undefined> {
    const tenantUser: User | undefined = (await db
      .selectOne(
        "users",
        { fhir_user_id: id, tenant },
        { columns: USER_QUERY_COLS },
      )
      .run(this._pgClient)) as User | undefined;

    return tenantUser;
  }
  update(
    ctx: CTX,
    tenant: TenantId,
    id: id,
    data: s.users.Insertable,
  ): Promise<User> {
    return db.serializable(this._pgClient, async (tx) => {
      if (data.password) {
        data.password = db.sql<s.users.SQL>`crypt(${db.param(data.password)}, gen_salt('bf'))`;
      }

      const updatedUser: s.users.Insertable = {
        ...data,
        tenant,
      };

      const result = await db
        .upsert("users", [updatedUser], ["tenant", "fhir_user_id"], {
          updateColumns: Object.keys(updatedUser) as s.users.Column[],
        })
        .run(tx);

      return result[0];
    });
  }
  delete(
    ctx: CTX,
    tenant: TenantId,
    where_: s.WhereableForTable<T>,
  ): Promise<void> {
    return db.serializable(this._pgClient, async (tx) => {
      const where: s.users.Whereable = {
        ...where_,
        tenant,
      };
      const user = await db.select("users", where).run(tx);
      if (user.length > 1) {
        throw new OperationError(
          outcomeError(
            "invariant",
            "Deletion only allowed for one user at a time.",
          ),
        );
      }

      await db.deletes("users", where).run(tx);
    });
  }
  where(
    ctx: CTX,
    tenant: TenantId,
    where: s.WhereableForTable<T>,
  ): Promise<User[]> {
    return db
      .select("users", { ...where, tenant }, { columns: USER_QUERY_COLS })
      .run(this._pgClient);
  }

  async login<T extends keyof LoginParameters>(
    ctx: CTX,
    tenant: TenantId,
    type: T,
    parameters: LoginParameters[T],
  ): Promise<LoginResult> {
    switch (type) {
      case "email-password": {
        const where: s.users.Whereable = {
          tenant,
          method: "email-password",
          email: parameters.email,
          password: db.sql`${db.self} = crypt(${db.param((parameters as LoginParameters["email-password"]).password)}, ${db.self})`,
        };

        const usersFound: User[] = await db
          .select("users", where, { columns: USER_QUERY_COLS })
          .run(this._pgClient);

        // Sanity check should never happen given unique check on email.
        if (usersFound.length > 1)
          throw new Error(
            "Multiple users found with the same email and password",
          );

        const user = usersFound[0];

        if (user?.email_verified === false) {
          return { type: "failed", errors: ["email-not-verified"] };
        }
        if (!user) {
          return { type: "failed", errors: ["invalid-credentials"] };
        }
        return { type: "successful", user: user };
      }
      default: {
        throw new Error("Invalid login method.");
      }
    }
  }
}
