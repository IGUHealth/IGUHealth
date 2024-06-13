import { Command } from "commander";

import { apiCommands } from "./commands/api.js";
import { codeGenerationCommands } from "./commands/codeGeneration.js";
import { minimizeCommands } from "./commands/minimize.js";
import { testscriptCommands } from "./commands/testscript.js";
import { configurationCommands } from "./config.js";

const program = new Command();

program
  .name("IGUHEALTH CLI Tool")
  .description("IGUHEALTH CLI interface.")
  .version("0.8.0");

configurationCommands(program.command("config"));
codeGenerationCommands(program.command("generate"));
apiCommands(program.command("api"));
minimizeCommands(program.command("minimize"));
testscriptCommands(program.command("test"));

program.parse();
