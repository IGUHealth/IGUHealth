import {
  ClientApplication,
  code,
  id,
} from "@iguhealth/fhir-types/lib/r4/types";

export const ADMIN_APP: ClientApplication | undefined = process.env
  .ADMIN_APP_REDIRECT_URI
  ? ({
      resourceType: "ClientApplication",
      id: "admin-app" as id,
      grantType: "authorization_code" as code,
      tokenEndpointAuthMethod: "authorization_code" as code,
      redirectUri: [process.env.ADMIN_APP_REDIRECT_URI],
      name: "Admin Application",
      responseTypes: "code" as code,
    } as ClientApplication)
  : undefined;
