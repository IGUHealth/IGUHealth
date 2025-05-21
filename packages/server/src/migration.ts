// @ts-ignore
import DBMigrate from "db-migrate";

import { AllResourceTypes } from "@iguhealth/fhir-types/versions";

import getConfigProvider from "./config/index.js";
import syncArtifacts from "./fhir-clients/clients/artifacts/load.js";
import createQueue from "./queue/implementations/providers/index.js";
import { DYNAMIC_TOPIC } from "./queue/implementations/topics/dynamic-topic.js";

interface DBMigrate {
  up: () => Promise<void>;
}

export const migratePostgres = async () => {
  const storeMigrate: DBMigrate = DBMigrate.getInstance(true, {
    env: "store",
    cmdOptions: {
      "sql-file": true,
      "migrations-dir": "src/migrations/postgres/db-migrate",
    },
  });

  const artifactMigrate: DBMigrate = DBMigrate.getInstance(true, {
    env: "artifact",
    cmdOptions: {
      "sql-file": true,
      "migrations-dir": "src/migrations/postgres/db-migrate",
    },
  });
  await Promise.all([storeMigrate.up(), artifactMigrate.up()]);
};

export const migrateQueue = async () => {
  const config = getConfigProvider();
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
  await syncArtifacts(artifactsToLoad);
};

export async function migrateAll() {
  await migratePostgres();
  await migrateQueue();
  await migrateArtifacts();
}
