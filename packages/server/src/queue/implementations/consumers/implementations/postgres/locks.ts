import * as db from "zapatos/db";
import * as s from "zapatos/schema";

interface OffsetLockValue {
  isPattern: boolean;
  topic: string;
  offset: number;
}

type LockValue = {
  "queue-loc": OffsetLockValue;
};

interface Lock<T extends s.lock_type>
  extends Omit<s.locks.Insertable, "value"> {
  value: LockValue[T];
}

/**
 *
 * @param pg Queryable PG instance
 * @param verifyLocksCreated Locks to verify created
 * @returns
 */
export async function ensureLocksCreated<T extends s.lock_type>(
  pg: db.Queryable,
  verifyLocksCreated: Lock<T>[],
) {
  const foundLocks = await db
    .upsert(
      "locks",
      verifyLocksCreated as unknown as s.locks.Insertable[],
      db.constraint("locks_pkey"),
      {
        updateColumns: db.doNothing,
      },
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
export async function getAvailableLocks<T extends s.lock_type>(
  pg: db.Queryable,
  lock_type: T,
  lockIds: string[],
): Promise<Lock<T>[]> {
  if (lockIds.length === 0) return [];
  const whereable = db.conditions.or(
    ...lockIds.map((id) => ({ id, type: lock_type })),
  );

  return db.sql<
    s.locks.SQL,
    s.locks.Selectable[]
  >`SELECT * FROM ${"locks"} WHERE ${whereable} FOR UPDATE SKIP LOCKED`.run(
    pg,
  ) as unknown as Promise<Lock<T>[]>;
}

export async function updateLock(
  pg: db.Queryable,
  type: s.lock_type,
  lockid: string,
  value: s.locks.Updatable,
) {
  db.update("locks", value, { id: lockid, type }).run(pg);
}
