import { Command } from "commander";
import fs from "node:fs";
import path from "node:path";

import {
  AllResourceTypes,
  FHIR_VERSION,
  VersionedAResource,
} from "@iguhealth/fhir-types/versions";

function getAllFiles(directory: string): string[] {
  const files: string[] = [];
  const filesInDirectory = fs.readdirSync(directory);
  for (const file of filesInDirectory) {
    const absolute = path.join(directory, file);
    if (fs.statSync(absolute).isDirectory()) {
      files.push(...getAllFiles(absolute));
    } else {
      files.push(absolute);
    }
  }
  return files;
}

function minimizeResource<
  Resource extends VersionedAResource<FHIR_VERSION, AllResourceTypes>,
>(resource: Resource): Resource {
  switch (resource.resourceType) {
    case "StructureDefinition": {
      const minimizedSd = {
        id: resource.id,
        resourceType: resource.resourceType,
        name: resource.name,
        title: resource.title,
        abstract: resource.abstract,
        url: resource.url,
        version: resource.version,
        context: resource.context,
        type: resource.type,
        baseDefinition: resource.baseDefinition,
        kind: resource.kind,
        derivation: resource.derivation,
        status: resource.status,
        snapshot: {
          element:
            resource.snapshot?.element?.map((element) => {
              delete element["mapping"];
              return element;
            }) ?? [],
        },
      };
      return minimizedSd as Resource;
    }
    case "ValueSet": {
      return resource;
    }
    case "CodeSystem": {
      return resource;
    }
    case "OperationDefinition": {
      return resource;
    }
    default: {
      return resource;
    }
  }
}

/**
 * Minimize artifacts Namely StructureDefinition, OperationDefinition, ValueSet, CodeSystem
 */
export function minimizeCommands(command: Command) {
  command
    .command("artifacts")
    .description("Minimize Artifacts (Will output as [filename].min.json)")
    .option("-d, --directory <output>", "Directory with artifacts to minimize.")
    .action((options) => {
      const directory = options.directory;
      const files = getAllFiles(directory).filter(
        (f) => !f.endsWith("min.json") && f.endsWith(".json"),
      );
      for (const file of files) {
        const fileContents = fs.readFileSync(file);
        const json = JSON.parse(fileContents.toString("utf8"));
        if (json.resourceType === "Bundle") {
          const bundle = json as VersionedAResource<FHIR_VERSION, "Bundle">;
          fs.writeFileSync(
            file.replace(".json", ".min.json"),
            JSON.stringify({
              ...bundle,
              entry: bundle.entry?.map((e) => {
                if (e.resource) {
                  e.resource = minimizeResource(e.resource);
                }

                return e;
              }),
            }),
          );
        } else if (json.resourceType) {
          fs.writeFileSync(
            file.replace(".json", ".min.json"),
            JSON.stringify(
              minimizeResource(
                json as VersionedAResource<FHIR_VERSION, AllResourceTypes>,
              ),
            ),
          );
        }
      }
    });
}
