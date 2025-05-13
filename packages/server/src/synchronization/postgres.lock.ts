// Locking mechanisms
import * as db from "zapatos/db";
import * as s from "zapatos/schema";

import { Lock, LockProvider } from "./interfaces.js";

export default class PostgresLock implements LockProvider {
  private _client: db.Queryable;
  constructor(_client: db.Queryable) {
    this._client = _client;
  }

  async get<T extends s.lock_type>(
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
      this._client,
    ) as unknown as Promise<Lock<T>[]>;
  }

  async update(type: s.lock_type, lockid: string, value: s.locks.Updatable) {
    db.update("locks", value, { id: lockid, type }).run(this._client);
  }

  /**
   * Creates locks in the database.
   * @param verifyLocksCreated Locks to verify created
   * @returns
   */
  async create<T extends s.lock_type>(locks: Lock<T>[]): Promise<Lock<T>[]> {
    const createdLocks = await db
      .upsert(
        "locks",
        locks as unknown as s.locks.Insertable[],
        db.constraint("locks_pkey"),
        {
          updateColumns: db.doNothing,
        },
      )
      .run(this._client);

    return (createdLocks ?? []) as unknown as Lock<T>[];
  }
}
