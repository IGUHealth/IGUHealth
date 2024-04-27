import { Command } from "commander";

import { apiCommands } from "./api.js";
import { codeGenerationCommands } from "./codeGeneration.js";
import { configurationCommands } from "./config.js";
import { minimizeCommands } from "./minimize.js";

const program = new Command();

program
  .name("IGUHEALTH CLI Tool")
  .description("IGUHEALTH CLI interface.")
  .version("0.8.0");

configurationCommands(program.command("config"));
codeGenerationCommands(program.command("generate"));
apiCommands(program.command("api"));
minimizeCommands(program.command("minimize"));

program.parse();
