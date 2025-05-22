import type { ConfigSchema } from "../../json-schemas/schemas/config.schema.js";
import { ConfigProvider } from "./interface.js";

export default class AWSSSMConfigProvider implements ConfigProvider {
  private readonly _port: string;
  private readonly _namespace: string;
  constructor(namespace: string, port = "2773") {
    this._namespace = namespace;
    this._port = port;
  }
  async get<K extends keyof ConfigSchema>(key: K): Promise<ConfigSchema[K]> {
    const namespacedKey = `${this._namespace}${key}`;

    const response = await fetch(
      `http://localhost:${this._port}/secretsmanager/get?secretId=${namespacedKey}`,
      {
        method: "GET",
        headers: {
          "X-Aws-Parameters-Secrets-Token": process.env.AWS_SESSION_TOKEN,
        } as Record<string, string>,
      },
    ).then((r) => r.json());

    return response["SecretString"] as ConfigSchema[K];
  }
}
