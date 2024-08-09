import { ClientApplication } from "@iguhealth/fhir-types/lib/generated/r4/types";

/**
 * System client application.
 * Used for system-to-system communication within IGUHealth namely the asRoot.
 */
export const SYSTEM_APP = {
  resourceType: "ClientApplication",
  id: "iguhealth",
  grantType: ["client_credentials"],
  name: "IGUHealth System",
  responseTypes: "token",
  description:
    "System client application. Used for system-to-system communication within IGUHealth.",
} as ClientApplication;
