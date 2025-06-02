import { migrateAll } from "@iguhealth/server/migration";

type MigrationEvent = Record<string, unknown>;

export const handler = async (event: MigrationEvent): Promise<string> => {
  await migrateAll();
  return "success";
};
