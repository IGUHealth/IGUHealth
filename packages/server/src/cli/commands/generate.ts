import { loadArtifacts } from "@iguhealth/artifacts";
import {
  FHIR_VERSION,
  R4,
  R4B,
  Resource,
} from "@iguhealth/fhir-types/versions";
import { Command } from "commander";
import { glob } from "glob";
import { compileFromFile } from "json-schema-to-typescript";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  generateSP1TSCode,
  generateSP1Sets,
  generateSP1SQLTable,
} from "../generate/sp1-parameters.js";

function generateReadme() {
  const schema = JSON.parse(
    readFileSync("src/json-schemas/schemas/environment.schema.json", "utf-8"),
  );

  const required = schema.required || [];

  const md = `
# Environment Variables
| name | description | required | defaults |
|------|-------------|----------|----------|
${Object.keys(schema.properties)
  .map((k) => {
    const prop = schema.properties[k];
    return `| ${k} | ${prop.description || ""} | ${required.includes(k)} | ${prop.default || ""} |`;
  })
  .join("\n")}`;

  writeFileSync("README.md", md);
}

async function generateTypes() {
  const schemaFiles = await glob("src/**/*.schema.json");
  await Promise.all(
    schemaFiles.map(async (schemaFile) => {
      const ts = await compileFromFile(schemaFile);
      writeFileSync(schemaFile.replace(".schema.json", ".schema.d.ts"), ts);
    }),
  );
}

const writeSP1TSCode = async <Version extends FHIR_VERSION>(
  version: Version,
  output: string,
  parameterURLSet: Set<string>,
  parameters: Resource<Version, "SearchParameter">[],
) => {
  mkdirSync(path.join(output, ".."), { recursive: true });

  const sp1ParameterCode = await generateSP1TSCode(
    version,
    parameterURLSet,
    parameters,
  );

  writeFileSync(output, sp1ParameterCode);
};

const generateSP1Typescript: Parameters<Command["action"]>[0] = async (
  options,
) => {
  const r4SearchParameters = loadArtifacts({
    fhirVersion: R4,
    resourceType: "SearchParameter",
    packageLocation: path.join(fileURLToPath(import.meta.url), "../../../../"),
  }).filter(
    (p) =>
      p.expression !== undefined &&
      p.type !== "special" &&
      p.type !== "composite",
  );

  const r4bSearchParameters = loadArtifacts({
    fhirVersion: R4B,
    resourceType: "SearchParameter",
    packageLocation: path.join(fileURLToPath(import.meta.url), "../../../../"),
  }).filter(
    (p) =>
      p.expression !== undefined &&
      p.type !== "special" &&
      p.type !== "composite",
  );

  const r4_set = await generateSP1Sets(R4, r4SearchParameters);
  const r4b_set = await generateSP1Sets(R4B, r4bSearchParameters);

  await writeSP1TSCode(
    R4,
    path.join(options.output, "r4.sp1parameters.ts"),
    r4_set,
    r4SearchParameters,
  );

  await writeSP1TSCode(
    R4B,
    path.join(options.output, "r4b.sp1parameters.ts"),
    r4b_set,
    r4bSearchParameters,
  );
};

const generateSP1SQL: Parameters<Command["action"]>[0] = async (options) => {
  const r4SearchParameters = loadArtifacts({
    fhirVersion: R4,
    resourceType: "SearchParameter",
    packageLocation: path.join(fileURLToPath(import.meta.url), "../../../../"),
  }).filter(
    (p) =>
      p.expression !== undefined &&
      p.type !== "special" &&
      p.type !== "composite",
  );

  const r4bSearchParameters = loadArtifacts({
    fhirVersion: R4B,
    resourceType: "SearchParameter",
    packageLocation: path.join(fileURLToPath(import.meta.url), "../../../../"),
  }).filter(
    (p) =>
      p.expression !== undefined &&
      p.type !== "special" &&
      p.type !== "composite",
  );

  const r4_set = await generateSP1Sets(R4, r4SearchParameters);
  const r4b_set = await generateSP1Sets(R4B, r4bSearchParameters);

  const r4SQL = await generateSP1SQLTable(R4, r4_set, r4SearchParameters);
  const r4bSQL = await generateSP1SQLTable(R4B, r4b_set, r4bSearchParameters);

  writeFileSync(
    options.output,
    `-- R4 SP1 SQL \n ${r4SQL} \n-- R4B SP1 SQL \n${r4bSQL}`,
  );
};

function sp1Commands(command: Command) {
  command
    .command("sql")
    .requiredOption("-o, --output <output>", "Output for sql file")
    .action(generateSP1SQL);

  command
    .command("typescript")
    .requiredOption("-o, --output <output>", "Output for typescript file")
    .action(generateSP1Typescript);
}

export function generateCommands(command: Command) {
  command
    .command("readme")
    .description("Generate a readme file from environment json schema.")
    .action(generateReadme);

  command
    .command("types")
    .description(
      "Generate typescript types off of postgres schema and json schemas",
    )
    .action(generateTypes);

  sp1Commands(
    command
      .command("sp1")
      .description(
        "Generate sp1 r4 and r4b code and sql tables from search parameters",
      ),
  );
}
