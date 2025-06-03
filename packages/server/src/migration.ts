// @ts-ignore
import DBMigrate from "db-migrate";
import * as path from "node:path";
import { fileURLToPath } from "url";

import { AllResourceTypes } from "@iguhealth/fhir-types/versions";

import getConfigProvider from "./config/index.js";
import syncArtifacts from "./fhir-clients/clients/artifacts/load.js";
import createQueue from "./queue/implementations/providers/index.js";
import { DYNAMIC_TOPIC } from "./queue/implementations/topics/dynamic-topic.js";

interface DBMigrate {
  up: () => Promise<void>;
}

export const migratePostgres = async () => {
  const config = getConfigProvider();
  const storeMigrate: DBMigrate = DBMigrate.getInstance(true, {
    env: "store",
    config: {
      store: {
        driver: "pg",
        user: await config.get("RESOURCE_STORE_PG_USERNAME"),
        password: await config.get("RESOURCE_STORE_PG_PASSWORD"),
        host: await config.get("RESOURCE_STORE_PG_HOST"),
        database: await config.get("RESOURCE_STORE_PG_NAME"),
        port: await config.get("RESOURCE_STORE_PG_PORT"),
        ssl: await config.get("RESOURCE_STORE_PG_SSL"),
      },
    },
    cmdOptions: {
      "sql-file": true,
      "migrations-dir": path.join(
        fileURLToPath(import.meta.url),
        "../migrations/postgres/db-migrate",
      ),
    },
  });

  const artifactMigrate: DBMigrate = DBMigrate.getInstance(true, {
    env: "artifact",
    config: {
      artifact: {
        driver: "pg",
        user: await config.get("ARTIFACT_DB_PG_USERNAME"),
        password: await config.get("ARTIFACT_DB_PG_PASSWORD"),
        host: await config.get("ARTIFACT_DB_PG_HOST"),
        database: await config.get("ARTIFACT_DB_PG_NAME"),
        port: await config.get("ARTIFACT_DB_PG_PORT"),
        ssl: await config.get("ARTIFACT_DB_PG_SSL"),
      },
    },
    cmdOptions: {
      "sql-file": true,
      "migrations-dir": path.join(
        fileURLToPath(import.meta.url),
        "../migrations/postgres/db-migrate",
      ),
    },
  });
  await Promise.all([storeMigrate.up(), artifactMigrate.up()]);
};

export const migrateQueue = async () => {
  const config = getConfigProvider();
  await config.validate();
  const queue = await createQueue(config);
  await queue.createTopic(DYNAMIC_TOPIC);
  await queue.disconnect();
};

const artifactsToLoad = {
  r4: [
    {
      resourceType: "SearchParameter" as AllResourceTypes,
      // Don't want to load other searchparameters which could conflict with base for now.
      onlyPackages: [
        "@iguhealth/hl7.fhir.r4.core",
        "@iguhealth/iguhealth.fhir.r4.core",
      ],
    },
    { resourceType: "StructureDefinition" as AllResourceTypes },

    {
      resourceType: "ValueSet" as AllResourceTypes,
    },
    { resourceType: "CodeSystem" as AllResourceTypes },
  ],
  r4b: [
    {
      resourceType: "SearchParameter" as AllResourceTypes,
      // Don't want to load other searchparameters which could conflict with base for now.
      onlyPackages: [
        "@iguhealth/hl7.fhir.r4b.core",
        "@iguhealth/iguhealth.fhir.r4b.core",
      ],
    },
    { resourceType: "StructureDefinition" as AllResourceTypes },
    { resourceType: "ValueSet" as AllResourceTypes },
    { resourceType: "CodeSystem" as AllResourceTypes },
  ],
};

export const migrateArtifacts = async () => {
  const config = getConfigProvider();
  await syncArtifacts(artifactsToLoad);
};

export async function migrateAll() {
  await migratePostgres();
  await migrateQueue();
  await migrateArtifacts();
}
