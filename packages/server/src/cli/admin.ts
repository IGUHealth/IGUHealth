import { Command } from "commander";

import { createFHIRServices } from "../fhir-api/index.js";
import { createPGPool } from "../fhir-storage/providers/postgres/pg.js";

function tenantCommands(command: Command) {
  command
    .command("create")
    .description("Create a new tenant.")
    .action(async () => {
      const pool = createPGPool();
      const services = await createFHIRServices(pool);
      
    });
}

export function adminCommands(command: Command) {
  tenantCommands(command.command("tenant"));
}
