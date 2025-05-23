import AWSSSMConfigProvider from "./provider/aws-ssm.js";
import EnvironmentConfigProvider from "./provider/environment.js";
import { ConfigProvider } from "./provider/interface.js";

export type ConfigProviderType = "environment" | "aws-parameter";

export default function getConfigProvider(): ConfigProvider {
  const configType: ConfigProviderType =
    (process.env.CONFIG_PROVIDER as ConfigProviderType) ?? "environment";

  switch (configType) {
    case "environment": {
      return new EnvironmentConfigProvider();
    }
    case "aws-parameter": {
      const namespace = process.env.AWS_SSM_NAMESPACE ?? "iguhealth/";
      return new AWSSSMConfigProvider(namespace);
    }
    default:
      throw new Error(`Unknown config provider type: ${configType}`);
  }
}
