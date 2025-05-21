import {
  ClientApplication,
  code,
  id,
} from "@iguhealth/fhir-types/lib/generated/r4/types";
import { TenantId } from "@iguhealth/jwt/types";

import { ConfigProvider } from "../../../config/provider/interface.js";

export async function ADMIN_APP(
  config: ConfigProvider,
): Promise<ClientApplication | undefined> {
  const redirectUri = await config.get("ADMIN_APP_REDIRECT_URI");
  return redirectUri
    ? ({
        resourceType: "ClientApplication",
        id: "admin-app" as id,
        grantType: ["authorization_code" as code, "refresh_token" as code],
        redirectUri: [redirectUri],
        name: "Admin Application",
        responseTypes: "code" as code,
        scope: "offline_access openid email profile fhirUser user/*.*",
      } as ClientApplication)
    : undefined;
}

export async function redirectURL(
  config: ConfigProvider,
  tenant: TenantId,
): Promise<string | undefined> {
  const adminApp = await ADMIN_APP(config);
  if (!adminApp) return undefined;
  return adminApp.redirectUri?.[0].replace("*", tenant) ?? undefined;
}
