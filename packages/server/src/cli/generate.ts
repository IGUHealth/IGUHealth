import { Command } from "commander";
import { glob } from "glob";
import { compileFromFile } from "json-schema-to-typescript";
import { exec } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import util from "node:util";
import * as generateSQL from "zapatos/generate";

const execPromise = util.promisify(exec);

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
    outDir: "src/fhir-storage/providers/postgres/generated",
  });

  const schemaFiles = await glob("src/**/*.schema.json");
  await Promise.all(
    schemaFiles.map(async (schemaFile) => {
      const ts = await compileFromFile(schemaFile);
      writeFileSync(schemaFile.replace(".schema.json", ".schema.d.ts"), ts);
    }),
  );
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
}
