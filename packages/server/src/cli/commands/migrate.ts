import { Command } from "commander";

import {
  migrateAll,
  migrateArtifacts,
  migratePostgres,
  migrateQueue,
} from "../../migration.js";

function artifactCommands(command: Command) {
  command.description("Run artifact migrations.").action(migrateArtifacts);
}

export function migrateCommands(command: Command) {
  command
    .command("postgres")
    .description("Run Postgres SQL migrations.")
    .action(migratePostgres);

  command
    .command("queue")
    .description("Create default queue topics.")
    .action(migrateQueue);

  artifactCommands(command.command("artifacts"));

  command
    .command("all")
    .description("Run all migrations.")
    .action(async () => {
      await migrateAll();
    });
}
