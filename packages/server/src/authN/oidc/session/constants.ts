import { ClientApplication } from "@iguhealth/fhir-types/r4/types";

export const USER_SESSION_KEY = "user";

export const GET_LAUNCH_SESSION_KEY = (
  client: ClientApplication,
  launchId: string,
) => `${client.id}/${launchId}`;
