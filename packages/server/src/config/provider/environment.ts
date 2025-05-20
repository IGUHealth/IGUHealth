class EnvironmentConfigProvider {
  get(key: string): string | undefined {
    return process.env[key];
  }
}
