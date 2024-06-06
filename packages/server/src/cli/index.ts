import { program } from "commander";

import loadEnv from "../env.js";
import { generateCommands } from "./generate.js";
import { adminCommands } from "./admin.js";
import { runCommands, terminateServices } from "./run.js";

loadEnv();

runCommands(program.command("run"));
generateCommands(program.command("generate"));
adminCommands(program.command("admin"));

await program.parseAsync();

function shutdown() {
  console.log("Exiting...");
  terminateServices();
  process.exit();
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
