import { Command } from "commander";
import { writeFileSync, mkdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { loadArtifacts, generateIndexFile } from "@iguhealth/artifacts";

import { generateSets, generateTypes, generateOps } from "@iguhealth/codegen";

const program = new Command();
program
  .name("FHIR Code Generation")
  .description("CLI to generate code based off fhir artifacts.")
  .version("0.8.0");

program
  .command("generate-types-artifacts")
  .description("Generates typescript types off profiles")
  .option("-o, --output <output>", "output file")
  .option("-v, --version <version>", "FHIR Profiles to use", "r4")
  .action((options) => {
    if (options.version !== "r4") {
      throw new Error("Currently only support r4");
    }
    const structureDefinitions = loadArtifacts(
      "StructureDefinition",
      path.join(fileURLToPath(import.meta.url), "../../")
    );

    mkdirSync(options.output, { recursive: true });
    const generatedTypes = generateTypes(options.version, structureDefinitions);
    const generatedSets = generateSets(options.version, structureDefinitions);

    writeFileSync(path.join(options.output, "types.ts"), generatedTypes);
    writeFileSync(path.join(options.output, "sets.ts"), generatedSets);
  });

program
  .command("generate-operations")
  .description("Generate Operation types and classes")
  .option("-o, --output <output>", "output file")
  .option("-v, --version <version>", "FHIR Profiles to use", "r4")
  .action(async (options) => {
    if (options.version !== "r4") {
      throw new Error("Currently only support r4");
    }
    const operationDefinitions = loadArtifacts(
      "OperationDefinition",
      path.join(fileURLToPath(import.meta.url), "../../")
    );

    mkdirSync(options.output, { recursive: true });

    const generatedOpCode = await generateOps(
      options.version,
      operationDefinitions
    );

    writeFileSync(path.join(options.output, "ops.ts"), generatedOpCode);
  });

program
  .command("generate-index-file")
  .description("Generate a FHIR npm package index file ")
  .option("-p, --packagedir <packagedir>", "")
  .option("-r, --resources <resources>", "")
  .option("-i, --ignore   [ignore...]", "")
  .action((options) => {
    const indexFile = generateIndexFile(
      options.packagedir,
      [options.resources],
      options.ignore
    );
    console.log("generating index file");
    const indexLoc = path.join(options.packagedir, ".index.config.json");
    writeFileSync(indexLoc, JSON.stringify(indexFile, null, 2));
    console.log(`index generated and saved at '${indexLoc}'`);
  });

program.parse();
