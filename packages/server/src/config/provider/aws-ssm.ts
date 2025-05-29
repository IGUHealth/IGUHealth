import { GetParameterCommand, SSMClient } from "@aws-sdk/client-ssm";

import type { ConfigSchema } from "../../json-schemas/schemas/config.schema.js";
import { ConfigProvider } from "./interface.js";

export default class AWSSSMConfigProvider implements ConfigProvider {
  private readonly _namespace: string;
  private readonly _client: SSMClient;
  constructor(namespace: string) {
    this._namespace = namespace;
    this._client = new SSMClient({
      region: process.env.AWS_REGION,
    });
  }
  async get<K extends keyof ConfigSchema>(key: K): Promise<ConfigSchema[K]> {
    const namespacedKey = `${this._namespace}${key}`;
    try {
      const response = await this._client.send(
        new GetParameterCommand({ Name: namespacedKey, WithDecryption: true }),
      );

      const value = response.Parameter?.Value as ConfigSchema[K] | undefined;

      if (value === undefined) {
        throw new Error(`Parameter ${namespacedKey} not found`);
      }

      return value;
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to get parameter ${namespacedKey}: ${error}`);
    }
  }
}
