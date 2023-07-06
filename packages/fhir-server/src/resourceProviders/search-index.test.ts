import path from "path";

import { ResourceType, Resource } from "@genfhi/fhir-types/r4/types";
import { resourceTypes } from "@genfhi/fhir-types/r4/sets";
import { expect, test } from "@jest/globals";
import { loadArtifacts } from "@genfhi/artifacts";

import MemoryDatabase from "./memory";
import { FHIRClientSync } from "../client/interface";

function createMemoryDatabase(
  resourceTypes: ResourceType[]
): FHIRClientSync<any> {
  const database = MemoryDatabase<any>({});
  const artifactResources: Resource[] = resourceTypes
    .map((resourceType) =>
      loadArtifacts(resourceType, path.join(__dirname, "../"))
    )
    .flat();
  for (const resource of artifactResources) {
    database.create({}, resource);
  }
  return database;
}

const memDatabase = createMemoryDatabase([
  ...resourceTypes.values(),
] as ResourceType[]);

test.each([...resourceTypes.values()])(
  `Testing indexing resourceType '%s'`,
  (resourceType) => {
    const resources = memDatabase.search_type(
      {},
      resourceType as ResourceType,
      { parameters: {} }
    );
    console.log(`${resourceType}`, resources.length);
  }
);
