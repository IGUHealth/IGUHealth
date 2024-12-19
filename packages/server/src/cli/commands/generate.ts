import { Command } from "commander";
import { glob } from "glob";
import { compileFromFile } from "json-schema-to-typescript";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as generateSQL from "zapatos/generate";

import { loadArtifacts } from "@iguhealth/artifacts";
import {
  FHIR_VERSION,
  R4,
  R4B,
  Resource,
  ResourceType,
} from "@iguhealth/fhir-types/versions";

import {
  generateSP1SQLTable,
  generateSP1Sets,
  generateSP1TSCode,
  sp1Migration,
} from "../generate/sp1-parameters.js";

function load<Version extends FHIR_VERSION, Type extends ResourceType<Version>>(
  fhirVersion: Version,
  resourceType: Type,
): Resource<Version, Type>[] {
  return loadArtifacts({
    fhirVersion,
    resourceType,
    packageLocation: path.join(fileURLToPath(import.meta.url), "../../../../"),
    onlyPackages: [
      "@iguhealth/iguhealth.fhir.r4.core",
      "@iguhealth/iguhealth.fhir.r4b.core",
      "@iguhealth/hl7.fhir.r4.core",
      "@iguhealth/hl7.fhir.r4b.core",
    ],
  });
}

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
  await generateSQL.generate({
    db: {
      user: process.env.FHIR_DATABASE_USERNAME,
      password: process.env.FHIR_DATABASE_PASSWORD,
      host: process.env.FHIR_DATABASE_HOST,
      database: process.env.FHIR_DATABASE_NAME,
      port: parseInt(process.env.FHIR_DATABASE_PORT || "5432"),
      ssl:
        process.env.FHIR_DATABASE_SSL === "true"
          ? {
              // Self signed certificate CA is not used.
              rejectUnauthorized: false,
              host: process.env.FHIR_DATABASE_HOST,
              port: parseInt(process.env.FHIR_DATABASE_PORT || "5432"),
            }
          : false,
    },
    outDir: "src/fhir-storage/providers/middleware/postgres/generated",
  });
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
  const r4SearchParameters = load(R4, "SearchParameter").filter(
    (p) =>
      p.expression !== undefined &&
      p.type !== "special" &&
      p.type !== "composite",
  );

  const r4bSearchParameters = load(R4B, "SearchParameter").filter(
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
  const r4SearchParameters = load(R4, "SearchParameter").filter(
    (p) =>
      p.expression !== undefined &&
      p.type !== "special" &&
      p.type !== "composite",
  );

  const r4bSearchParameters = load(R4B, "SearchParameter").filter(
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

const generateSQLMigration: Parameters<Command["action"]>[0] = async (
  options,
) => {
  const r4SearchParameters = load(R4, "SearchParameter").filter(
    (p) =>
      p.expression !== undefined &&
      p.type !== "special" &&
      p.type !== "composite",
  );

  const r4bSearchParameters = load(R4B, "SearchParameter").filter(
    (p) =>
      p.expression !== undefined &&
      p.type !== "special" &&
      p.type !== "composite",
  );

  const r4_set = await generateSP1Sets(R4, r4SearchParameters);
  const r4b_set = await generateSP1Sets(R4B, r4bSearchParameters);

  const r4Migrations = sp1Migration(R4, r4_set, r4SearchParameters);
  const r4bMigrations = sp1Migration(R4B, r4b_set, r4bSearchParameters);

  writeFileSync(
    options.output,
    `-- R4 SP1 SQL Migrations \n ${r4Migrations} \n-- R4B SP1 SQL Migrations \n${r4bMigrations}`,
  );
};

function sp1Commands(command: Command) {
  command
    .command("schema")
    .requiredOption("-o, --output <output>", "Output for sql schema file")
    .action(generateSP1SQL);

  command
    .command("migration")
    .requiredOption("-o, --output <output>", "Output for sql migration file")
    .action(generateSQLMigration);

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
