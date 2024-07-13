import { program } from "commander";

import loadEnv from "../env.js";
import { adminCommands } from "./admin.js";
import { generateCommands } from "./generate.js";
import { runCommands, terminateServices } from "./run.js";
import { terminologyCommands } from "./terminology.js";

loadEnv();

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
