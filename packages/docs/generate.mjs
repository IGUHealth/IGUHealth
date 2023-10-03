import fs from "node:fs";
import path from "path";
import { fileURLToPath } from "url";
import { loadArtifacts } from "@iguhealth/artifacts";
import MemoryDatabase from "@iguhealth/server/lib/resourceProviders/memory/async.js";

function createMemoryDatabase(resourceTypes) {
  const database = MemoryDatabase({});
  const artifactResources = resourceTypes
    .map((resourceType) =>
      loadArtifacts(
        resourceType,
        path.join(fileURLToPath(import.meta.url), "../"),
        false
      )
    )
    .flat();

  for (const resource of artifactResources) {
    database.create({}, resource);
  }
  return database;
}

async function processStructureDefinition(memdb, structureDefinition) {
  const parameters = await memdb.search_type({}, "SearchParameter", [
    {
      name: "base",
      value: ["DomainResource", "Resource", structureDefinition.name],
    },
  ]);

  let doc = `# ${structureDefinition.name}\n ## Description \n ${structureDefinition.description}\n`;
  doc = `${doc} ## Structure \n | Path | Cardinality | Type | Description \n | ---- | ----------- | ---- | -------  \n`;
  for (const element of structureDefinition.snapshot?.element || []) {
    const path = element.path;
    const min = element.min;
    const max = element.max;
    const type = element.type?.[0]?.code;
    const description = element.definition
      ?.replace("|", "/")
      .replace(/(\r\n|\n|\r)/gm, "");
    doc = `${doc} | ${path} | ${min}..${max} | ${
      type ? type : structureDefinition.name
    } | ${description} \n`;
  }

  doc = `${doc} ## Search Parameters \n | Name | Type | Description  | Expression  \n | ---- | ---- | ------- | ------  \n`;
  for (const parameter of parameters.resources) {
    const name = parameter.name;
    const type = parameter.type;

    const description = parameter.description
      ?.replace("|", "/")
      .replace(/(\r\n|\n|\r)/gm, "");

    const expression = parameter.expression
      ?.replace("|", "/")
      .replace(/(\r\n|\n|\r)/gm, "");

    doc = `${doc} | ${name} | ${type} | ${description ? description : ""} | ${
      expression ? expression : ""
    }  \n`;
  }

  return doc;
}

const memoryDatabase = createMemoryDatabase([
  "StructureDefinition",
  "SearchParameter",
]);

const resourceStructureDefinitions = await memoryDatabase.search_type(
  {},
  "StructureDefinition",
  [
    { name: "kind", value: ["resource"] },
    { name: "_count", value: ["1000"] },
  ]
);

for (const structureDefinition of resourceStructureDefinitions.resources) {
  const pathName = `./docs/FHIR/${structureDefinition.name}.mdx`;
  const content = await processStructureDefinition(
    memoryDatabase,
    structureDefinition
  );
  fs.writeFileSync(pathName, content);
}
