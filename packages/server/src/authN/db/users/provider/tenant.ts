import * as db from "zapatos/db";
import type * as s from "zapatos/schema";

import { TenantClaim, TenantId } from "@iguhealth/jwt";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { UserManagement } from "../interface.js";
import { LoginParameters, USER_QUERY_COLS, User } from "../types.js";
import { determineEmailUpdate } from "../utilities.js";

async function loginUsingGlobalUser<T extends keyof LoginParameters>(
  client: db.Queryable,
  tenant: TenantId,
  type: T,
  parameters: LoginParameters[T],
): Promise<User | undefined> {
  switch (type) {
    case "email-password": {
      const where: s.users.Whereable = {
        scope: "global",
        method: "email-password",
        email: parameters.email,
        password: db.sql`${db.self} = crypt(${db.param((parameters as LoginParameters["email-password"]).password)}, ${db.self})`,
      };

      const globalUser: User[] = await db
        .select("users", where, { columns: USER_QUERY_COLS })
        .run(client);

      if (globalUser[0] === undefined) {
        return;
      }

      const tenantUser: User[] = await db
        .select(
          "users",
          {
            scope: "tenant",
            tenant: tenant,
            root_user: globalUser[0]?.id,
          },
          { columns: USER_QUERY_COLS },
        )
        .run(client);

      if (tenantUser.length > 0) {
        return globalUser[0];
      }

      return;
    }
    default:
      return;
  }
}

/**
 * Logins using the tenant user. Doesn't check the global user.
 */
async function tenantLogin<T extends keyof LoginParameters>(
  client: db.Queryable,
  tenant: TenantId,
  type: T,
  parameters: LoginParameters[T],
): Promise<User | undefined> {
  switch (type) {
    // [TODO] handle when auth is set on global user.
    case "email-password": {
      const where: s.users.Whereable = {
        scope: "tenant",
        tenant: tenant,
        method: "email-password",
        email: parameters.email,
        password: db.sql`${db.self} = crypt(${db.param((parameters as LoginParameters["email-password"]).password)}, ${db.self})`,
      };

      const user: User[] = await db
        .select("users", where, { columns: USER_QUERY_COLS })
        .run(client);

      // Sanity check should never happen given unique check on email.
      if (user.length > 1)
        throw new Error(
          "Multiple users found with the same email and password",
        );

      return user[0];
    }
    default:
      return;
  }
}

export default class TenantUserManagement implements UserManagement {
  private tenant: TenantId;

  constructor(tenant: TenantId) {
    this.tenant = tenant;
  }

  async getTenantClaims(
    client: db.Queryable,
    id: string,
  ): Promise<TenantClaim<s.user_role>[]> {
    const user = await this.get(client, id);
    if (!user) return [];

    switch (user.scope) {
      case "tenant": {
        return [
          { id: user.tenant as TenantId, userRole: user.role as s.user_role },
        ];
      }
      case "global": {
        const tenantUsers: User[] = await db
          .select(
            "users",
            { root_user: user.id, tenant: this.tenant },
            { columns: USER_QUERY_COLS },
          )
          .run(client);

        return tenantUsers.map((tenantUser) => ({
          id: tenantUser.id as TenantId,
          userRole: tenantUser.role as s.user_role,
        }));
      }
    }
  }

  async login<T extends keyof LoginParameters>(
    client: db.Queryable,
    type: T,
    parameters: LoginParameters[T],
  ): Promise<User | undefined> {
    const tenantUser = await tenantLogin(client, this.tenant, type, parameters);
    if (tenantUser) return tenantUser;
    return loginUsingGlobalUser(client, this.tenant, type, parameters);
  }

  async get(client: db.Queryable, id: string): Promise<User | undefined> {
    const tenantUser: User | undefined = (await db
      .selectOne(
        "users",
        { id, tenant: this.tenant, scope: "tenant" },
        { columns: USER_QUERY_COLS },
      )
      .run(client)) as User | undefined;

    if (tenantUser?.root_user) {
      const globalUser: User | undefined = (await db
        .selectOne(
          "users",
          { id: tenantUser.root_user, scope: "global" },
          { columns: USER_QUERY_COLS },
        )
        .run(client)) as User | undefined;

      return { ...globalUser, ...tenantUser };
    }

    return tenantUser;
  }
  async search(
    client: db.Queryable,
    where: s.users.Whereable,
  ): Promise<User[]> {
    return db
      .select(
        "users",
        { ...where, tenant: this.tenant, scope: "tenant" },
        { columns: USER_QUERY_COLS },
      )
      .run(client);
  }
  async create(client: db.Queryable, user: s.users.Insertable): Promise<User> {
    return await db
      .insert("users", { ...user, tenant: this.tenant, scope: "tenant" })
      .run(client);
  }
  async update(
    client: db.Queryable,
    id: string,
    update: s.users.Updatable,
  ): Promise<User> {
    return db.serializable(client, async (txnClient) => {
      const where: s.users.Whereable = {
        scope: "tenant",
        tenant: this.tenant,
        id,
      };
      const currentUser = await db.selectOne("users", where).run(txnClient);
      if (!currentUser)
        throw new OperationError(outcomeError("not-found", "User not found."));

      const updatedUser = await db
        .update(
          "users",
          {
            ...update,
            tenant: this.tenant,
            scope: "tenant",
            email_verified: determineEmailUpdate(update, currentUser),
          },
          where,
        )
        .run(txnClient);
      return updatedUser[0];
    });
  }
  async delete(client: db.Queryable, where_: s.users.Whereable): Promise<void> {
    return db.serializable(client, async (txnClient) => {
      const where: s.users.Whereable = {
        ...where_,
        tenant: this.tenant,
        scope: "tenant",
      };
      const user = await db.select("users", where).run(txnClient);
      if (user.length > 1) {
        throw new OperationError(
          outcomeError(
            "invariant",
            "Deletion only allowed for one user at a time.",
          ),
        );
      }

      await db.deletes("users", where).run(txnClient);
    });
  }
}
