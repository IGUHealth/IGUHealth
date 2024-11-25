import { Command } from "commander";
import { mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { generateIndexFile, loadArtifacts } from "@iguhealth/artifacts";
import { generateMetaData } from "@iguhealth/codegen/generate/meta-data";
import generateOps from "@iguhealth/codegen/generate/operation-definition";
import { generateSets } from "@iguhealth/codegen/generate/sets";
import { generateTypes } from "@iguhealth/codegen/generate/typescript-types";
import { StructureDefinition } from "@iguhealth/fhir-types/lib/generated/r4/types";
import {
  FHIR_VERSION,
  FHIR_VERSIONS_SUPPORTED,
  R4,
} from "@iguhealth/fhir-types/versions";
import { StructureDefinitionSnapshot } from "@iguhealth/generated-ops/lib/r4/ops";

import { createClient } from "../client.js";
import { CONFIG_LOCATION } from "../config.js";
import logger from "../logger.js";
import { conversion, getAllFiles } from "../utilities.js";

export function codeGenerationCommands(command: Command) {
  command
    .command("meta")
    .description("Generate metadata")
    .requiredOption("-o, --output <output>", "output file")
    .option("-v, --version <version>", "FHIR Profiles to use", R4)
    .action(async (options) => {
      const structureDefinitions = loadArtifacts({
        fhirVersion: options.version as FHIR_VERSION,
        resourceType: "StructureDefinition",
        packageLocation: path.join(fileURLToPath(import.meta.url), "../../../"),
      });

      mkdirSync(path.join(options.output, ".."), { recursive: true });
      const metadata = generateMetaData(structureDefinitions);

      writeFileSync(
        options.output,
        "// Do not this code is generated \nexport default " +
          JSON.stringify(metadata, null, 2),
      );
    });

  command
    .command("types-artifacts")
    .description("Generates typescript types off profiles")
    .option("-o, --output <output>", "output file")
    .option("-v, --version <version>", "FHIR Profiles to use", R4)
    .action((options) => {
      if (FHIR_VERSIONS_SUPPORTED.indexOf(options.version) === -1) {
        throw new Error(
          `${options.version} is not supported must be oneof ${JSON.stringify(FHIR_VERSIONS_SUPPORTED)}`,
        );
      }

      const structureDefinitions = loadArtifacts({
        fhirVersion: options.version as FHIR_VERSION,
        resourceType: "StructureDefinition",
        packageLocation: path.join(fileURLToPath(import.meta.url), "../../../"),
      });

      mkdirSync(options.output, { recursive: true });
      const generatedTypes = generateTypes(
        options.version,
        structureDefinitions,
      );
      const generatedSets = generateSets(options.version, structureDefinitions);

      writeFileSync(path.join(options.output, "types.ts"), generatedTypes);
      writeFileSync(path.join(options.output, "sets.ts"), generatedSets);
    });

  command
    .command("operations")
    .description("Generate Operation types and classes")
    .option("-o, --output <output>", "output file")
    .option("-v, --version <version>", "FHIR Profiles to use", R4)
    .action(async (options) => {
      if (options.version !== R4) {
        throw new Error("Currently only support r4");
      }

      const operationDefinitions = loadArtifacts({
        fhirVersion: options.version,
        resourceType: "OperationDefinition",
        packageLocation: path.join(fileURLToPath(import.meta.url), "../../../"),
      });

      mkdirSync(options.output, { recursive: true });

      const generatedOpCode = await generateOps(
        options.version,
        operationDefinitions,
      );

      writeFileSync(path.join(options.output, "ops.ts"), generatedOpCode);
    });

  command
    .command("index-file")
    .description("Generate a FHIR npm package index file ")
    .option("-p, --packagedir <packagedir>", "")
    .option("-r, --resources <resources>", "")
    .option("-i, --ignore   [ignore...]", "")
    .option("-e, --extension   <extension>", "")
    .action((options) => {
      const indexFile = generateIndexFile({
        root: options.packagedir,
        artifactLocations: [options.resources],
        ignore: options.ignore,
        extension: options.extension,
      });
      logger.info("generating index file");
      const indexLoc = path.join(options.packagedir, ".index.json");
      writeFileSync(indexLoc, JSON.stringify(indexFile, null, 2));
      logger.info(`index generated and saved at '${indexLoc}'`);
    });

  command
    .command("snapshot")
    .argument("<fhirVersion>", "FHIR Version")
    .description("Generate a snapshot of a StructureDefinition")
    .option(
      "-d, --directory <directory>",
      "Directory with artifacts to minimize.",
    )
    .action(async (userFHIRVersion, options) => {
      const FHIRVersion = conversion.asFHIRType(userFHIRVersion);

      const profileLocs: string[] = getAllFiles(options.directory).filter(
        (f) => !f.endsWith("min.json") && f.endsWith(".json"),
      );

      for (const profileLoc of profileLocs) {
        const fileContents = readFileSync(profileLoc);
        const profile = JSON.parse(fileContents.toString("utf8"));
        if (
          typeof profile === "object" &&
          profile.resourceType === "StructureDefinition"
        ) {
          const client = await createClient(CONFIG_LOCATION);
          if (
            !profile ||
            typeof profile !== "object" ||
            (profile as unknown as Record<string, unknown>)?.resourceType !==
              "StructureDefinition"
          ) {
            throw new Error("No StructureDefinition to generate snapshot.");
          }

          const sd = await client.invoke_type(
            StructureDefinitionSnapshot.Op,
            {},
            FHIRVersion,
            "StructureDefinition",
            {
              definition: profile as StructureDefinition,
            },
          );

          writeFileSync(profileLoc, JSON.stringify(sd, null, 2));
        }
      }
    });
}
