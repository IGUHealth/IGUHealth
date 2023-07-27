import { expect, test } from "@jest/globals";
import { PostgresLock } from "./locks.js";
import dotEnv from "dotenv";
import { Client } from "pg";

dotEnv.config();

function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

test("Test PostgresLock", async () => {
  // Test that lock properly handles syncrhonization of multiple threads
  const pgClient = new Client({
    user: process.env["FHIR_DATABASE_USERNAME"],
    password: process.env["FHIR_DATABASE_PASSWORD"],
    host: process.env["FHIR_DATABASE_HOST"],
    database: process.env["FHIR_DATABASE_NAME"],
    port: parseInt(process.env["FHIR_DATABASE_PORT"] || "5432"),
  });
  pgClient.connect();

  let sharedValue = 0;
  const lock = new PostgresLock(pgClient);

  const lockId = "test-lock";
  const promises: Promise<void>[] = [];
  for (let i = 0; i < 10; i++) {
    // Test that synchronous code works
    promises.push(
      lock.transact(lockId, async () => {
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
