import * as db from "zapatos/db";
import * as s from "zapatos/schema";

import { TenantId } from "@iguhealth/jwt";

/**
 *
 * @param pg Queryable PG instance
 * @param verifyLocksCreated Locks to verify created
 * @returns
 */
export async function ensureLocksCreated(
  pg: db.Queryable,
  verifyLocksCreated: s.iguhealth_locks.Insertable[],
) {
  const foundLocks = await db
    .upsert(
      "iguhealth_locks",
      verifyLocksCreated,
      db.constraint("iguhealth_locks_pkey"),
      { updateColumns: db.doNothing },
    )
    .run(pg);

  return foundLocks;
}

/**
 * Retrieves available locks skipping over locked rows.
 * Sets available locks to be locked until transaction is committed.
 * @param pg Postgres Queryable
 * @param tenant Current tenant
 * @param lock_type Lock type to select
 * @param lockIds Ids of locks to select
 * @returns Selectable locks that are available and locks until transaction is committed.
 */
export async function getAvailableLocks(
  pg: db.Queryable,
  tenant: TenantId,
  lock_type: string,
  lockIds: string[],
): Promise<s.iguhealth_locks.Selectable[]> {
  if (lockIds.length === 0) return [];
  const whereable = db.conditions.or(
    ...lockIds.map((id) => ({ id, tenant, type: lock_type })),
  );

  return db.sql<
    s.iguhealth_locks.SQL,
    s.iguhealth_locks.Selectable[]
  >`SELECT * FROM ${"iguhealth_locks"} WHERE ${whereable} FOR UPDATE SKIP LOCKED`.run(
    pg,
  );
}

export async function updateLock(
  pg: db.Queryable,
  tenant: TenantId,
  type: string,
  lockid: string,
  value: s.iguhealth_locks.Updatable,
) {
  db.update("iguhealth_locks", value, { id: lockid, tenant, type }).run(pg);
}
