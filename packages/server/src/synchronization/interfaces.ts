export type Lock<CTX> = {
  withLock(lockId: string, body: (ctx: CTX) => Promise<void>): Promise<void>;
};
