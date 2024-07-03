import path from "node:path";
import { fileURLToPath } from "node:url";

import { loadArtifacts } from "@iguhealth/artifacts";
import { FHIR_VERSION, ResourceType } from "@iguhealth/fhir-types/versions";
import { TenantId } from "@iguhealth/jwt";
import { OperationError, outcomeFatal } from "@iguhealth/operation-outcomes";

import RedisCache from "../../../../cache/providers/redis.js";
import { createClient, createLogger } from "../../../../fhir-api/index.js";
import { getRedisClient } from "../../../../fhir-api/index.js";
import { IGUHealthServerCTX, asRoot } from "../../../../fhir-api/types.js";
import RedisLock from "../../../../synchronization/redis.lock.js";
import { createPGPool } from "../pg.js";

export default async function syncArtifacts<Version extends FHIR_VERSION>(
  fhirVersion: Version,
  tenant: TenantId,
  types: ResourceType<Version>[],
) {
  const redis = getRedisClient();
  const { client, resolveCanonical, resolveTypeToCanonical } = createClient();
  const logger = createLogger();
  const iguhealthServices: Omit<IGUHealthServerCTX, "user"> = {
    db: createPGPool(),
    logger,
    lock: new RedisLock(redis),
    cache: new RedisCache(redis),
    client,
    resolveCanonical,
    resolveTypeToCanonical,
    tenant,
  };

  for (const type of types) {
    const resources = loadArtifacts({
      fhirVersion,
      resourceType: type,
      packageLocation: path.join(
        fileURLToPath(import.meta.url),
        "../../../../../../",
      ),
      silence: false,
    });

    console.log("Resources:", resources.length);

    return Promise.all(
      resources.map((resource) => {
        if (!resource.id) {
          logger.error({
            resource,
            type,
            fhirVersion,
            message: "Resource must have an id",
          });

          throw new OperationError(
            outcomeFatal("invalid", `Resource must have an id`),
          );
        }

        return client.update(
          asRoot(iguhealthServices),
          fhirVersion,
          type,
          resource.id,
          resource,
        );
      }),
    );
  }
}
