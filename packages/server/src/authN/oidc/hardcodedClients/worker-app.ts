import { ClientApplication } from "@iguhealth/fhir-types/lib/generated/r4/types";

/**
 * Worker client application.
 * Used for system-to-system communication within IGUHealth namely the asRoot.
 */
export const WORKER_APP = {
  meta: {
    versionId: "worker",
  },
  resourceType: "ClientApplication",
  id: "worker",
  grantType: ["client_credentials"],
  name: "IGUHealth Worker",
  responseTypes: "token",
  description:
    "Worker client application. Used for system-to-system communication within IGUHealth.",
} as ClientApplication;
