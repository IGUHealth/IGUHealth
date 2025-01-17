import { customAlphabet } from "nanoid";
import * as db from "zapatos/db";
import * as s from "zapatos/schema";

import { Membership, code } from "@iguhealth/fhir-types/lib/generated/r4/types";
import { R4 } from "@iguhealth/fhir-types/versions";
import { TenantId } from "@iguhealth/jwt";

import { IGUHealthServerCTX, asRoot } from "../../fhir-server/types.js";
import { OperationsTopic, Topic } from "../../queue/topics/tenants.js";
import { QueueBatch } from "../../storage/transactions.js";
import { userToMembership } from "./users/utilities.js";

// https://www.rfc-editor.org/rfc/rfc1035#section-2.3.3
// Do not allow uppercase characters.
const generateTenantId = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz");

/**
 * Creates a new tenant. This function is used to create a new tenant and the owner of the tenant.
 * @param ctx Iguhealth Server CTX
 * @param tenant The tenant insertion
 * @param member Membership for the owner
 * @returns
 */
export async function create(
  ctx: Omit<IGUHealthServerCTX, "tenant" | "user">,
  tenant: Partial<s.tenants.Insertable>,
  member: Membership,
): Promise<[s.tenants.Insertable, Membership]> {
  return QueueBatch(ctx, async (ctx) => {
    const tenantId =
      typeof tenant.id === "string" ? tenant.id : generateTenantId();
    const tenantInsertion = {
      ...tenant,
      id: tenantId,
    };

    await ctx.queue.send(
      tenantInsertion.id as TenantId,
      Topic(tenantInsertion.id as TenantId, OperationsTopic),
      [
        {
          value: [
            {
              resource: "tenants",
              type: "create",
              value: tenantInsertion,
            },
          ],
        },
      ],
    );

    const membership = await ctx.client.create(
      asRoot({
        ...ctx,
        tenant: tenantInsertion.id as TenantId,
      }),
      R4,
      { ...member, role: "owner" as code },
    );

    return [tenantInsertion, membership];
  });
}

export async function getTenant(
  pg: db.Queryable,
  tenantId: TenantId,
): Promise<db.JSONOnlyColsForTable<"tenants", "id"[]> | undefined> {
  const tenant = await db
    .selectOne("tenants", { id: tenantId, deleted: false }, { columns: ["id"] })
    .run(pg);

  return tenant;
}

export async function getActiveTenants(
  pool: db.Queryable,
): Promise<TenantId[]> {
  const tenants = await db.sql<s.tenants.SQL, s.tenants.Selectable[]>`
      SELECT ${"id"} from ${"tenants"} where ${{ deleted: false }}
    `.run(pool);

  return tenants.map((w) => w.id as TenantId);
}
