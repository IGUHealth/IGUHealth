import { confirm } from "@inquirer/prompts";
import { Command } from "commander";
import fs from "node:fs";

import * as r4Sets from "@iguhealth/fhir-types/r4/sets";
import { Bundle, Resource, ResourceType } from "@iguhealth/fhir-types/r4/types";
import * as r4bSets from "@iguhealth/fhir-types/r4b/sets";
import { FHIR_VERSION, R4, R4B } from "@iguhealth/fhir-types/versions";

import { createClient } from "../client.js";
import { CONFIG_LOCATION } from "../config.js";

function validateResourceType(
  fhirVersion: FHIR_VERSION,
  resourceType: string,
): resourceType is ResourceType {
  switch (fhirVersion) {
    case R4: {
      return r4Sets.resourceTypes.has(resourceType);
    }
    case R4B: {
      return r4bSets.resourceTypes.has(resourceType);
    }
  }
}

function asFHIRType(fhirType: string): FHIR_VERSION {
  switch (fhirType) {
    case "r4":
    case R4: {
      return R4;
    }
    case "r4b":
    case R4B: {
      return R4B;
    }
    default: {
      throw new Error(
        "invalid FHIR version must be 'r4' or 'r4b' or '4.3' or '4.0'",
      );
    }
  }
}

function dataCommand(command: Command) {
  command
    .option("-f, --file <file>", "File for resource")
    .option("-d, --data <data>", "Data for resource");
  return command;
}

type MutationOptions = { file?: string; data?: string };

function readData(option: MutationOptions): unknown {
  if (option.file) {
    return JSON.parse(fs.readFileSync(option.file, "utf-8"));
  }

  if (option.data) {
    return JSON.parse(option.data);
  }
  throw new Error("No resource provided");
}

function isBundle(value: unknown): value is Bundle {
  return (value as Record<string, unknown>)?.resourceType === "Bundle";
}

export function apiCommands(command: Command) {
  command
    .command("capabilities")
    .argument("<fhirVersion>", "FHIR Version")
    .action(async (userFHIRVersion) => {
      const client = createClient(CONFIG_LOCATION);
      const FHIRVersion = asFHIRType(userFHIRVersion);
      const capabilities = await client.capabilities({}, FHIRVersion);
      console.log(JSON.stringify(capabilities, null, 2));
    });

  dataCommand(
    command
      .command("create")
      .argument("<fhirVersion>", "FHIR Version")
      .action(async (userFHIRVersion, options) => {
        const resourceToSave = readData(options);
        const client = createClient(CONFIG_LOCATION);
        const FHIRVersion = asFHIRType(userFHIRVersion);

        if (!resourceToSave) {
          throw new Error("No resource provided to save");
        }
        const resource = await client.create(
          {},
          FHIRVersion,
          resourceToSave as Resource,
        );
        console.log(JSON.stringify(resource, null, 2));
      }),
  );

  dataCommand(
    command
      .command("update")
      .argument("<fhirVersion>", "FHIR Version")
      .argument("<resourceType>", "Resource Type")
      .argument("<id>", "Resource ID")
      .action(async (userFHIRVersion, resourceType, id, options) => {
        const FHIRVersion = asFHIRType(userFHIRVersion);
        if (!validateResourceType(FHIRVersion, resourceType))
          throw new Error("Invalid resource type");

        const resourceToSave = readData(options);
        const client = createClient(CONFIG_LOCATION);
        if (!resourceToSave) {
          throw new Error("No resource provided to save");
        }

        const resource = await client.update(
          {},
          FHIRVersion,
          resourceType,
          id,
          resourceToSave as Resource,
        );
        console.log(JSON.stringify(resource, null, 2));
      }),
  );

  dataCommand(
    command
      .command("batch")
      .argument("<fhirVersion>", "FHIR Version")
      .action(async (userFHIRVersion, options) => {
        const batchBundle = readData(options);
        const client = createClient(CONFIG_LOCATION);
        const FHIRVersion = asFHIRType(userFHIRVersion);
        if (!batchBundle) {
          throw new Error("No resource provided to save");
        }
        if (!isBundle(batchBundle))
          throw new Error("invalid resource type must be a 'Bundle'.");
        const resource = await client.batch({}, FHIRVersion, batchBundle);
        console.log(JSON.stringify(resource, null, 2));
      }),
  );

  dataCommand(
    command
      .command("transaction")
      .argument("<fhirVersion>", "FHIR Version")
      .action(async (userFHIRVersion, options) => {
        const transaction = readData(options);
        const client = createClient(CONFIG_LOCATION);
        const FHIRVersion = asFHIRType(userFHIRVersion);
        if (!transaction) {
          throw new Error("No resource provided to save");
        }
        if (!isBundle(transaction))
          throw new Error("invalid resource type must be a 'Bundle'.");
        const resource = await client.transaction({}, FHIRVersion, transaction);
        console.log(JSON.stringify(resource, null, 2));
      }),
  );

  dataCommand(
    command
      .command("patch")
      .argument("<fhirVersion>", "FHIR Version")
      .argument("<resourceType>", "Resource Type")
      .argument("<id>", "Resource ID")
      .action(async (userFHIRVersion, resourceType, id, options) => {
        const patches = readData(options);
        const client = createClient(CONFIG_LOCATION);
        const FHIRVersion = asFHIRType(userFHIRVersion);

        if (!validateResourceType(FHIRVersion, resourceType))
          throw new Error("Invalid resource type");

        if (!patches) {
          throw new Error("No patches provided.");
        }

        const resource = await client.patch(
          {},
          FHIRVersion,
          resourceType,
          id,
          patches,
        );
        console.log(JSON.stringify(resource, null, 2));
      }),
  );

  command
    .command("delete")
    .argument("<fhirVersion>", "FHIR Version")
    .argument("<resourceType>", "Resource Type")
    .argument("<id>", "Resource ID")
    .action(async (userFHIRVersion, resourceType, id) => {
      const client = createClient(CONFIG_LOCATION);
      const FHIRVersion = asFHIRType(userFHIRVersion);

      if (!validateResourceType(FHIRVersion, resourceType))
        throw new Error("Invalid resource type");

      const shouldDelete = await confirm({
        message: "Are you sure you want to delete this resource?",
      });

      if (shouldDelete) {
        await client.delete_instance({}, FHIRVersion, resourceType, id);
        console.log("Resource has been deleted.");
      }
    });

  command
    .command("search_system")
    .argument("<fhirVersion>", "FHIR Version")
    .argument("[query]", "query")
    .action(async (userFHIRVersion, query: string | undefined) => {
      const client = createClient(CONFIG_LOCATION);
      const FHIRVersion = asFHIRType(userFHIRVersion);

      const searchResponse = await client.search_system(
        {},
        FHIRVersion,
        query ?? "",
      );
      console.log(JSON.stringify(searchResponse, null, 2));
    });

  command
    .command("search_type")
    .argument("<fhirVersion>", "FHIR Version")
    .argument("<resourceType>", "Resource Type")
    .argument("[query]", "query")
    .action(
      async (
        userFHIRVersion,
        resourceType: string,
        query: string | undefined,
      ) => {
        const client = createClient(CONFIG_LOCATION);
        const FHIRVersion = asFHIRType(userFHIRVersion);

        if (!validateResourceType(FHIRVersion, resourceType))
          throw new Error("Invalid resource type");
        const searchResponse = await client.search_type(
          {},
          FHIRVersion,
          resourceType,
          query ?? "",
        );
        console.log(JSON.stringify(searchResponse, null, 2));
      },
    );
  command
    .command("read")
    .argument("<fhirVersion>", "FHIR Version")
    .argument("<resourceType>", "Resource Type")
    .argument("<id>", "Resource ID")
    .action(async (userFHIRVersion, resourceType, id) => {
      const client = createClient(CONFIG_LOCATION);
      const FHIRVersion = asFHIRType(userFHIRVersion);

      if (!validateResourceType(FHIRVersion, resourceType))
        throw new Error("Invalid resource type");

      const resource = await client.read({}, FHIRVersion, resourceType, id);
      console.log(JSON.stringify(resource, null, 2));
    });
  command
    .command("vread")
    .argument("<fhirVersion>", "FHIR Version")
    .argument("<resourceType>", "Resource Type")
    .argument("<id>", "Resource ID")
    .argument("<versionId>", "Resource version ID")
    .action(async (userFHIRVersion, resourceType, id, versionId) => {
      const client = createClient(CONFIG_LOCATION);
      const FHIRVersion = asFHIRType(userFHIRVersion);

      if (!validateResourceType(FHIRVersion, resourceType))
        throw new Error("Invalid resource type");

      const resourceVersion = await client.vread(
        {},
        FHIRVersion,
        resourceType,
        id,
        versionId,
      );
      console.log(JSON.stringify(resourceVersion, null, 2));
    });

  command
    .command("history_system")
    .argument("<fhirVersion>", "FHIR Version")
    .action(async (userFHIRVersion) => {
      const client = createClient(CONFIG_LOCATION);
      const FHIRVersion = asFHIRType(userFHIRVersion);

      const history = await client.history_system({}, FHIRVersion);
      console.log(JSON.stringify(history, null, 2));
    });

  command
    .command("history_type")
    .argument("<fhirVersion>", "FHIR Version")
    .argument("<resourceType>", "Resource Type")
    .action(async (userFHIRVersion, resourceType) => {
      const client = createClient(CONFIG_LOCATION);
      const FHIRVersion = asFHIRType(userFHIRVersion);

      if (!validateResourceType(FHIRVersion, resourceType))
        throw new Error("Invalid resource type");
      const history = await client.history_type({}, FHIRVersion, resourceType);
      console.log(JSON.stringify(history, null, 2));
    });

  command
    .command("history_instance")
    .argument("<fhirVersion>", "FHIR Version")
    .argument("<resourceType>", "Resource Type")
    .argument("<id>", "Resource ID")
    .action(async (userFHIRVersion, resourceType, id) => {
      const client = createClient(CONFIG_LOCATION);
      const FHIRVersion = asFHIRType(userFHIRVersion);

      if (!validateResourceType(FHIRVersion, resourceType))
        throw new Error("Invalid resource type");
      const history = await client.history_instance(
        {},
        FHIRVersion,
        resourceType,
        id,
      );
      console.log(JSON.stringify(history, null, 2));
    });
}
