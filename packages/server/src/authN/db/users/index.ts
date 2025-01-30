import * as db from "zapatos/db";
import type * as s from "zapatos/schema";

import { TenantClaim, TenantId } from "@iguhealth/jwt/types";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

export const USER_QUERY_COLS = <const>[
  "fhir_user_id",
  "tenant",
  "email",
  "email_verified",
  "role",
];

export type User = s.users.OnlyCols<typeof USER_QUERY_COLS>;

export type LoginParameters = {
  "email-password": {
    email: string;
    password: string;
  };
  "oidc-provider": {
    email: string;
    provider: string;
  };
};

export async function getTenantClaims(
  pg: db.Queryable,
  tenant: TenantId,
  id: string,
): Promise<TenantClaim<s.user_role>[]> {
  const user = await get(pg, tenant, id);
  if (!user) return [];

  return [{ id: user.tenant as TenantId, userRole: user.role }];
}

export type LoginErrors = "invalid-credentials" | "email-not-verified";
type SuccessfulLogin = { type: "successful"; user: User };
type FailedLogin = { type: "failed"; errors: LoginErrors[] };
export type LoginResult = SuccessfulLogin | FailedLogin;

export async function login<T extends keyof LoginParameters>(
  pg: db.Queryable,
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
        .run(pg);

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

export async function get(
  pg: db.Queryable,
  tenant: TenantId,
  id: string,
): Promise<User | undefined> {
  const tenantUser: User | undefined = (await db
    .selectOne(
      "users",
      { fhir_user_id: id, tenant },
      { columns: USER_QUERY_COLS },
    )
    .run(pg)) as User | undefined;

  return tenantUser;
}

export async function search(
  pg: db.Queryable,
  tenant: TenantId,
  where: s.users.Whereable,
): Promise<User[]> {
  return db
    .select("users", { ...where, tenant }, { columns: USER_QUERY_COLS })
    .run(pg);
}

export async function create(
  pg: db.Queryable,
  tenant: TenantId,
  user: Omit<s.users.Insertable, "password">,
): Promise<User> {
  return await db.insert("users", { ...user, tenant }).run(pg);
}

export async function update(
  pg: db.Queryable,
  tenant: TenantId,
  update: s.users.Insertable,
): Promise<User> {
  return db.serializable(pg, async (tx) => {
    if (update.password) {
      update.password = db.sql<s.users.SQL>`crypt(${db.param(update.password)}, gen_salt('bf'))`;
    }

    const updatedUser: s.users.Insertable = {
      ...update,
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

export async function remove(
  pg: db.Queryable,
  tenant: TenantId,
  where_: s.users.Whereable,
): Promise<void> {
  return db.serializable(pg, async (tx) => {
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
