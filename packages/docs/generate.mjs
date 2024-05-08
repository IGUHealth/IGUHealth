import fs from "node:fs";
import path from "path";
import { fileURLToPath } from "url";

import { loadArtifacts } from "@iguhealth/artifacts";
import { R4, R4B } from "@iguhealth/fhir-types/versions";

const r4Artifacts = ["StructureDefinition", "SearchParameter"]
  .map((resourceType) =>
    loadArtifacts({
      resourceType: resourceType,
      packageLocation: path.join(fileURLToPath(import.meta.url), "../"),
      silence: false,
      fhirVersion: R4,
    }),
  )
  .flat();

const r4bArtifacts = ["StructureDefinition", "SearchParameter"]
  .map((resourceType) =>
    loadArtifacts({
      resourceType: resourceType,
      packageLocation: path.join(fileURLToPath(import.meta.url), "../"),
      silence: false,
      fhirVersion: R4B,
    }),
  )
  .flat();

function escapeCharacters(v) {
  return v
    ?.replaceAll("|", "/")
    .replace(/(\r\n|\n|\r)/gm, "")
    .replaceAll("{", "\\{")
    .replaceAll("}", "\\}")
    .replaceAll("`", "\\`")
    .replaceAll(">", "\\>")
    .replaceAll("<", "\\<");
}

function metaProperties(sd) {
  return `
|Property|Value|
|---|---|
|Publisher|${sd.publisher ?? ""}|
|Name|${sd.name ?? ""}|
|URL|${sd.url ?? ""}|
|Status|${sd.status ?? ""}|
|Description|${sd.description ?? ""}|
|Abstract|${sd.abstract ?? ""}|`;
}

async function processStructureDefinition(artifacts, structureDefinition) {
  const parameters = artifacts
    .filter((r) => r.resourceType === "SearchParameter")
    .filter(
      (r) =>
        r.base.includes(structureDefinition.name) ||
        r.base.includes("Resource") ||
        r.base.includes("DomainResource"),
    );

  let doc = `import TabItem from "@theme/TabItem";
  import Tabs from "@theme/Tabs";

  # ${structureDefinition.name}\n
  ${metaProperties(structureDefinition)}\n
  ## Information
  <Tabs>`;
  doc = `${doc} <TabItem value="structure" label="Structure">
   | Path | Cardinality | Type | Description
  | ---- | ----------- | ---- | -------  \n`;
  for (const element of structureDefinition.snapshot?.element || []) {
    const path = element.path;
    const min = element.min;
    const max = element.max;
    const type = element.type?.[0]?.code;
    const description = escapeCharacters(element.definition);
    doc = `${doc} | ${path} | ${min}..${max} | ${
      type ? type : structureDefinition.name
    } | ${description} \n`;
  }

  doc = `${doc}</TabItem>\n`;

  doc = `${doc} <TabItem value="searchparameter" label="Search Parameters">
   | Name | Type | Description  | Expression 
    | ---- | ---- | ------- | ------  \n`;
  for (const parameter of parameters) {
    const name = parameter.name;
    const type = parameter.type;

    const description = escapeCharacters(parameter.description || "");

    const expression = escapeCharacters(parameter.expression || "");

    doc = `${doc} | ${name} | ${type} | ${description} | ${expression}  \n`;
  }
  doc = `${doc}\n</TabItem>\n`;

  doc = `${doc}</Tabs>`;

  return doc;
}

async function generateFHIRDocumentation() {
  const r4StructureDefinitions = r4Artifacts
    .filter((r) => r.resourceType === "StructureDefinition")
    .filter((r) => r.kind === "resource");

  for (const structureDefinition of r4StructureDefinitions) {
    const pathName = `./docs/documentation/Data_Model/R4/${structureDefinition.name}.mdx`;
    const content = await processStructureDefinition(
      r4Artifacts,
      structureDefinition,
    );
    fs.writeFileSync(pathName, content);
  }

  const r4bStructureDefinitions = r4bArtifacts
    .filter((r) => r.resourceType === "StructureDefinition")
    .filter((r) => r.kind === "resource");

  for (const structureDefinition of r4bStructureDefinitions) {
    const pathName = `./docs/documentation/Data_Model/R4B/${structureDefinition.name}.mdx`;
    const content = await processStructureDefinition(
      r4bArtifacts,
      structureDefinition,
    );
    fs.writeFileSync(pathName, content);
  }
}

async function generateNPMDocumentation() {
  // Reads all the packages in the package directory that get published to NPM
  // and reads in their readme.md files
  const packageDirectory = path.join(
    fileURLToPath(import.meta.url),
    "../../../packages",
  );
  const packages = fs.readdirSync(packageDirectory);

  for (const packageName of packages) {
    const packagePath = path.join(packageDirectory, packageName);
    if (fs.lstatSync(packagePath).isDirectory()) {
      const packageJSONPath = path.join(packagePath, "package.json");
      const readmePath = path.join(packagePath, "README.md");
      const packageJSON = JSON.parse(fs.readFileSync(packageJSONPath, "utf8"));
      if (packageJSON.scripts?.publish) {
        if (fs.existsSync(readmePath)) {
          const readmeContent = fs.readFileSync(readmePath, "utf8");
          const pathName = `./docs/documentation/NPM Packages/${packageJSON.name.replace("/", `_`)}.mdx`;
          fs.writeFileSync(
            pathName,
            `---\nsidebar_position: 1\nsidebar_label: "${packageJSON.name}"\n---\n
          ${readmeContent}`,
          );
        }
      }
    }
  }
}
switch (process.argv[2]) {
  case "npm": {
    await generateNPMDocumentation();
    break;
  }
  case "fhir": {
    await generateFHIRDocumentation();
    break;
  }
  default: {
    throw new Error(
      "Invalid argument. Please provide either 'npm' or 'fhir' as an argument.",
    );
  }
}
