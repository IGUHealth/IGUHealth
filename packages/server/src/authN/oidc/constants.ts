import { Issuer, TenantId } from "@iguhealth/jwt/types";

import { ConfigProvider } from "../../config/provider/interface.js";

export const JWKS_GET = "JWKS_GET";

export const OIDC_ROUTES = {
  LOGIN_GET: "tenant-oidc-interaction-login-get",
  LOGIN_POST: "tenant-oidc-interaction-login-post",
  LOGOUT_GET: "tenant-oidc-interaction-logout-get",
  LOGOUT_POST: "tenant-oidc-interaction-logout-post",
  SIGNUP_GET: "tenant-oidc-interaction-signup-get",
  SIGNUP_POST: "tenant-oidc-interaction-signup-post",
  PASSWORD_RESET_INITIATE_POST:
    "tenant-oidc-interaction-password-reset-initiate-post",
  PASSWORD_RESET_INITIATE_GET:
    "tenant-oidc-interaction-password-reset-initiate-get",
  PASSWORD_RESET_VERIFY_GET:
    "tenant-oidc-interaction-password-reset-verify-get",
  PASSWORD_RESET_VERIFY_POST:
    "tenant-oidc-interaction-password-reset-verify-post",
  AUTHORIZE_GET: "tenant-oidc-authorize-get",
  AUTHORIZE_POST: "tenant-oidc-authorize-post",
  SCOPE_POST: "tenant-oidc-scope-verify-post",
  SCOPE_GET: "tenant-oidc-scope-verify-get",
  TOKEN_POST: "tenant-oidc-token-post",
  TOKEN_INTROSPECTION_POST: "tenant-oidc-token-info-post",
  USER_INFO: "tenant-oidc-user-info",
  OIDC_DISCOVERY: "tenant-oidc-discovery",
  WELL_KNOWN_SMART: "tenant-oidc-well-known-smart",
  SMART_LAUNCH_GET: "tenant-oidc-smart-launch-get",
  // Federation
  FEDERATED_INITIATE: "tenant-oidc-federated-INITIATE",
  FEDERATED_CALLBACK: "tenant-oidc-federated-callback",
};

export function getIssuer(config: ConfigProvider, tenant: TenantId): Issuer {
  const issuer = new URL(`/w/${tenant}/oidc`, config.get("AUTH_ISSUER"))
    .href as Issuer;

  return issuer;
}
