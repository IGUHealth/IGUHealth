import crypto from "node:crypto";
import pg from "pg";

import { OperationOutcome } from "@iguhealth/fhir-types/lib/generated/r4/types";
import {
  FHIR_VERSION,
  R4,
  R4B,
  ResourceType,
} from "@iguhealth/fhir-types/versions";
import { TenantId } from "@iguhealth/jwt/types";
import {
  OperationError,
  outcomeError,
  outcomeFatal,
  outcomeInfo,
} from "@iguhealth/operation-outcomes";

import { createLogger } from "../../../fhir-server/index.js";
import { IGUHealthServerCTX, asRoot } from "../../../fhir-server/types.js";
import createQueue from "../../../queue/index.js";
import createResourceStore from "../../../resource-stores/index.js";
import { createSearchStore } from "../../../search-stores/index.js";
import { Memory, createArtifactMemoryDatabase } from "../memory/async.js";
import { createArtifactClient } from "./index.js";

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
    await memSource.search_type(asRoot(services), fhirVersion, type, [
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

  await Promise.all(
    resources.map(async (resource) => {
      if (!resource.id) {
        services.logger.error({
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
        meta: {
          ...resource.meta,
          tag: [
            ...(resource?.meta?.tag ?? []),
            { system: "md5-checksum", code: md5 },
          ],
        },
      };

      try {
        const res = await services.client.conditionalUpdate(
          asRoot(services),
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
            return;
          }
        }
        services.logger.error({ resource: resource, error });
        throw error;
      }
    }),
  );

  return resources.length;
}

async function createServices(
  tenant: TenantId,
): Promise<Omit<IGUHealthServerCTX, "resolveCanonical" | "user">> {
  const logger = createLogger();

  const iguhealthServices: Omit<
    IGUHealthServerCTX,
    "user" | "resolveCanonical"
  > = {
    environment: process.env.IGUHEALTH_ENVIRONMENT,
    queue: await createQueue(),
    store: await createResourceStore({ type: "postgres" }),
    search: await createSearchStore({ type: "postgres" }),
    logger,
    tenant,
    client: createArtifactClient({
      transaction_entry_limit: 20,
      artifactTenant: tenant,
      operationsAllowed: ["create-request", "update-request"],
      db: new pg.Pool({
        host: process.env.ARTIFACT_DB_PG_HOST,
        password: process.env.ARTIFACT_DB_PG_PASSWORD,
        user: process.env.ARTIFACT_DB_PG_USERNAME,
        database: process.env.ARTIFACT_DB_PG_NAME,
        port: parseInt(process.env.ARTIFACT_DB_PG_PORT ?? "5432"),
      }),
    }),
  };

  return iguhealthServices;
}

export default async function syncArtifacts(
  tenant: TenantId,
  config: Parameters<typeof createArtifactMemoryDatabase>[0],
) {
  const memSource = createArtifactMemoryDatabase(config);
  const iguhealthServices = {
    ...(await createServices(tenant)),
    resolveCanonical: memSource.resolveCanonical,
  };
  const r4Types: ResourceType<R4>[] = config.r4.map((r) => r.resourceType);
  const r4bTypes: ResourceType<R4B>[] = config.r4b.map((r) => r.resourceType);

  const result = {
    r4: await Promise.all(
      r4Types.map(async (type) => ({
        type,
        amount: await syncType(iguhealthServices, memSource, R4, type),
      })),
    ).then((res) => {
      return res.reduce((acc: Record<string, number>, { type, amount }) => {
        acc[type] = amount;
        return acc;
      }, {});
    }),

    r4b: await Promise.all(
      r4bTypes.map(async (type) => ({
        type,
        amount: await syncType(iguhealthServices, memSource, R4B, type),
      })),
    ).then((res) => {
      return res.reduce((acc: Record<string, number>, { type, amount }) => {
        acc[type] = amount;
        return acc;
      }, {});
    }),
  };

  await iguhealthServices.queue.disconnect();
  iguhealthServices.logger.info("DONE");

  return result;
}

export async function artifactStatus(
  tenant: TenantId,
  config: Parameters<typeof createArtifactMemoryDatabase>[0],
): Promise<OperationOutcome> {
  const memSource = createArtifactMemoryDatabase(config);

  const iguhealthServices = {
    ...(await createServices(tenant)),
    resolveCanonical: memSource.resolveCanonical,
  };

  for (const resourceConfig of config.r4) {
    const artifactResults = await memSource.search_type(
      asRoot(iguhealthServices),
      R4,
      resourceConfig.resourceType,
      [{ name: "_count", value: [50000000000] }],
    );
    const res = await iguhealthServices.search.search(
      asRoot(iguhealthServices),
      {
        type: "search-request",
        level: "type",
        resource: resourceConfig.resourceType,
        fhirVersion: R4,
        parameters: [
          { name: "_total", value: ["accurate"] },
          { name: "_count", value: [1] },
        ],
      },
    );

    if (res.total !== artifactResults.resources.length) {
      return outcomeError(
        "incomplete",
        `Resources are missing for type '${resourceConfig.resourceType}'. ${artifactResults.resources.length} !== ${res.total}`,
      );
    }
  }

  await iguhealthServices.queue.disconnect();

  return outcomeInfo("informational", "All resources are present");
}
