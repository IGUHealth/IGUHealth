import EnvironmentConfigProvider from "./provider/environment.js";
import { ConfigProvider } from "./provider/interface.js";

type ConfigProviderType = "environment" | "aws-parameter";

export default function getConfigProvider(
  type: ConfigProviderType,
): ConfigProvider {
  switch (type) {
    case "environment":
      return new EnvironmentConfigProvider();
    case "aws-parameter":
    default:
      throw new Error(`Unknown config provider type: ${type}`);
  }
}
