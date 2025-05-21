import { program } from "commander";

import { adminCommands } from "./commands/admin.js";
import { generateCommands } from "./commands/generate.js";
import { migrateCommands } from "./commands/migrate.js";
import { runCommands, terminateServices } from "./commands/run.js";
import { terminologyCommands } from "./commands/terminology.js";

runCommands(program.command("run"));
generateCommands(program.command("generate"));
adminCommands(program.command("admin"));
terminologyCommands(program.command("terminology"));
migrateCommands(program.command("migrate"));

await program.parseAsync();

function shutdown() {
  console.log("Exiting...");
  terminateServices();
  process.exit();
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
