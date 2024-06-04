export const USER_SESSION_KEY = "user";
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
  TOKEN_POST: "tenant-oidc-token-post",
  USER_INFO: "tenant-oidc-user-info",
  OIDC_DISCOVERY: "tenant-oidc-discovery",
};
