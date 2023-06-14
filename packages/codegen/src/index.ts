import { Command } from "commander";
import { readFileSync, writeFileSync } from "fs";
import resourceSDs from "@genfhi/artifacts/r4/profiles-resources.json";
import typeSDs from "@genfhi/artifacts/r4/profiles-types.json";

import { generateTypes, StructureDefinition } from "./typeGeneration";

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
  .command("generate-types-files")
  .description("Generates typescript types off profiles")
  .argument("<profiles...>", "FHIR profiles to use")
  .option("-o, --output <output>", "output file", "types.d.ts")
  .option("-v, --version <version>", "FHIR Profiles to use", "r4")
  .action((profiles, options) => {
    if (options.version !== "r4") {
      throw new Error("Currently only support r4");
    }
    const bundles: Array<StructureDefinitionBundle> = profiles.map(
      (fileURI: string) => JSON.parse(readFileSync(fileURI, "utf8"))
    );

    const structureDefinitions = bundles.flatMap((bundle) =>
      bundle.entry.map((entry) => entry.resource)
    );
    const types = generateTypes(options.version, structureDefinitions);
    writeFileSync(options.output, types);
  });

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
      resourceSDs as unknown as StructureDefinitionBundle,
      typeSDs as unknown as StructureDefinitionBundle,
    ];

    const structureDefinitions = bundles.flatMap((bundle) =>
      bundle.entry.map((entry) => entry.resource)
    );
    const types = generateTypes(options.version, structureDefinitions);
    writeFileSync(options.output, types);
  });

program.parse();
