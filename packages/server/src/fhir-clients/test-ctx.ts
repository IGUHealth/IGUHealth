import { pino } from "pino";
import { fileURLToPath } from "url";
import * as s from "zapatos/schema";

import { loadArtifacts } from "@iguhealth/artifacts";
import { canonical, uri } from "@iguhealth/fhir-types/r4/types";
import {
  FHIR_VERSION,
  R4,
  R4B,
  Resource,
  ResourceType,
} from "@iguhealth/fhir-types/versions";
import {
  AccessTokenPayload,
  CUSTOM_CLAIMS,
  TenantId,
} from "@iguhealth/jwt/types";

import { IOCache } from "../cache/interface.js";
import { IGUHealthServerCTX } from "../fhir-server/types.js";
import { TerminologyProvider } from "../fhir-terminology/index.js";
import createResourceStore from "../resource-stores/index.js";
import { createSearchStore } from "../search-stores/index.js";
import { Lock } from "../synchronization/interfaces.js";
import { Memory } from "./clients/memory/async.js";

const sds = loadArtifacts({
  fhirVersion: R4,
  loadDevelopmentPackages: true,
  resourceType: "StructureDefinition",
  currentDirectory: fileURLToPath(import.meta.url),
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

export const testServices: IGUHealthServerCTX = {
  tenant: "tenant" as TenantId,
  store: await createResourceStore({ type: "postgres" }),
  search: await createSearchStore({ type: "postgres" }),
  // @ts-ignore
  user: {
    payload: {
      iss: "test",
      sub: "test-user",
      [CUSTOM_CLAIMS.ROLE]: "member",
    } as AccessTokenPayload<s.user_role>,
  },
  terminologyProvider: new TerminologyProvider(),
  logger: pino<string>(),
  client: new Memory({ [R4]: {}, [R4B]: {} }),
  cache: new TestCache(),
  resolveCanonical: async <
    Version extends FHIR_VERSION,
    Type extends ResourceType<Version>,
    URL extends canonical | canonical[],
    Return extends URL extends canonical[]
      ? Resource<Version, Type>[]
      : Resource<Version, Type> | undefined,
  >(
    version: Version,
    type: Type,
    url: URL,
  ): Promise<Return> => {
    return sds.find((sd) => sd.url === url) as Return;
  },
  resolveTypeToCanonical: async (_fhirVersion, type: uri) => {
    const sd = sds.find((sd) => sd.type === type);
    return sd?.url as canonical;
  },
  lock: new TestLock(),
};
