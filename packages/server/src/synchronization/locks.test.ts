import { expect, test } from "@jest/globals";
import dotEnv from "dotenv";
import pg from "pg";
import * as db from "zapatos/db";

import EnvironmentConfigProvider from "../config/provider/environment.js";
import { PostgresStore } from "../storage/postgres/index.js";
import { StorageTransaction } from "../transactions.js";
import PostgresLock from "./postgres.lock.js";

dotEnv.config();

function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

test("Test PostgresLock", async () => {
  // Test that lock properly handles syncrhonization of multiple threads

  let sharedValue = 0;
  const lockId = "test-lock";
  const promises: Promise<void>[] = [];

  const config = new EnvironmentConfigProvider();

  const client = new pg.Pool({
    user: await config.get("RESOURCE_STORE_PG_USERNAME"),
    password: await config.get("RESOURCE_STORE_PG_PASSWORD"),
    host: await config.get("RESOURCE_STORE_PG_HOST"),
    database: await config.get("RESOURCE_STORE_PG_NAME"),
    port: parseInt((await config.get("RESOURCE_STORE_PG_PORT")) ?? "5432"),
  });

  const store = new PostgresStore(client);
  const lock = new PostgresLock(client);

  await lock.create([
    {
      id: lockId,
      type: "queue-loc",
      value: { isPattern: true, topic: "test", offset: 1 },
    },
  ]);

  for (let i = 0; i < 10; i++) {
    promises.push(
      StorageTransaction(
        { store, lock },
        db.IsolationLevel.RepeatableRead,
        async (ctx) => {
          // Test that Async code works in order
          let retrievedLock = await ctx.lock.get("queue-loc", [lockId]);
          while (retrievedLock.length !== 1) {
            await timeout(100);
            retrievedLock = await ctx.lock.get("queue-loc", [lockId]);
          }

          expect(sharedValue).toEqual(0);
          const timeToWait = Math.random() * 10;
          sharedValue++;
          await timeout(timeToWait);
          sharedValue--;
          expect(sharedValue).toEqual(0);
        },
      ),
    );
  }

  await Promise.all(promises);
}, 1000000);
