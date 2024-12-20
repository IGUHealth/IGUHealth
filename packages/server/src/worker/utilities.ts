import * as s from "zapatos/schema";

import createHTTPClient from "@iguhealth/client/lib/http";
import { id } from "@iguhealth/fhir-types/r4/types";
import { AllResourceTypes, R4, Resource } from "@iguhealth/fhir-types/versions";
import * as fhirpath from "@iguhealth/fhirpath";
import {
  AccessTokenPayload,
  CUSTOM_CLAIMS,
  Subject,
  TenantId,
  createToken,
  getSigningKey,
} from "@iguhealth/jwt";

import { getIssuer } from "../authN/oidc/constants.js";
import { WORKER_APP } from "../authN/oidc/hardcodedClients/worker-app.js";
import RedisCache from "../cache/providers/redis.js";
import { createLogger, getRedisClient } from "../fhir-api/index.js";
import { IGUHealthServerCTX } from "../fhir-api/types.js";
import { createArtifactMemoryDatabase } from "../fhir-storage/providers/clients/memory/async.js";
import { createPGPool } from "../fhir-storage/providers/pg.js";
import RedisLock from "../synchronization/redis.lock.js";

export type IGUHealthWorkerCTX = Pick<
  IGUHealthServerCTX,
  | "tenant"
  | "db"
  | "logger"
  | "lock"
  | "cache"
  | "tenant"
  | "user"
  | "resolveCanonical"
  | "resolveTypeToCanonical"
> & { workerID: string; client: ReturnType<typeof createHTTPClient> };

export function workerTokenClaims(
  workerID: string,
  tenant: TenantId,
): AccessTokenPayload<s.user_role> {
  const accessTokenPayload = {
    iss: getIssuer(tenant),
    scope: "system/*.*",
    aud: WORKER_APP.id as id,
    sub: WORKER_APP.id as string as Subject,
    [CUSTOM_CLAIMS.RESOURCE_ID]: WORKER_APP.id as id,
    [CUSTOM_CLAIMS.RESOURCE_VERSION_ID]: WORKER_APP.meta?.versionId as id,
    [CUSTOM_CLAIMS.ACCESS_POLICY_VERSION_IDS]: [],
    [CUSTOM_CLAIMS.RESOURCE_TYPE]: WORKER_APP.resourceType,
    [CUSTOM_CLAIMS.TENANT]: tenant,
    [CUSTOM_CLAIMS.ROLE]: "admin",
  } as AccessTokenPayload<s.user_role>;

  return accessTokenPayload;
}

export type WorkerClient = ReturnType<typeof createWorkerIGUHealthClient>;
export type WorkerClientCTX = Parameters<WorkerClient["request"]>[0];

export function staticWorkerServices(
  workerID: string,
): Omit<IGUHealthWorkerCTX, "user" | "tenant" | "client"> {
  const db = createPGPool();
  const redis = getRedisClient();
  const lock = new RedisLock(redis);
  const cache = new RedisCache(redis);
  const logger = createLogger().child({ worker: workerID });
  const sdArtifacts = createArtifactMemoryDatabase({
    r4: [{ resourceType: "StructureDefinition" as AllResourceTypes }],
    r4b: [{ resourceType: "StructureDefinition" as AllResourceTypes }],
  });

  return {
    resolveCanonical: sdArtifacts.resolveCanonical,
    resolveTypeToCanonical: sdArtifacts.resolveTypeToCanonical,
    db,
    logger,
    cache,
    lock,
    workerID,
  };
}

function createWorkerIGUHealthClient(
  tenant: TenantId,
  tokenPayload: AccessTokenPayload<s.user_role>,
): ReturnType<typeof createHTTPClient> {
  if (tokenPayload[CUSTOM_CLAIMS.TENANT] !== tenant) {
    throw new Error("Token does not match tenant");
  }

  const client = createHTTPClient({
    url: new URL(`w/${tenant}`, process.env.API_URL).href,
    getAccessToken: async () => {
      const token = await createToken({
        signingKey: await getSigningKey(
          process.env.AUTH_LOCAL_CERTIFICATION_LOCATION,
          process.env.AUTH_LOCAL_SIGNING_KEY,
        ),
        payload: tokenPayload,
      });
      return token;
    },
  });

  return client;
}

export function tenantWorkerContext(
  services: Omit<IGUHealthWorkerCTX, "user" | "tenant" | "client">,
  tenant: TenantId,
  claims: AccessTokenPayload<s.user_role>,
): IGUHealthWorkerCTX {
  return {
    ...services,
    tenant: tenant,
    client: createWorkerIGUHealthClient(tenant, claims),
    user: {
      resource: WORKER_APP,
      payload: claims,
    },
  };
}

export async function getVersionSequence(
  resource: Resource<R4, AllResourceTypes>,
): Promise<number> {
  const evaluation = (
    await fhirpath.evaluate(
      "$this.meta.extension.where(url=%sequenceUrl).value",
      resource,
      {
        variables: {
          sequenceUrl: "https://iguhealth.app/version-sequence",
        },
      },
    )
  )[0];

  if (typeof evaluation !== "number") {
    throw new Error("No version sequence found.");
  }

  return evaluation;
}
