import dotEnv from "dotenv";
import path from "path";
import { pino } from "pino";
import { fileURLToPath } from "url";

import { loadArtifacts } from "@iguhealth/artifacts";
import {
  AResource,
  ResourceType,
  canonical,
  code,
  dateTime,
  uri,
} from "@iguhealth/fhir-types/r4/types";

import { JWT } from "../authN/token.js";
import { IOCache } from "../cache/interface.js";
import { FHIRServerCTX, TenantId } from "../fhir-context/types.js";
import { TerminologyProviderMemory } from "../fhir-terminology/index.js";
import { Lock } from "../synchronization/interfaces.js";
import MemoryDatabase from "./providers/memory/async.js";

dotEnv.config();

const sds = loadArtifacts({
  resourceType: "StructureDefinition",
  packageLocation: path.join(fileURLToPath(import.meta.url), "../../"),
  silence: true,
});

class TestLock implements Lock<TestLock> {
  async withLock(lockId: string, body: (v: TestLock) => Promise<void>) {
    await body(this);
  }
}

class TestCache<CTX extends { tenant: TenantId }> implements IOCache<CTX> {
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
  tenant: "tenant" as TenantId,
  user: { role: "admin", jwt: { iss: "test", sub: "test-user" } as JWT },
  terminologyProvider: new TerminologyProviderMemory(),
  logger: pino<string>(),
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
