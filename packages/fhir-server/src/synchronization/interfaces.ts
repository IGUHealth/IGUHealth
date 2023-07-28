export type Lock<CTX extends any> = {
  withLock(lockId: string, body: (ctx: CTX) => Promise<void>): Promise<void>;
};
