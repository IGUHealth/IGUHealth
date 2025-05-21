import {
  ClientApplication,
  code,
  id,
} from "@iguhealth/fhir-types/lib/generated/r4/types";
import { TenantId } from "@iguhealth/jwt/types";

import { ConfigProvider } from "../../../config/provider/interface.js";

export function ADMIN_APP(
  config: ConfigProvider,
): ClientApplication | undefined {
  return config.get("ADMIN_APP_REDIRECT_URI")
    ? ({
        resourceType: "ClientApplication",
        id: "admin-app" as id,
        grantType: ["authorization_code" as code, "refresh_token" as code],
        redirectUri: [config.get("ADMIN_APP_REDIRECT_URI")],
        name: "Admin Application",
        responseTypes: "code" as code,
        scope: "offline_access openid email profile fhirUser user/*.*",
      } as ClientApplication)
    : undefined;
}

export function redirectURL(
  config: ConfigProvider,
  tenant: TenantId,
): string | undefined {
  const adminApp = ADMIN_APP(config);
  if (!adminApp) return undefined;
  return adminApp.redirectUri?.[0].replace("*", tenant) ?? undefined;
}
