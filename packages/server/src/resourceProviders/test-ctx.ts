import path from "path";
import { fileURLToPath } from "url";

import createLogger from "pino";
import dotEnv from "dotenv";

import {
  ResourceType,
  AResource,
  code,
  dateTime,
  uri,
  canonical,
} from "@iguhealth/fhir-types/r4/types";
import { loadArtifacts } from "@iguhealth/artifacts";

import MemoryDatabase from "./memory/async.js";
import { IOCache } from "../cache/interface.js";
import { JWT, FHIRServerCTX, Tenant } from "../fhir/context.js";
import { Lock } from "../synchronization/interfaces.js";
import { TerminologyProviderMemory } from "../terminology/index.js";

dotEnv.config();

const sds = loadArtifacts(
  "StructureDefinition",
  path.join(fileURLToPath(import.meta.url), "../../"),
  true
);

class TestLock implements Lock<TestLock> {
  async withLock(lockId: string, body: (v: TestLock) => Promise<void>) {
    await body(this);
  }
}

class TestCache<CTX extends { tenant: Tenant }> implements IOCache<CTX> {
  _date: Record<string, unknown>;
  constructor() {
    this._date = {};
  }
  get(_ctx: CTX, key: string): Promise<string | number | null> {
    return Promise.resolve((this._date[key] as string | number) || null);
  }
  set(_ctx: CTX, key: string, value: string | number): Promise<void> {
    this._date[key] = value;
    return Promise.resolve();
  }
}

export const testServices: FHIRServerCTX = {
  tenant: { id: "test", userRole: "SUPER_ADMIN" } as Tenant,
  user: { jwt: { iss: "test", sub: "test-user" } as JWT },
  terminologyProvider: new TerminologyProviderMemory(),
  logger: createLogger.default(),
  capabilities: {
    resourceType: "CapabilityStatement",
    status: "active" as code,
    kind: "instance" as code,
    fhirVersion: "4.0.1" as code,
    date: new Date().toISOString() as dateTime,
    format: ["json" as code],
  },
  client: MemoryDatabase({}),
  cache: new TestCache(),
  resolveCanonical: <T extends ResourceType>(type: T, url: string) => {
    return sds.find((sd) => sd.url === url) as AResource<T>;
  },
  resolveTypeToCanonical: (type: uri) => {
    const sd = sds.find((sd) => sd.type === type);
    return sd?.url as canonical;
  },
  lock: new TestLock(),
};
