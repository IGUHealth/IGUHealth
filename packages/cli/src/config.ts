import toml, { JsonMap } from "@iarna/toml";
import { Command } from "commander";
import fs from "node:fs";
import { homedir } from "node:os";
import path from "node:path";

const CONFIG_LOCATION = path.join(homedir(), ".iguhealth/config.toml");

interface Tenant extends JsonMap {
  id: string;
  name: string;
  auth: {
    type: "client_credentials";
    client_id: string;
    client_secret: string;
  };
}

interface Config extends JsonMap {
  lastUpdated: string;
  tenants: Tenant[];
}

export function configurationCommands(command: Command) {
  command
    .command("init")
    .description("Initializes the configuration file")
    .action(() => {
      console.log("Initializing configuration file");
      const initialConfig: Config = {
        lastUpdated: new Date().toISOString(),
        tenants: [],
      };
      if (!fs.existsSync(path.join(CONFIG_LOCATION, "../"))) {
        fs.mkdirSync(path.join(CONFIG_LOCATION, "../"), { recursive: true });
      }
      fs.writeFileSync(CONFIG_LOCATION, toml.stringify(initialConfig), "utf8");
    });
}
