import {
  GetParameterCommand,
  GetParametersCommand,
  SSMClient,
} from "@aws-sdk/client-ssm";
import TTLCache from "@isaacs/ttlcache";

import type { ConfigSchema } from "../../json-schemas/schemas/config.schema.js";
import IGUHealthEnvironmentSchema from "../../json-schemas/schemas/config.schema.json" with { type: "json" };
import { ConfigProvider } from "./interface.js";

function namespace(namespace_: string, key: string | number): string {
  return `${namespace_}${key}`;
}

export default class AWSSSMConfigProvider implements ConfigProvider {
  private readonly _namespace: string;
  private readonly _client: SSMClient;
  private readonly _cache: TTLCache<string, ConfigSchema[keyof ConfigSchema]>;

  constructor(namespace: string) {
    this._namespace = namespace;
    this._client = new SSMClient({
      region: process.env.AWS_REGION,
    });
    this._cache = new TTLCache({
      max: 5000,
      ttl: 1000 * 60 * 15, // 15 minutes
    });
  }
  async get<K extends keyof ConfigSchema>(
    key: K,
  ): Promise<ConfigSchema[K] | undefined> {
    const namespacedKey = namespace(this._namespace, key);
    try {
      if (this._cache.has(namespacedKey)) {
        return this._cache.get(namespacedKey) as ConfigSchema[K] | undefined;
      }
      const response = await this._client.send(
        new GetParameterCommand({ Name: namespacedKey, WithDecryption: true }),
      );

      const value = response.Parameter?.Value as ConfigSchema[K] | undefined;

      if (value === undefined) {
        throw new Error(`Parameter ${namespacedKey} not found`);
      }

      return value;
    } catch (error) {
      console.log(`Failed to get parameter ${namespacedKey}: ${error}`);
      return undefined;
    }
  }
  async validate(): Promise<void> {
    const chunkSize = 10;
    for (
      let i = 0;
      i < IGUHealthEnvironmentSchema.required.length;
      i += chunkSize
    ) {
      const requiredKeys = IGUHealthEnvironmentSchema.required.slice(
        i,
        i + chunkSize,
      );
      // do whatever
      const keysToCheck = await this._client.send(
        new GetParametersCommand({
          Names: requiredKeys.map((key) => namespace(this._namespace, key)),
          WithDecryption: false,
        }),
      );

      for (const requiredValue of requiredKeys) {
        const namespacedKey = namespace(this._namespace, requiredValue);
        if (
          !keysToCheck.Parameters?.some((param) => param.Name === namespacedKey)
        ) {
          throw new Error(`Required parameter '${namespacedKey}' is missing`);
        }
      }
    }
  }
}
