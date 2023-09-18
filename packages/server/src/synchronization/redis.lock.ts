import { Lock } from "./interfaces.js";
import Redis, { RedisOptions } from "ioredis";
// @ts-ignore
import Redlock from "redlock";

const defaultSettings: Redlock.Settings = {
  // The expected clock drift; for more details see:
  // http://redis.io/topics/distlock
  driftFactor: 0.01, // multiplied by lock ttl to determine drift time

  // The max number of times Redlock will attempt to lock a resource
  // before erroring.
  retryCount: 10,

  // the time in ms between attempts
  retryDelay: 200, // time in ms

  // the max time in ms randomly added to retries
  // to improve performance under high contention
  // see https://www.awsarchitectureblog.com/2015/03/backoff.html
  retryJitter: 200, // time in ms

  // The minimum remaining time on a lock before an extension is automatically
  // attempted with the `using` API.
  automaticExtensionThreshold: 500, // time in ms
};

export default class RedisLock implements Lock<Redlock.RedlockAbortSignal> {
  private _lock: Redlock.default;
  constructor(
    client: Redis.default,
    lockSettings: Redlock.Settings = defaultSettings
  ) {
    this._lock = new Redlock.default(
      // You should have one client for each independent redis node
      // or cluster.
      [client],
      lockSettings
    );

    this._lock.on("error", (error: unknown) => {
      // Ignore cases where a resource is explicitly marked as locked on a client.
      if (error instanceof Redlock.ResourceLockedError) {
        return;
      }

      // Log all other errors.
      console.error(error);
    });
  }

  async withLock(
    lockId: string,
    body: (ctx: Redlock.RedlockAbortSignal) => Promise<void>
  ): Promise<void> {
    await this._lock.using([lockId], 5000, body);
  }
}
