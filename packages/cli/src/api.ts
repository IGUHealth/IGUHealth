import { Command } from "commander";
import path from "node:path";

import httpClient from "@iguhealth/client/http";

import {
  CONFIG_LOCATION,
  Tenant,
  getCurrentTenant,
  loadConfig,
} from "./config.js";

function concatenateURLPaths(url: URL, urlPath: string) {
  return new URL(path.join(url.pathname, urlPath), url.origin);
}

function getTenantURL(apiOrigin: string, tenant: Tenant["id"]) {
  return concatenateURLPaths(new URL(apiOrigin), `/w/${tenant}`);
}

function getTenantAPIURL(
  apiOrigin: string,
  tenant: Tenant["id"],
  apiVersion = "v1",
) {
  return concatenateURLPaths(
    getTenantURL(apiOrigin, tenant),
    `/api/${apiVersion}`,
  );
}

function getFHIRAPIURL(
  apiOrigin: string,
  tenant: Tenant["id"],
  fhirVersion = "r4",
) {
  return concatenateURLPaths(
    getTenantAPIURL(apiOrigin, tenant),
    `/fhir/${fhirVersion}`,
  );
}

function configureAuthHeader(tenant: Tenant) {
  return {
    headers: {
      Authorization: `Basic ${btoa(`${tenant.auth.client_id}:${tenant.auth.client_secret}`)}`,
    },
  };
}

function createClient(rootURL: string, tenant: Tenant) {
  return httpClient({
    url: getFHIRAPIURL(rootURL, tenant.id).toString(),
    getAccessToken: async function () {
      const response = await fetch(
        concatenateURLPaths(getTenantAPIURL(rootURL, tenant.id), "/oidc/token"),
        {
          method: "POST",
          body: new URLSearchParams({
            grant_type: "client_credentials",
          }),
          ...configureAuthHeader(tenant),
        },
      );
      const data = await response.json();
      return data.access_token;
    },
  });
}

export function apiCommands(command: Command) {
  command
    .command("search")
    .description("Initializes the configuration file")
    .action(async () => {
      const config = loadConfig(CONFIG_LOCATION);
      const tenant = getCurrentTenant(CONFIG_LOCATION, config);
      if (!tenant)
        throw new Error("No tenant configured run config add-tenant.");
      const client = createClient(config.api_url, tenant);
      const values = await client.search_system({}, []);
      console.log(JSON.stringify(values, null, 2));
    });
}
