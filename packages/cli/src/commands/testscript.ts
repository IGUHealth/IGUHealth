import { Command } from "commander";
import fs from "node:fs";
import path from "node:path";

import { FHIR_VERSION, Resource } from "@iguhealth/fhir-types/versions";
import * as ts from "@iguhealth/testscript_runner";

import { createClient } from "../client.js";
import { CONFIG_LOCATION } from "../config.js";

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

export function codeGenerationCommands(command: Command) {
  command
    .command("run")
    .description("Run testscript files against server.")
    .option("-d, --directory <directory>", "")
    .option("-e, --extension   <extension>", "")
    .option("--fhir-version <fhirVersion>", "4.0")
    .action(async (options) => {
      const files = getAllFiles(options.directory)
        .flat()
        .filter((f) => f.endsWith(options.extension))
        .sort((a, b) => a.localeCompare(b));

      for (const file of files) {
        const fileContents = fs.readFileSync(file);
        const json = JSON.parse(fileContents.toString("utf8"));
        if (json.resourceType === "Bundle") {
          const bundle = json as Resource<FHIR_VERSION, "Bundle">;
          const testscripts =
            bundle.entry
              ?.map((e) => e.resource)
              .filter(
                (r): r is Resource<FHIR_VERSION, "TestScript"> =>
                  r?.resourceType === "TestScript",
              ) ?? [];
          for (const testScript of testscripts) {
            const report = await ts.run(
              createClient(CONFIG_LOCATION),
              options.fhirVersion,
              testScript,
            );
            console.log(JSON.stringify(report));
          }
        } else if (json.resourceType === "TestScript") {
          const testScript = json as Resource<FHIR_VERSION, "TestScript">;
          const report = await ts.run(
            createClient(CONFIG_LOCATION),
            options.fhirVersion,
            testScript,
          );
          console.log(JSON.stringify(report));
        }
      }
    });
}
