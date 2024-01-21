import toml, { JsonMap } from "@iarna/toml";
import * as inquirer from "@inquirer/prompts";
import { Command } from "commander";
import fs from "node:fs";
import { homedir } from "node:os";
import path from "node:path";

export const CONFIG_LOCATION = path.join(homedir(), ".iguhealth/config.toml");

export interface Tenant extends JsonMap {
  id: string;
  name: string;
  auth: {
    type: "client_credentials";
    client_id: string;
    client_secret: string;
  };
}

export interface Config extends JsonMap {
  api_url: string;
  lastUpdated: string;
  defaultTenant: Tenant["id"];
  tenants: Tenant[];
}

export function loadConfig(location: string): Config {
  const configuration = fs.readFileSync(location, "utf8");
  return toml.parse(configuration) as Config;
}

export function saveConfig(location: string, config: Config) {
  if (!fs.existsSync(path.join(location, "../"))) {
    fs.mkdirSync(path.join(location, "../"), { recursive: true });
  }
  fs.writeFileSync(location, toml.stringify(config), "utf8");
}

export function getCurrentTenant(
  location: string,
  config: Config,
): Tenant | undefined {
  if (!config.defaultTenant) {
    config = {
      ...config,
      defaultTenant: config.tenants[0]?.id,
    };
    saveConfig(location, config);
  }

  return config.tenants.find((tenant) => tenant.id === config.defaultTenant);
}

async function initializeConfig(location: string) {
  console.log("Initializing configuration file");

  const initialConfig: Config = {
    api_url: await inquirer.input({
      message: "Root API URL:",
      default: "https://api.iguhealth.app",
    }),
    defaultTenant: "",
    lastUpdated: new Date().toISOString(),
    tenants: [],
  };

  saveConfig(location, initialConfig);
}

export function configurationCommands(command: Command) {
  command
    .command("init")
    .description("Initializes the configuration file")
    .action(async () => {
      console.log("Initializing configuration file");
      await initializeConfig(CONFIG_LOCATION);
    });

  command
    .command("add-tenant")
    .description("Add a tenant to the configuration file")
    .action(async () => {
      const id = await inquirer.input({ message: "Enter tenant id:" });
      const name = await inquirer.input({ message: "Enter tenant name:" });
      const client_id = await inquirer.input({
        message: "Enter client id:",
      });
      const client_secret = await inquirer.input({
        message: "Enter client secret:",
      });
      const config = loadConfig(CONFIG_LOCATION);

      config.tenants.push({
        id,
        name,
        auth: {
          type: "client_credentials",
          client_id,
          client_secret,
        },
      });
      saveConfig(CONFIG_LOCATION, config);
    });
}
