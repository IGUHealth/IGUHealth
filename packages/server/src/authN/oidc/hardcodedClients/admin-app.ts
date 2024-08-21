import {
  ClientApplication,
  code,
  id,
} from "@iguhealth/fhir-types/lib/generated/r4/types";
import { TenantId } from "@iguhealth/jwt/types";

export function ADMIN_APP(): ClientApplication | undefined {
  return process.env.ADMIN_APP_REDIRECT_URI
    ? ({
        resourceType: "ClientApplication",
        id: "admin-app" as id,
        grantType: ["authorization_code" as code, "refresh_token" as code],
        redirectUri: [process.env.ADMIN_APP_REDIRECT_URI],
        name: "Admin Application",
        responseTypes: "code" as code,
      } as ClientApplication)
    : undefined;
}

export function redirectURL(tenant: TenantId): string | undefined {
  const adminApp = ADMIN_APP();
  if (!adminApp) return undefined;
  return adminApp.redirectUri?.[0].replace("*", tenant) ?? undefined;
}
