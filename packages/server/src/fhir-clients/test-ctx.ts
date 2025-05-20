import { pino } from "pino";
import { fileURLToPath } from "url";
import * as s from "zapatos/schema";

import { loadArtifacts } from "@iguhealth/artifacts";
import { canonical } from "@iguhealth/fhir-types/r4/types";
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
import getConfigProvider from "../config/index.js";
import { IGUHealthServerCTX } from "../fhir-server/types.js";
import { TerminologyProvider } from "../fhir-terminology/index.js";
import { createSearchStore } from "../search-stores/index.js";
import createStore from "../storage/index.js";
import PostgresLock from "../synchronization/postgres.lock.js";
import { Memory } from "./clients/memory/async.js";

const sds = loadArtifacts({
  fhirVersion: R4,
  loadDevelopmentPackages: true,
  resourceType: "StructureDefinition",
  currentDirectory: fileURLToPath(import.meta.url),
  silence: true,
});

const parameters = loadArtifacts({
  fhirVersion: R4,
  resourceType: "SearchParameter",
  // Don't want to load other searchparameters which could conflict with base for now.
  onlyPackages: [
    "@iguhealth/hl7.fhir.r4.core",
    "@iguhealth/iguhealth.fhir.r4.core",
  ],
  currentDirectory: fileURLToPath(import.meta.url),
  silence: true,
});

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

const config = getConfigProvider();
const store = await createStore(config);

export const testServices: IGUHealthServerCTX = {
  config,
  tenant: "tenant" as TenantId,
  store,
  search: await createSearchStore(config),
  lock: new PostgresLock(store.getClient()),
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
    URL extends canonical[],
  >(
    _ctx: IGUHealthServerCTX,
    version: Version,
    type: Type,
    url: URL,
  ): Promise<Resource<Version, Type>[]> => {
    switch (type) {
      case "StructureDefinition": {
        return sds.filter((sd) =>
          url.includes(sd.url as canonical),
        ) as Resource<Version, Type>[];
      }
      case "SearchParameter": {
        return parameters.filter((param) =>
          url.includes(param.url as canonical),
        ) as Resource<Version, Type>[];
      }
      default: {
        return [];
      }
    }
  },
};
