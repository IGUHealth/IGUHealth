import { Command } from "commander";
// @ts-ignore
import DBMigrate from "db-migrate";
import { Admin } from "kafkajs";

import { createKafkaClient } from "../../queue/index.js";
import { DYNAMIC_TOPIC } from "../../queue/topics/dynamic-topic.js";
import { ITopic } from "../../queue/topics/index.js";
import syncArtifacts from "../../fhir-clients/clients/artifacts/load.js";
import { R4, R4B } from "@iguhealth/fhir-types/versions";
import { TenantId } from "@iguhealth/jwt";

interface DBMigrate {
  up: () => Promise<void>;
}

const postgres: Parameters<Command["action"]>[0] = async () => {
  const dbmigrate: DBMigrate = DBMigrate.getInstance(true, {
    cmdOptions: {
      "sql-file": true,
      "migrations-dir": "src/migrations/postgres/db-migrate",
    },
  });

  await dbmigrate.up();
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

const loadArtifacts: Parameters<Command["action"]>[0] = async () => {
  syncArtifacts(R4, "iguhealth" as TenantId, [
    "SearchParameter",
    "StructureDefinition",
    "ValueSet",
    "CodeSystem",
  ]);
  syncArtifacts(R4B, "iguhealth" as TenantId, [
    "SearchParameter",
    "StructureDefinition",
    "ValueSet",
    "CodeSystem",
  ]);
};

export function migrateCommands(command: Command) {
  command
    .command("postgres")
    .description("Run Postgres SQL migrations.")
    .action(postgres);

  command
    .command("kafka")
    .description("Create default kafka topics.")
    .action(kafka);

  command
    .command("artifacts")
    .description("Run artifact migrations.")
    .action(loadArtifacts);

  command
    .command("all")
    .description("Run all migrations.")
    .action(async () => {
      await postgres();
      await kafka();
      await loadArtifacts();
    });
}
