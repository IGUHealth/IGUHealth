import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

import { loadArtifacts } from "@iguhealth/artifacts";
import { FHIR_VERSION, ResourceType } from "@iguhealth/fhir-types/versions";
import { TenantId } from "@iguhealth/jwt/types";
import { OperationError, outcomeFatal } from "@iguhealth/operation-outcomes";

import {
  createClient,
  createLogger,
  getRedisClient,
} from "../../../fhir-server/index.js";
import { IGUHealthServerCTX, asRoot } from "../../../fhir-server/types.js";
import createQueue from "../../../queue/index.js";
import createResourceStore from "../../../resource-stores/index.js";
import { createSearchStore } from "../../../search-stores/index.js";

function createCheckSum(value: unknown): string {
  return crypto.createHash("md5").update(JSON.stringify(value)).digest("hex");
}

export default async function syncArtifacts<Version extends FHIR_VERSION>(
  fhirVersion: Version,
  tenant: TenantId,
  types: ResourceType<Version>[],
) {
  const redis = getRedisClient();
  const { client, resolveCanonical } = createClient();
  const logger = createLogger();
  const iguhealthServices: Omit<IGUHealthServerCTX, "user"> = {
    environment: process.env.IGUHEALTH_ENVIRONMENT,
    queue: await createQueue(),
    store: await createResourceStore({ type: "postgres" }),
    search: await createSearchStore({ type: "postgres" }),
    logger,
    client,
    resolveCanonical,
    tenant,
  };

  const result = Promise.all(
    types.map((type) => {
      const resources = loadArtifacts({
        fhirVersion,
        resourceType: type,
        currentDirectory: fileURLToPath(import.meta.url),
        silence: false,
      });

      logger.info({ [`COUNT ${type}`]: resources.length });
      if (new Set(resources.map((r) => r.id)).size !== resources.length) {
        const duplicates = new Set();
        const ids = resources.map((r) => r.id);
        ids.forEach((id, index) => {
          if (ids.indexOf(id, index + 1) !== -1) {
            duplicates.add(id);
          }
        });
        logger.error({ duplicates });
        throw new OperationError(
          outcomeFatal("invalid", `Resources must have unique ids`),
        );
      }

      return Promise.all(
        resources.map(async (resource) => {
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

          const md5 = createCheckSum(resource);
          resource = {
            ...resource,
            id: `${resource.id}-${resource.resourceType}`,
            meta: {
              ...resource.meta,
              tag: [
                ...(resource?.meta?.tag ?? []),
                { system: "md5-checksum", code: md5 },
              ],
            },
          };

          try {
            const res = await client.conditionalUpdate(
              asRoot(iguhealthServices),
              fhirVersion,
              type,
              `_tag:not=md5-checksum|${md5}&_id=${resource.id}`,
              resource,
            );
            logger.info(`Update finished '${res.id}'`);
          } catch (error) {
            if (error instanceof OperationError) {
              if (error.operationOutcome.issue[0].code === "conflict") {
                logger.warn({
                  message: `Resource already exists with checksum`,
                  resource: resource.id,
                  checksum: md5,
                });
                return;
              }
            }
            logger.error(error);
            throw error;
          }
        }),
      );
    }),
  );

  redis.disconnect();

  return result;
}
