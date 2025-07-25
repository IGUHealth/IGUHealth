import crypto from "node:crypto";
import pg from "pg";

import {
  FHIR_VERSION,
  R4,
  R4B,
  ResourceType,
} from "@iguhealth/fhir-types/versions";
import { OperationError, outcomeFatal } from "@iguhealth/operation-outcomes";

import getConfigProvider from "../../../config/index.js";
import { createLogger } from "../../../fhir-server/index.js";
import { IGUHealthServerCTX, asRoot } from "../../../fhir-server/types.js";
import createQueue from "../../../queue/implementations/providers/index.js";
import { createSearchStore } from "../../../search-stores/index.js";
import createStore from "../../../storage/index.js";
import PostgresLock from "../../../synchronization/postgres.lock.js";
import { Memory, createArtifactMemoryDatabase } from "../memory/async.js";
import { ARTIFACT_TENANT, createArtifactClient } from "./index.js";

function createCheckSum(value: unknown): string {
  return crypto.createHash("md5").update(JSON.stringify(value)).digest("hex");
}

async function syncType<Version extends FHIR_VERSION>(
  services: Omit<IGUHealthServerCTX, "user">,
  memSource: Memory<IGUHealthServerCTX>,
  fhirVersion: Version,
  type: ResourceType<Version>,
) {
  const resources = (
    await memSource.search_type(await asRoot(services), fhirVersion, type, [
      { name: "_count", value: [500000] },
    ])
  ).resources;

  services.logger.info({ [`COUNT ${type}`]: resources.length });
  if (new Set(resources.map((r) => r.id)).size !== resources.length) {
    const duplicates = new Set();
    const ids = resources.map((r) => r.id);
    ids.forEach((id, index) => {
      if (ids.indexOf(id, index + 1) !== -1) {
        duplicates.add(id);
      }
    });
    services.logger.error({ duplicates });
    throw new OperationError(
      outcomeFatal("invalid", `Resources must have unique ids`),
    );
  }

  for (const _resource of resources) {
    if (!_resource.id) {
      services.logger.error({
        resource: _resource,
        type,
        fhirVersion,
        message: "Resource must have an id",
      });

      throw new OperationError(
        outcomeFatal("invalid", `Resource must have an id`),
      );
    }

    const md5 = createCheckSum(_resource);
    const resource = {
      ..._resource,
      meta: {
        ..._resource.meta,
        tag: [
          ...(_resource?.meta?.tag ?? []),
          { system: "md5-checksum", code: md5 },
        ],
      },
    };

    try {
      const res = await services.client.conditionalUpdate(
        await asRoot(services),
        fhirVersion,
        type,
        `_tag:not=md5-checksum|${md5}&_id=${resource.id}`,
        resource,
      );
      services.logger.info(`Update finished '${res.id}'`);
    } catch (error) {
      if (error instanceof OperationError) {
        if (error.operationOutcome.issue[0].code === "conflict") {
          services.logger.warn({
            message: `Resource already exists with checksum`,
            resource: resource.id,
            checksum: md5,
          });
        }
      } else {
        services.logger.error({ resource, error });
        throw error;
      }
    }
  }

  return resources.length;
}

async function createServices(): Promise<
  Omit<IGUHealthServerCTX, "resolveCanonical" | "user">
> {
  const config = getConfigProvider();
  await config.validate();
  const logger = await createLogger(config);
  const store = await createStore(config);

  const iguhealthServices: Omit<
    IGUHealthServerCTX,
    "user" | "resolveCanonical"
  > = {
    config,
    environment: await config.get("IGUHEALTH_ENVIRONMENT"),
    queue: await createQueue(config),
    store,
    search: await createSearchStore(config),
    lock: new PostgresLock(store.getClient()),
    logger,

    tenant: ARTIFACT_TENANT,
    client: createArtifactClient({
      operationsAllowed: ["create-request", "update-request", "search-request"],
      db: new pg.Pool({
        host: await config.get("ARTIFACT_DB_PG_HOST"),
        password: await config.get("ARTIFACT_DB_PG_PASSWORD"),
        user: await config.get("ARTIFACT_DB_PG_USERNAME"),
        database: await config.get("ARTIFACT_DB_PG_NAME"),
        port: parseInt((await config.get("ARTIFACT_DB_PG_PORT")) ?? "5432"),
      }),
    }),
  };

  return iguhealthServices;
}

export default async function syncArtifacts(
  config: Parameters<typeof createArtifactMemoryDatabase>[0],
) {
  const memSource = createArtifactMemoryDatabase(config);
  const iguhealthServices = {
    ...(await createServices()),
    resolveCanonical: memSource.resolveCanonical,
  };
  const r4Types: ResourceType<R4>[] = config.r4.map((r) => r.resourceType);
  const r4bTypes: ResourceType<R4B>[] = config.r4b.map((r) => r.resourceType);

  const r4Amounts: Record<string, number> = {};

  for (const type of r4Types) {
    r4Amounts[type] = await syncType(iguhealthServices, memSource, R4, type);
  }

  const r4bAmounts: Record<string, number> = {};
  for (const type of r4bTypes) {
    r4bAmounts[type] = await syncType(iguhealthServices, memSource, R4B, type);
  }

  await iguhealthServices.queue.disconnect();
  iguhealthServices.logger.info("DONE");

  return { r4: r4Amounts, r4b: r4bAmounts };
}
