import { Command } from "commander";
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import path from "path";
import resourceSDs from "@genfhi/artifacts/r4/profiles-resources.json";
import typeSDs from "@genfhi/artifacts/r4/profiles-types.json";

import { generateSets } from "./isGeneration";
import { generateTypes } from "./typeGeneration";
import { StructureDefinition } from "@genfhi/fhir-types/r4/types";

interface StructureDefinitionBundle {
  resourceType: "Bundle";
  entry: Array<{ resource: StructureDefinition }>;
}

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
    // Quick hack for generation
    const bundles = [
      resourceSDs as StructureDefinitionBundle,
      typeSDs as StructureDefinitionBundle,
    ];

    const structureDefinitions = bundles.flatMap((bundle) =>
      bundle.entry.map((entry) => entry.resource)
    );
    mkdirSync(options.output, { recursive: true });
    const generatedTypes = generateTypes(options.version, structureDefinitions);
    const generatedSets = generateSets(options.version, structureDefinitions);

    writeFileSync(path.join(options.output, "types.d.ts"), generatedTypes);
    writeFileSync(path.join(options.output, "sets.ts"), generatedSets);
  });

program.parse();
