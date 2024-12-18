import { ClientApplication } from "@iguhealth/fhir-types/lib/generated/r4/types";

/**
 * Worker client application.
 * Used for system-to-system communication within IGUHealth namely the asRoot.
 */
export const PUBLIC_APP = {
  resourceType: "ClientApplication",
  id: "public",
  meta: {
    versionId: "public",
  },
  grantType: ["client_credentials"],
  // Used for public access if API is set to open.
  name: "Public access",
  responseTypes: "token",
  description:
    "If app is allowing public access then this client application is used.",
} as ClientApplication;
