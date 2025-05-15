type MigrationEvent = Record<string, unknown>;

export const handler = async (event: MigrationEvent): Promise<string> => {
  try {
    migrateAll;
    return "success";
  } catch {
    return "error";
  }
};
