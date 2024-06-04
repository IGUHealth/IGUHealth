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
    throw new OperationError(
      outcomeError("not-supported", "Login not supported at global."),
    );
  }
  async get(
    ctx: KoaContext.FHIRServices["FHIRContext"],
    id: string,
  ): Promise<User | undefined> {
    return db
      .selectOne("users", { id }, { columns: USER_QUERY_COLS })
      .run(ctx.db);
  }
  async search(
    ctx: KoaContext.FHIRServices["FHIRContext"],
    where: s.users.Whereable,
  ): Promise<User[]> {
    return db
      .select("users", { ...where }, { columns: USER_QUERY_COLS })
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

      const membership = await ctx.client.create(
        asSystemCTX({ ...ctx, db: txnClient, tenant: tenant.id as TenantId }),
        R4,
        userToMembership({
          scope: "tenant",
          role: "owner",
          tenant: tenant.id,
          email: user.email as string,
        }),
      );

      const createdUser: User[] = await db
        .select(
          "users",
          { fhir_user_id: membership.id as id },
          { columns: USER_QUERY_COLS },
        )
        .run(txnClient);

      return createdUser[0];
    });
  }
  async update(
    _ctx: KoaContext.FHIRServices["FHIRContext"],
    _id: string,
    _update: s.users.Updatable,
  ): Promise<User> {
    throw new OperationError(
      outcomeError("not-supported", "Cannot update at global go to tenant."),
    );
  }
  async delete(
    _ctx: KoaContext.FHIRServices["FHIRContext"],
    _where_: s.users.Whereable,
  ): Promise<void> {
    throw new OperationError(
      outcomeError("not-supported", "Cannot delete at global go to tenant."),
    );
  }
}
