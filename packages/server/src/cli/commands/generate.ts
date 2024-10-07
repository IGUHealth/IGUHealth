import { Command } from "commander";
import { glob } from "glob";
import { compileFromFile } from "json-schema-to-typescript";
import { readFileSync, writeFileSync } from "node:fs";

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
