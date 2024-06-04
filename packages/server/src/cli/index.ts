import { program } from "commander";

import loadEnv from "../env.js";
import { generateCommands } from "./generate.js";
import { runCommands, terminateServices } from "./run.js";

loadEnv();

runCommands(program.command("run"));
generateCommands(program.command("generate"));

await program.parseAsync();

process.on("SIGINT", function () {
  console.log("Exiting...");
  terminateServices();
  process.exit();
});
