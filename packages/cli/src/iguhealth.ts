import { Command } from "commander";

import { codeGenerationCommands } from "./codeGeneration.js";
import { configurationCommands } from "./config.js";

const program = new Command();

program
  .name("IGUHEALTH CLI Tool")
  .description("IGUHEALTH CLI interface.")
  .version("0.8.0");

configurationCommands(program.command("config"));
codeGenerationCommands(program.command("generate"));

program.parse();
