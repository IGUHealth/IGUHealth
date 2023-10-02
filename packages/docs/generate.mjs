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

function processStructureDefinition(memdb, structureDefinition) {
  const doc = `# ${structureDefinition.name}\n ## Description \n ${structureDefinition.description}`;
  for (const element of structureDefinition.snapshot?.element || []) {
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
  const content = processStructureDefinition(
    memoryDatabase,
    structureDefinition
  );
  fs.writeFileSync(pathName, content);
}
