import { expect, test } from "@jest/globals";
import { PostgresLock } from "./locks.js";
import dotEnv from "dotenv";
import { Client } from "pg";
import Redlock, { ResourceLockedError } from "redlock";
import Redis from "ioredis";

dotEnv.config();

function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

test("redisLock", async () => {
  const redisA = new Redis();
  const redlock = new Redlock(
    // You should have one client for each independent redis node
    // or cluster.
    [redisA],
    {
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
    }
  );
  redlock.on("error", (error) => {
    // Ignore cases where a resource is explicitly marked as locked on a client.
    if (error instanceof ResourceLockedError) {
      return;
    }

    // Log all other errors.
    console.error(error);
  });
  let sharedValue = 0;
  const lockId = "test-lock";
  const promises: Promise<void>[] = [];
  for (let i = 0; i < 10; i++) {
    // Test that synchronous code works
    promises.push(
      redlock.using([lockId], 5000, async (signal) => {
        console.log("[LOCKACQUIRED] ");
        // Make sure any attempted lock extension has not failed.
        if (signal.aborted) {
          throw signal.error;
        }
        console.log("START SharedValue is:", sharedValue);
        expect(sharedValue).toEqual(0);
        const timeToWait = Math.random() * 10;
        console.log("waiting:", timeToWait);
        sharedValue++;
        await timeout(timeToWait);
        sharedValue--;
        console.log("END SharedValue is:", sharedValue);
        expect(sharedValue).toEqual(0);

        console.log("Releasing Lock");
      })
    );
  }
  await Promise.all(promises);
});

test("Test PostgresLock", async () => {
  // Test that lock properly handles syncrhonization of multiple threads

  let sharedValue = 0;
  const lockId = "test-lock";
  const promises: Promise<void>[] = [];
  for (let i = 0; i < 10; i++) {
    // Test that Async code works in order
    const lock = new PostgresLock({
      user: process.env["FHIR_DATABASE_USERNAME"],
      password: process.env["FHIR_DATABASE_PASSWORD"],
      host: process.env["FHIR_DATABASE_HOST"],
      database: process.env["FHIR_DATABASE_NAME"],
      port: parseInt(process.env["FHIR_DATABASE_PORT"] || "5432"),
    });
    promises.push(
      lock.withLock(lockId, async () => {
        console.log("[LOCKACQUIRED] ");
        console.log("START SharedValue is:", sharedValue);
        if (sharedValue !== 0) throw new Error("Failure");
        const timeToWait = Math.random() * 10;
        console.log("waiting:", timeToWait);
        sharedValue++;
        await timeout(timeToWait);
        sharedValue--;
        console.log("END SharedValue is:", sharedValue);
        if (sharedValue !== 0) throw new Error("Failure");
      })
    );
  }

  console.log(promises);

  await Promise.all(promises);
}, 10000);
