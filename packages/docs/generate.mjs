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

  # ${structureDefinition.name}\n ## Description \n ${structureDefinition.description} \n
  ## Data
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

const r4StructureDefinitions = r4Artifacts
  .filter((r) => r.resourceType === "StructureDefinition")
  .filter((r) => r.kind === "resource");

for (const structureDefinition of r4StructureDefinitions) {
  const pathName = `./docs/05-Data_Model/R4/${structureDefinition.name}.mdx`;
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
  const pathName = `./docs/05-Data_Model/R4B/${structureDefinition.name}.mdx`;
  const content = await processStructureDefinition(
    r4bArtifacts,
    structureDefinition,
  );
  fs.writeFileSync(pathName, content);
}
