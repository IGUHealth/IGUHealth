import { Command } from "commander";
import { readFileSync } from "fs";

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
  .command("generate-types")
  .description("Generates typescript types off profiles")
  .argument("<profiles...> <output>", "FHIR Version")
  .option("-v, --version <version>", "FHIR Profiles to use", "r4")
  .action((profiles, output, options) => {
    const bundles: Array<StructureDefinitionBundle> = profiles.map(
      (fileURI: string) =>
        JSON.parse(
          readFileSync(fileURI, "utf8")
    ))
    const structureDefinitions = bundles.flatMap((bundle) => bundle.entry.map(entry=> entry.resource));
    const types = generateTypes(options.version, structureDefinitions);
  });

program.parse();
