import { expect, test } from "@jest/globals";
import dotEnv from "dotenv";

import { getRedisClient } from "../fhir-api/index.js";
import PostgresLock from "./postgres.lock.js";
import RedisLock from "./redis.lock.js";

dotEnv.config();

function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

test("redisLock", async () => {
  const redisClient = getRedisClient();
  const lock = new RedisLock(redisClient);

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
      }),
    );
  }
  await Promise.all(promises);
  redisClient.disconnect();
});

test("Test PostgresLock", async () => {
  // Test that lock properly handles syncrhonization of multiple threads

  let sharedValue = 0;
  const lockId = "test-lock";
  const promises: Promise<void>[] = [];
  const lock = new PostgresLock({
    user: process.env["RESOURCE_STORE_USERNAME"],
    password: process.env["RESOURCE_STORE_PASSWORD"],
    host: process.env["RESOURCE_STORE_HOST"],
    database: process.env["RESOURCE_STORE_NAME"],
    port: parseInt(process.env["RESOURCE_STORE_PORT"] ?? "5432"),
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
      }),
    );
  }

  await Promise.all(promises);
}, 10000);
