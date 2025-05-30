import type { ConfigSchema } from "../../json-schemas/schemas/config.schema.js";

export interface ConfigProvider {
  get<K extends keyof ConfigSchema>(key: K): Promise<ConfigSchema[K]>;
  validate(): Promise<void>;
}
