import { confirm } from "@inquirer/prompts";
import { Command } from "commander";
import path from "node:path";

import httpClient from "@iguhealth/client/http";
import { resourceTypes } from "@iguhealth/fhir-types/r4/sets";
import { ResourceType } from "@iguhealth/fhir-types/r4/types";

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

function validateResourceType(
  resourceType: string,
): resourceType is ResourceType {
  return resourceTypes.has(resourceType);
}

function createClient(location: string) {
  const config = loadConfig(location);
  const tenant = getCurrentTenant(location, config);
  if (!tenant) throw new Error("No tenant configured run config add-tenant.");

  return httpClient({
    url: getFHIRAPIURL(config.api_url, tenant.id).toString(),
    getAccessToken: async function () {
      const response = await fetch(
        concatenateURLPaths(
          getTenantAPIURL(config.api_url, tenant.id),
          "/oidc/token",
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
      return data.access_token;
    },
  });
}

export function apiCommands(command: Command) {
  command.command("capabilities").action(async () => {
    const client = createClient(CONFIG_LOCATION);
    const capabilities = await client.capabilities({});
    console.log(JSON.stringify(capabilities, null, 2));
  });

  command
    .command("delete")
    .argument("<resourceType>", "Resource Type")
    .argument("<id>", "Resource ID")
    .action(async (resourceType, id) => {
      const client = createClient(CONFIG_LOCATION);

      if (!validateResourceType(resourceType))
        throw new Error("Invalid resource type");

      const shouldDelete = await confirm({
        message: "Are you sure you want to delete this resource?",
      });

      if (shouldDelete) {
        await client.delete({}, resourceType, id);
        console.log("Resource has been deleted.");
      }
    });

  command
    .command("search_system")
    .argument("[query]", "query")
    .description("Initializes the configuration file")
    .action(async (query: string | undefined) => {
      const client = createClient(CONFIG_LOCATION);
      const searchResponse = await client.search_system({}, query);
      console.log(JSON.stringify(searchResponse, null, 2));
    });

  command
    .command("search_type")
    .argument("<resourceType>", "Resource Type")
    .argument("[query]", "query")
    .description("Initializes the configuration file")
    .action(async (resourceType: string, query: string | undefined) => {
      const client = createClient(CONFIG_LOCATION);
      if (!validateResourceType(resourceType))
        throw new Error("Invalid resource type");
      const searchResponse = await client.search_type({}, resourceType, query);
      console.log(JSON.stringify(searchResponse, null, 2));
    });
  command
    .command("read")
    .argument("<resourceType>", "Resource Type")
    .argument("<id>", "Resource ID")
    .action(async (resourceType, id) => {
      const client = createClient(CONFIG_LOCATION);
      if (!validateResourceType(resourceType))
        throw new Error("Invalid resource type");
      const resource = await client.read({}, resourceType, id);
      console.log(JSON.stringify(resource, null, 2));
    });
  command
    .command("vread")
    .argument("<resourceType>", "Resource Type")
    .argument("<id>", "Resource ID")
    .argument("<versionId>", "Resource version ID")
    .action(async (resourceType, id, versionId) => {
      const client = createClient(CONFIG_LOCATION);
      if (!validateResourceType(resourceType))
        throw new Error("Invalid resource type");
      const resourceVersion = await client.vread(
        {},
        resourceType,
        id,
        versionId,
      );
      console.log(JSON.stringify(resourceVersion, null, 2));
    });

  command.command("history_system").action(async () => {
    const client = createClient(CONFIG_LOCATION);
    const history = await client.historySystem({});
    console.log(JSON.stringify(history, null, 2));
  });

  command
    .command("history_type")
    .argument("<resourceType>", "Resource Type")
    .action(async (resourceType) => {
      const client = createClient(CONFIG_LOCATION);
      if (!validateResourceType(resourceType))
        throw new Error("Invalid resource type");
      const history = await client.historyType({}, resourceType);
      console.log(JSON.stringify(history, null, 2));
    });

  command
    .command("history_instance")
    .argument("<resourceType>", "Resource Type")
    .argument("<id>", "Resource ID")
    .action(async (resourceType, id) => {
      const client = createClient(CONFIG_LOCATION);
      if (!validateResourceType(resourceType))
        throw new Error("Invalid resource type");
      const history = await client.historyInstance({}, resourceType, id);
      console.log(JSON.stringify(history, null, 2));
    });
}
