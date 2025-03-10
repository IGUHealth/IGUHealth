import { Command } from "commander";
// @ts-ignore
import DBMigrate from "db-migrate";
import { Admin } from "kafkajs";

import { AllResourceTypes } from "@iguhealth/fhir-types/versions";
import { TenantId } from "@iguhealth/jwt";

import syncArtifacts, {
  artifactStatus,
} from "../../fhir-clients/clients/artifacts/load.js";
import { createKafkaClient } from "../../queue/index.js";
import { DYNAMIC_TOPIC } from "../../queue/topics/dynamic-topic.js";
import { ITopic } from "../../queue/topics/index.js";

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

/**
 * Check if a given topic exists in Kafka.
 * @param admin The admin client
 * @param topic Topic to check
 * @returns true|false if the topic exists
 */
async function doesKafkaTopicExist(admin: Admin, topic: ITopic) {
  // The admin client will throw an exception if any of the provided topics do not already exist.
  try {
    await admin.fetchTopicMetadata({ topics: [topic] });
    return true;
  } catch {
    return false;
  }
}

const kafka: Parameters<Command["action"]>[0] = async () => {
  const kafka = createKafkaClient();

  const admin = kafka.admin();
  await admin.connect();
  try {
    if (!(await doesKafkaTopicExist(admin, DYNAMIC_TOPIC))) {
      console.log("Creating default kafka topics.");
      await admin.createTopics({ topics: [{ topic: DYNAMIC_TOPIC }] });
      console.log("Default kafka topics created.");
    } else {
      console.log("[Skipping] Default topics have already been created.");
    }
  } finally {
    await admin.disconnect();
  }
};

const artifactsToLoad = {
  r4: [
    { resourceType: "StructureDefinition" as AllResourceTypes },
    {
      resourceType: "SearchParameter" as AllResourceTypes,
      // Don't want to load other searchparameters which could conflict with base for now.
      onlyPackages: [
        "@iguhealth/hl7.fhir.r4.core",
        "@iguhealth/iguhealth.fhir.r4.core",
      ],
    },
    {
      resourceType: "ValueSet" as AllResourceTypes,
    },
    { resourceType: "CodeSystem" as AllResourceTypes },
  ],
  r4b: [
    { resourceType: "StructureDefinition" as AllResourceTypes },
    {
      resourceType: "SearchParameter" as AllResourceTypes,
      // Don't want to load other searchparameters which could conflict with base for now.
      onlyPackages: [
        "@iguhealth/hl7.fhir.r4b.core",
        "@iguhealth/iguhealth.fhir.r4b.core",
      ],
    },
    { resourceType: "ValueSet" as AllResourceTypes },
    { resourceType: "CodeSystem" as AllResourceTypes },
  ],
};

const tenantsyncId = "iguhealth" as TenantId;

const loadArtifacts: Parameters<Command["action"]>[0] = async () => {
  const result = await syncArtifacts(tenantsyncId, artifactsToLoad);

  console.log(result);
};

const checkStatus = async () => {
  const result = await artifactStatus(tenantsyncId, artifactsToLoad);

  if (
    result.issue.find((i) => i.severity === "error" || i.severity === "fatal")
  ) {
    console.error(JSON.stringify(result));
    process.exit(1);
  } else {
    console.log(JSON.stringify(result));
  }
};

function artifactCommands(command: Command) {
  command.description("Run artifact migrations.").action(loadArtifacts);
  command.command("status").action(checkStatus);
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
