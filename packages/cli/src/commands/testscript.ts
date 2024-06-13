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

async function executeTestScript<Version extends FHIR_VERSION>(
  outputDir: string,
  fhirVersion: Version,
  testScript: Resource<Version, "TestScript">,
): Promise<Resource<Version, "TestReport">> {
  const report = await ts.run(
    createClient(CONFIG_LOCATION),
    fhirVersion,
    testScript,
  );

  const output = path.join(
    outputDir,
    `${testScript.id ?? new Date().toString()}.testreport.json`,
  );

  fs.writeFileSync(output, JSON.stringify(report, null, 2));

  return report;
}

export function testscriptCommands(command: Command) {
  command
    .command("run")
    .description("Run testscript files against server.")
    .requiredOption("-i, --input <input>")
    .requiredOption("-o --output <output>", "Where to output files")
    .option(
      "-e, --extension   <extension>",
      "Extensions to search for tests",
      ".testscript.json",
    )
    .option("--fhir-version <fhirVersion>", "FHIR Version to use", "4.0")

    .action(async (options) => {
      const files = getAllFiles(options.input)
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
            await executeTestScript(
              options.output,
              options.fhirVersion,
              testScript,
            );
          }
        } else if (json.resourceType === "TestScript") {
          const testScript = json as Resource<FHIR_VERSION, "TestScript">;
          await executeTestScript(
            options.output,
            options.fhirVersion,
            testScript,
          );
        }
      }
    });
}
