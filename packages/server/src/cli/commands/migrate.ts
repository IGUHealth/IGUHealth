import { Command } from "commander";
// @ts-ignore
import DBMigrate from "db-migrate";

import { AllResourceTypes } from "@iguhealth/fhir-types/versions";

import syncArtifacts from "../../fhir-clients/clients/artifacts/load.js";
import createQueue from "../../queue/providers/index.js";
import { DYNAMIC_TOPIC } from "../../queue/topics/dynamic-topic.js";

interface DBMigrate {
  up: () => Promise<void>;
}

const postgres: Parameters<Command["action"]>[0] = async () => {
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

const kafka: Parameters<Command["action"]>[0] = async () => {
  const queue = await createQueue();
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

const loadArtifacts: Parameters<Command["action"]>[0] = async () => {
  const result = await syncArtifacts(artifactsToLoad);

  console.log(result);
};

function artifactCommands(command: Command) {
  command.description("Run artifact migrations.").action(loadArtifacts);
}

export function migrateCommands(command: Command) {
  command
    .command("postgres")
    .description("Run Postgres SQL migrations.")
    .action(postgres);

  command
    .command("kafka")
    .description("Create default kafka topics.")
    .action(kafka);

  artifactCommands(command.command("artifacts"));

  command
    .command("all")
    .description("Run all migrations.")
    .action(async () => {
      await postgres();
      await kafka();
      await loadArtifacts();
    });
}
