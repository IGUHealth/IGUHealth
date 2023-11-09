import path from "node:path";
import createLogger from "pino";
import dotEnv from "dotenv";

import MemoryDatabase from "./memory/async.js";
import RedisCache from "../cache/redis.js";
import { IOCache } from "../cache/interface.js";
import { FHIRServerCTX } from "../ctx/types.js";
import { loadArtifacts } from "@iguhealth/artifacts";

import { Lock } from "../synchronization/interfaces.js";
import { TerminologyProviderMemory } from "../terminology/index.js";

dotEnv.config();

const sds = loadArtifacts(
  "StructureDefinition",
  path.join(__dirname, "../"),
  true
);

class TestLock implements Lock<TestLock> {
  async withLock(lockId: string, body: (v: TestLock) => Promise<void>) {
    await body(this);
  }
}

class TestCache<CTX extends { workspace: string }> implements IOCache<CTX> {
  _date: Record<string, unknown>;
  constructor() {
    this._date = {};
  }
  get(ctx: CTX, key: string): Promise<string | number | null> {
    return Promise.resolve((this._date[key] as string | number) || null);
  }
  set(ctx: CTX, key: string, value: string | number): Promise<void> {
    this._date[key] = value;
    return Promise.resolve();
  }
}

export const testServices: FHIRServerCTX = {
  workspace: "test",
  author: "test-user",
  terminologyProvider: new TerminologyProviderMemory(),
  logger: createLogger.default(),
  capabilities: {
    resourceType: "CapabilityStatement",
    status: "active",
    kind: "instance",
    fhirVersion: "4.0.1",
    date: new Date().toISOString(),
    format: ["json"],
  },
  client: MemoryDatabase({}),
  cache: new TestCache(),
  resolveSD: (type: string) => {
    return sds.find((sd) => sd.id === type);
  },
  lock: new TestLock(),
};
