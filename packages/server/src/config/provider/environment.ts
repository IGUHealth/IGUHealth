import Ajv from "ajv";
import dotEnv from "dotenv";

import type { ConfigSchema } from "../../json-schemas/schemas/config.schema.js";
import IGUHealthEnvironmentSchema from "../../json-schemas/schemas/config.schema.json" with { type: "json" };
import { ConfigProvider } from "./interface.js";

export default class EnvironmentConfigProvider implements ConfigProvider {
  constructor() {
    dotEnv.config();
  }
  async get<K extends keyof ConfigSchema>(key: K): Promise<ConfigSchema[K]> {
    return process.env[key];
  }
  async validate(): Promise<void> {
    const ajv = new Ajv.default({});
    const environmentValidator = ajv.compile(IGUHealthEnvironmentSchema);
    const envValid = environmentValidator(process.env);
    if (!envValid) throw new Error(ajv.errorsText(environmentValidator.errors));
  }
}
