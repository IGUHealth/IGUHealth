import * as db from "zapatos/db";
import type * as s from "zapatos/schema";

import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { TenantId } from "../../../../fhir-context/types.js";
import { UserManagement } from "../interface.js";
import { LoginParameters, USER_QUERY_COLS, User } from "../types.js";

export default class TenantUserManagement implements UserManagement {
  private tenant: TenantId;
  constructor(tenant: TenantId) {
    this.tenant = tenant;
  }
  async getTenantUsers(client: db.Queryable, id: string): Promise<User[]> {
    const user = await this.get(client, id);
    if (user?.root_user) {
      const tenantUsers = await db
        .select(
          "users",
          { root_user: user.id, scope: "tenant" },
          { columns: USER_QUERY_COLS },
        )
        .run(client);

      return tenantUsers;
    }
    return [];
  }
  async login<T extends keyof LoginParameters>(
    client: db.Queryable,
    type: T,
    parameters: LoginParameters[T],
  ): Promise<User | undefined> {
    switch (type) {
      // [TODO] handle when auth is set on global user.
      case "password": {
        const where: s.users.Whereable = {
          scope: "tenant",
          tenant: this.tenant,
          email: parameters.email,
          password: db.sql`${db.self} = crypt(${db.param(parameters.password)}, ${db.self})`,
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
        throw new Error();
    }
  }
  async get(client: db.Queryable, id: string): Promise<User | undefined> {
    return db
      .selectOne(
        "users",
        { id, tenant: this.tenant, scope: "tenant" },
        { columns: USER_QUERY_COLS },
      )
      .run(client);
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
            email_verified:
              update.email !== currentUser.email
                ? false
                : currentUser.email_verified,
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
