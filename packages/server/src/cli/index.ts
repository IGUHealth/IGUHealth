import { program } from "commander";

import loadEnv from "../env.js";
import { generateCommands } from "./generate.js";
import { runCommands } from "./run.js";

loadEnv();

runCommands(program);
generateCommands(program.command("generate"));

await program.parseAsync();
