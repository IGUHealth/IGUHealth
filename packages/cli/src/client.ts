import { confirm } from "@inquirer/prompts";
import { Command } from "commander";
import fs from "node:fs";
import path from "node:path";

import httpClient from "@iguhealth/client/http";
import * as r4Sets from "@iguhealth/fhir-types/r4/sets";
import { Bundle, Resource, ResourceType } from "@iguhealth/fhir-types/r4/types";
import * as r4bSets from "@iguhealth/fhir-types/r4b/sets";
import { FHIR_VERSION, R4, R4B } from "@iguhealth/fhir-types/versions";

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

export function createClient(location: string) {
  const config = loadConfig(location);
  const tenant = getCurrentTenant(location, config);
  if (!tenant) throw new Error("No tenant configured run config add-tenant.");

  return httpClient({
    url: getTenantAPIURL(tenant.api_origin, tenant.id).toString(),
    getAccessToken: async function () {
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
      const data = await response.json();

      if (response.status >= 400) {
        throw new Error(JSON.stringify(data));
      }

      return data.access_token;
    },
  });
}
