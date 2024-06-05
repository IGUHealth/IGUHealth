import * as db from "zapatos/db";
import type * as s from "zapatos/schema";

import { TenantClaim, TenantId } from "@iguhealth/jwt";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { KoaContext } from "../../../fhir-api/types.js";
import { FHIRTransaction } from "../../../fhir-storage/transactions.js";
import { UserManagement } from "./interface.js";
import { LoginParameters, USER_QUERY_COLS, User } from "./types.js";
import { determineEmailUpdate } from "./utilities.js";

export default class TenantUserManagement implements UserManagement {
  private tenant: TenantId;

  constructor(tenant: TenantId) {
    this.tenant = tenant;
  }

  async getTenantClaims(
    ctx: KoaContext.FHIRServices["FHIRContext"],
    id: string,
  ): Promise<TenantClaim<s.user_role>[]> {
    const user = await this.get(ctx, id);
    if (!user) return [];

    switch (user.scope) {
      case "tenant": {
        return [
          { id: user.tenant as TenantId, userRole: user.role as s.user_role },
        ];
      }
    }

    return [];
  }

  async login<T extends keyof LoginParameters>(
    ctx: KoaContext.FHIRServices["FHIRContext"],
    type: T,
    parameters: LoginParameters[T],
  ): Promise<User | undefined> {
    switch (type) {
      case "email-password": {
        const where: s.users.Whereable = {
          scope: "tenant",
          tenant: this.tenant,
          method: "email-password",
          email: parameters.email,
          password: db.sql`${db.self} = crypt(${db.param((parameters as LoginParameters["email-password"]).password)}, ${db.self})`,
        };

        const user: User[] = await db
          .select("users", where, { columns: USER_QUERY_COLS })
          .run(ctx.db);

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

  async get(
    ctx: KoaContext.FHIRServices["FHIRContext"],
    id: string,
  ): Promise<User | undefined> {
    const tenantUser: User | undefined = (await db
      .selectOne(
        "users",
        { id, tenant: this.tenant, scope: "tenant" },
        { columns: USER_QUERY_COLS },
      )
      .run(ctx.db)) as User | undefined;

    return tenantUser;
  }
  async search(
    ctx: KoaContext.FHIRServices["FHIRContext"],
    where: s.users.Whereable,
  ): Promise<User[]> {
    return db
      .select(
        "users",
        { ...where, tenant: this.tenant, scope: "tenant" },
        { columns: USER_QUERY_COLS },
      )
      .run(ctx.db);
  }
  async create(
    ctx: KoaContext.FHIRServices["FHIRContext"],
    user: s.users.Insertable,
  ): Promise<User> {
    return await db
      .insert("users", { ...user, tenant: this.tenant, scope: "tenant" })
      .run(ctx.db);
  }
  async update(
    ctx: KoaContext.FHIRServices["FHIRContext"],
    id: string,
    update: s.users.Updatable,
  ): Promise<User> {
    return FHIRTransaction(ctx, db.IsolationLevel.Serializable, async (ctx) => {
      const where: s.users.Whereable = {
        scope: "tenant",
        tenant: this.tenant,
        id,
      };
      const currentUser = await db.selectOne("users", where).run(ctx.db);
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
        .run(ctx.db);
      return updatedUser[0];
    });
  }
  async delete(
    ctx: KoaContext.FHIRServices["FHIRContext"],
    where_: s.users.Whereable,
  ): Promise<void> {
    await FHIRTransaction(ctx, db.IsolationLevel.Serializable, async (ctx) => {
      const where: s.users.Whereable = {
        ...where_,
        tenant: this.tenant,
        scope: "tenant",
      };
      const user = await db.select("users", where).run(ctx.db);
      if (user.length > 1) {
        throw new OperationError(
          outcomeError(
            "invariant",
            "Deletion only allowed for one user at a time.",
          ),
        );
      }

      await db.deletes("users", where).run(ctx.db);
    });
  }
}
