import { customAlphabet } from "nanoid";
import * as db from "zapatos/db";
import * as s from "zapatos/schema";

import { id } from "@iguhealth/fhir-types/r4/types";
import { R4 } from "@iguhealth/fhir-types/versions";
import { TenantClaim, TenantId } from "@iguhealth/jwt";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

import { KoaContext, asSystemCTX } from "../../../../fhir-api/types.js";
import { UserManagement } from "../interface.js";
import { LoginParameters, USER_QUERY_COLS, User } from "../types.js";
import { determineEmailUpdate } from "../utilities.js";
import { userToMembership } from "../utilities.js";

// https://www.rfc-editor.org/rfc/rfc1035#section-2.3.3
// Do not allow uppercase characters.
const generateTenantId = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz");

export default class GlobalUserManagement implements UserManagement {
  async getTenantClaims(
    ctx: KoaContext.FHIRServices["FHIRContext"],
    id: string,
  ): Promise<TenantClaim<s.user_role>[]> {
    const user = await this.get(ctx, id);
    if (!user) return [];

    const tenantUsers: User[] = await db
      .select("users", { root_user: user.id }, { columns: USER_QUERY_COLS })
      .run(ctx.db);

    return tenantUsers.map((tenantUser) => ({
      id: tenantUser.tenant as TenantId,
      userRole: tenantUser.role as s.user_role,
    }));
  }
  async login<T extends keyof LoginParameters>(
    ctx: KoaContext.FHIRServices["FHIRContext"],
    type: T,
    parameters: LoginParameters[T],
  ): Promise<User | undefined> {
    switch (type) {
      case "email-password": {
        const where: s.users.Whereable = {
          scope: "global",
          email: parameters.email,
          method: "email-password",
          password: db.sql`${db.self} = crypt(${db.param((parameters as LoginParameters["email-password"]).password)}, ${db.self})`,
        };

        const user: User[] = await db
          .select("users", where, { columns: USER_QUERY_COLS })
          .run(ctx.db);

        // Sanity check should never happen given unique checks on db.
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
    return db
      .selectOne("users", { id, scope: "global" }, { columns: USER_QUERY_COLS })
      .run(ctx.db);
  }
  async search(
    ctx: KoaContext.FHIRServices["FHIRContext"],
    where: s.users.Whereable,
  ): Promise<User[]> {
    return db
      .select(
        "users",
        { ...where, scope: "global" },
        { columns: USER_QUERY_COLS },
      )
      .run(ctx.db);
  }
  async create(
    ctx: KoaContext.FHIRServices["FHIRContext"],
    user: s.users.Insertable,
  ): Promise<User> {
    return await db.serializable(ctx.db, async (txnClient) => {
      if (!user.email) {
        throw new OperationError(outcomeError("invalid", "Email is required."));
      }

      // For global creation we also create a tenant.
      const tenantId = generateTenantId();

      const tenant = await db
        .insert("tenants", {
          id: tenantId,
          tenant: {
            id: tenantId,
            name: "Default",
          },
        })
        .run(txnClient);

      const globalUser = await db
        .insert("users", {
          ...user,
          scope: "global",
          email: user.email,
          email_verified: false,
        })
        .run(txnClient);

      const membership = await ctx.client.create(
        asSystemCTX({ ...ctx, db: txnClient, tenant: tenant.id as TenantId }),
        R4,
        userToMembership({
          scope: "tenant",
          role: "owner",
          tenant: tenant.id,
          email: globalUser.email,
        }),
      );

      // Associate to root user.
      await db
        .update(
          "users",
          {
            root_user: globalUser.id,
          },
          { scope: "tenant", fhir_user_id: membership.id },
        )
        .run(txnClient);

      return globalUser;
    });
  }
  async update(
    ctx: KoaContext.FHIRServices["FHIRContext"],
    id: string,
    update: s.users.Updatable,
  ): Promise<User> {
    return db.serializable(ctx.db, async (txnClient) => {
      const where: s.users.Whereable = {
        scope: "global",
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
            email_verified: determineEmailUpdate(update, currentUser),
          },
          where,
        )
        .run(txnClient);

      const globalUserTenantUsers: User[] = await db
        .select(
          "users",
          { scope: "tenant", root_user: id },
          { columns: USER_QUERY_COLS },
        )
        .run(txnClient);

      for (const tenantUser of globalUserTenantUsers) {
        await ctx.client.update(
          asSystemCTX({
            ...ctx,
            db: txnClient,
            tenant: tenantUser.tenant as TenantId,
          }),
          R4,
          "Membership",
          tenantUser.fhir_user_id as id,
          userToMembership(tenantUser),
        );
      }

      return updatedUser[0];
    });
  }
  async delete(
    ctx: KoaContext.FHIRServices["FHIRContext"],
    where_: s.users.Whereable,
  ): Promise<void> {
    return db.serializable(ctx.db, async (txnClient) => {
      const where: s.users.Whereable = {
        ...where_,
        scope: "global",
      };

      const user = await db.select("users", where).run(txnClient);

      if (user.length !== 1) {
        throw new OperationError(
          outcomeError(
            "invariant",
            "Deletion only allowed for one user at a time.",
          ),
        );
      }

      const globalUserTenantUsers: User[] = await db
        .select(
          "users",
          { scope: "tenant", root_user: user[0].id },
          { columns: USER_QUERY_COLS },
        )
        .run(txnClient);

      for (const tenantUser of globalUserTenantUsers) {
        await ctx.client.delete(
          asSystemCTX({
            ...ctx,
            db: txnClient,
            tenant: tenantUser.id as TenantId,
          }),
          R4,
          "Membership",
          tenantUser.fhir_user_id as id,
        );
      }

      await db.deletes("users", where).run(txnClient);
    });
  }
}
