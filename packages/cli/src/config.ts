import toml, { JsonMap } from "@iarna/toml";
import * as inquirer from "@inquirer/prompts";
import { Command } from "commander";
import fs from "node:fs";
import { homedir } from "node:os";
import path from "node:path";

export const CONFIG_LOCATION = path.join(homedir(), ".iguhealth/config.toml");

export interface Tenant extends JsonMap {
  api_origin: string;
  id: string;
  name: string;
  auth: {
    type: "client_credentials";
    client_id: string;
    client_secret: string;
  };
}

export interface Config extends JsonMap {
  lastUpdated: string;
  defaultTenant: Tenant["name"];
  tenants: Tenant[];
}

function initializeConfig(location: string): Config {
  console.log("Initializing configuration file");

  const initialConfig: Config = {
    defaultTenant: "",
    lastUpdated: new Date().toISOString(),
    tenants: [],
  };

  saveConfig(location, initialConfig);
  return initialConfig;
}

export function loadConfig(location: string): Config {
  let config: Config | undefined;
  try {
    const configuration = fs.readFileSync(location, "utf8");
    config = toml.parse(configuration) as Config;
  } catch (e) {
    config = initializeConfig(location);
  }
  return config;
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
      defaultTenant: config.tenants[0]?.name,
    };
    saveConfig(location, config);
  }

  return config.tenants.find((tenant) => tenant.name === config.defaultTenant);
}

export function configurationCommands(command: Command) {
  command
    .command("switch-tenant")
    .description("Switch tenant to use to add a tenant use add-tenant")
    .action(async () => {
      const config = loadConfig(CONFIG_LOCATION);
      const defaultTenant = await inquirer.select({
        message: "Switch tenant to use",
        choices: config.tenants.map((t) => ({
          name: t.name,
          value: t.name,
        })),
      });

      saveConfig(CONFIG_LOCATION, { ...config, defaultTenant });
    });

  command
    .command("show-tenant")
    .description("Display the current tenant.")
    .action(async () => {
      const config = loadConfig(CONFIG_LOCATION);
      const currentTenant = getCurrentTenant(CONFIG_LOCATION, config);
      if (currentTenant) {
        console.log(`API URL: '${currentTenant.api_origin}'`);
        console.log(`Tenant Id: '${currentTenant.id}'`);
        console.log(`Tenant Name: '${currentTenant.name}'`);
      } else {
        console.log("No tenant configured");
      }
    });

  command
    .command("add-tenant")
    .description("Add a tenant to the configuration file")
    .action(async () => {
      const config = loadConfig(CONFIG_LOCATION);

      const apiOrigin = await inquirer.input({
        message: "Enter the API origin example:",
        default: "https://api.iguhealth.app",
      });

      const id = await inquirer.input({ message: "Enter tenant id:" });
      const name = await inquirer.input({
        message: "Enter tenant name:",
        validate: async (value) => {
          const existingTenant = config.tenants.find((t) => t.name === value);
          return existingTenant !== undefined
            ? `Tenant with name '${value}' already exists. Must be unique.`
            : true;
        },
      });
      const client_id = await inquirer.input({
        message: "Enter client id:",
      });
      const client_secret = await inquirer.password({
        message: "Enter client secret:",
      });

      config.tenants.push({
        api_origin: apiOrigin,
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
