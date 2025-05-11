import { expect, test } from "@jest/globals";
import dotEnv from "dotenv";
import pg from "pg";
import * as db from "zapatos/db";

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

  const client = new pg.Client({
    user: process.env["RESOURCE_STORE_PG_USERNAME"],
    password: process.env["RESOURCE_STORE_PG_PASSWORD"],
    host: process.env["RESOURCE_STORE_PG_HOST"],
    database: process.env["RESOURCE_STORE_PG_NAME"],
    port: parseInt(process.env["RESOURCE_STORE_PG_PORT"] ?? "5432"),
  });

  const store = new PostgresStore(client);
  const lock = new PostgresLock();

  await lock.create({ store }, [
    { id: "test-lock", type: "sync-lock", value: {} },
  ]);

  for (let i = 0; i < 10; i++) {
    // Test that Async code works in order
    promises.push(
      (async () => {
        await StorageTransaction(
          { store },
          db.IsolationLevel.RepeatableRead,
          async (ctx) => {
            await lock.get(ctx, "sync-lock", [lockId]);
            expect(sharedValue).toEqual(0);
            const timeToWait = Math.random() * 10;

            sharedValue++;
            await timeout(timeToWait);
            sharedValue--;

            expect(sharedValue).toEqual(0);
          },
        );
      })(),
    );
  }

  await Promise.all(promises);
}, 10000);
