import * as s from "zapatos/schema";

interface OffsetLockValue {
  isPattern: boolean;
  topic: string;
  offset: number;
}

interface SystemLock {
  offset: number;
}

type LockValue = {
  "queue-loc": OffsetLockValue;
  system: SystemLock;
};

export interface Lock<T extends s.lock_type>
  extends Omit<s.locks.Insertable, "value"> {
  value: LockValue[T];
}

export interface LockProvider {
  /**
   * Retrieves available locks skipping over locked rows.
   * Sets available locks to be locked until transaction is committed.
   * @param tenant Current tenant
   * @param lock_type Lock type to select
   * @param lockIds Ids of locks to select
   * @returns Selectable locks that are available and locks until transaction is committed.
   */
  get<T extends s.lock_type>(
    lock_type: T,
    lockIds: string[],
  ): Promise<Lock<T>[]>;
  /**
   * Updates given lock with value.
   * @param type Lock type to update
   * @param lockId Lock id to update
   * @param value Value to update
   * @returns void
   */
  update(
    type: s.lock_type,
    lockid: string,
    value: s.locks.Updatable,
  ): Promise<void>;
  /**
   * Creates locks in the database.
   * @param verifyLocksCreated Locks to verify created
   * @returns
   */
  create<T extends s.lock_type>(locks: Lock<T>[]): Promise<Lock<T>[]>;
}
