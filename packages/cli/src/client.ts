import path from "node:path";

import httpClient from "@iguhealth/client/http";

import { Tenant, getCurrentTenant, loadConfig } from "./config.js";

function concatenateURLPaths(url: URL, urlPath: string) {
  return new URL(path.join(url.pathname, urlPath), url.origin);
}

function getTenantURL(apiOrigin: string, tenant: Tenant["id"]) {
  return concatenateURLPaths(new URL(apiOrigin), `/w/${tenant}`);
}

function getTenantAPIURL(apiOrigin: string, tenant: Tenant["id"]) {
  return getTenantURL(apiOrigin, tenant);
}

function configureAuthHeader(tenant: Tenant) {
  return {
    headers: {
      Authorization: `Basic ${btoa(`${tenant.auth.client_id}:${tenant.auth.client_secret}`)}`,
    },
  };
}

type TokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

function isTokenResponseValid(
  timeReceived: number,
  tokenResponse: TokenResponse | undefined,
  // Auto setting window to 10 minutes.
  window: number = 600,
) {
  if (!tokenResponse) return false;
  const curSeconds = new Date().getTime() / 1000;

  return curSeconds - timeReceived < tokenResponse.expires_in - window;
}

export function createClient(location: string) {
  const config = loadConfig(location);
  const tenant = getCurrentTenant(location, config);
  if (!tenant) throw new Error("No tenant configured run config add-tenant.");

  let accessTokenResponse: TokenResponse | undefined = undefined;
  let timeSent = new Date().getTime() / 1000;

  return httpClient({
    url: getTenantAPIURL(tenant.api_origin, tenant.id).toString(),
    getAccessToken: async function () {
      if (
        accessTokenResponse &&
        isTokenResponseValid(timeSent, accessTokenResponse)
      ) {
        return accessTokenResponse.access_token;
      }

      timeSent = new Date().getTime() / 1000;
      const response = await fetch(
        concatenateURLPaths(
          getTenantURL(tenant.api_origin, tenant.id),
          "/oidc/auth/token",
        ),
        {
          method: "POST",
          body: new URLSearchParams({
            grant_type: "client_credentials",
          }),
          ...configureAuthHeader(tenant),
        },
      );

      accessTokenResponse = await response.json();

      if (response.status >= 400) {
        throw new Error(JSON.stringify(accessTokenResponse));
      }
      if (!accessTokenResponse) {
        throw new Error("No access token received");
      }

      return accessTokenResponse.access_token;
    },
  });
}
