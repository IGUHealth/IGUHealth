import { migrateAll } from "@iguhealth/server/migration";

type MigrationEvent = Record<string, unknown>;

export const handler = async (event: MigrationEvent): Promise<string> => {
  try {
    await migrateAll();
    return "success";
  } catch {
    return "error";
  }
};
