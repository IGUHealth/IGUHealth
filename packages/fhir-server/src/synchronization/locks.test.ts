import { expect, test } from "@jest/globals";
import PostgresLock from "./postgres.lock.js";
import RedisLock from "./redis.lock.js";
import dotEnv from "dotenv";

dotEnv.config();

function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

test("redisLock", async () => {
  const lock = new RedisLock({ host: "127.0.0.1" });

  let sharedValue = 0;
  const lockId = "test-lock";
  const promises: Promise<void>[] = [];
  for (let i = 0; i < 10; i++) {
    // Test that synchronous code works
    promises.push(
      lock.withLock(lockId, async (signal) => {
        // Make sure any attempted lock extension has not failed.
        if (signal.aborted) {
          throw signal.error;
        }
        expect(sharedValue).toEqual(0);
        const timeToWait = Math.random() * 10;

        sharedValue++;
        await timeout(timeToWait);
        sharedValue--;

        expect(sharedValue).toEqual(0);
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
  const lock = new PostgresLock({
    user: process.env["FHIR_DATABASE_USERNAME"],
    password: process.env["FHIR_DATABASE_PASSWORD"],
    host: process.env["FHIR_DATABASE_HOST"],
    database: process.env["FHIR_DATABASE_NAME"],
    port: parseInt(process.env["FHIR_DATABASE_PORT"] || "5432"),
  });

  for (let i = 0; i < 10; i++) {
    // Test that Async code works in order
    promises.push(
      lock.withLock(lockId, async () => {
        expect(sharedValue).toEqual(0);
        const timeToWait = Math.random() * 10;

        sharedValue++;
        await timeout(timeToWait);
        sharedValue--;

        expect(sharedValue).toEqual(0);
      })
    );
  }

  await Promise.all(promises);
}, 10000);
