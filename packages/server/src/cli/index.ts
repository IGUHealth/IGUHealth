import { program } from "commander";

import loadEnv from "../env.js";
import { adminCommands } from "./commands/admin.js";
import { generateCommands } from "./commands/generate.js";
import { runCommands, terminateServices } from "./commands/run.js";
import { terminologyCommands } from "./commands/terminology.js";
import IGUHealthEnvironmentSchema from "../json-schemas/schemas/environment.schema.json" with { type: "json" };

loadEnv(IGUHealthEnvironmentSchema);

runCommands(program.command("run"));
generateCommands(program.command("generate"));
adminCommands(program.command("admin"));
terminologyCommands(program.command("terminology"));

await program.parseAsync();

function shutdown() {
  console.log("Exiting...");
  terminateServices();
  process.exit();
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
