import path from "path";

import { ResourceType, Resource } from "@iguhealth/fhir-types/r4/types";
import { resourceTypes } from "@iguhealth/fhir-types/r4/sets";
import { expect, test } from "@jest/globals";
import { loadArtifacts } from "@iguhealth/artifacts";
import * as fhirpath from "@iguhealth/fhirpath";

import MemoryDatabase from "./memory";
import { FHIRClientSync } from "../client/interface";

function createMemoryDatabase(
  resourceTypes: ResourceType[]
): FHIRClientSync<any> {
  const database = MemoryDatabase<any>({});
  const artifactResources: Resource[] = resourceTypes
    .map((resourceType) =>
      loadArtifacts(resourceType, path.join(__dirname, "../"), true)
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

test.each([...resourceTypes.values()].sort((r, r2) => (r > r2 ? 1 : -1)))(
  `Testing indexing resourceType '%s'`,
  (resourceType) => {
    const searchParameters = memDatabase.search_type({}, "SearchParameter", {
      resourceType: "SearchParameter",
      parameters: {
        base: {
          name: "base",
          value: [resourceType],
        },
      },
    });
    const resources = memDatabase
      .search_type({}, resourceType as ResourceType, { parameters: {} })
      .filter((r) => r.id)
      .sort((r, r2) => JSON.stringify(r).localeCompare(JSON.stringify(r2)))
      .slice(0, 10);
    for (const resource of resources) {
      for (const parameter of searchParameters) {
        if (parameter.expression) {
          try {
            const evalResult = fhirpath.evaluate(
              parameter.expression,
              resource,
              {
                meta: {
                  getSD: (type) => {
                    return memDatabase.read({}, "StructureDefinition", type);
                  },
                },
              }
            );
            expect([parameter.expression, evalResult]).toMatchSnapshot();
          } catch (e) {
            console.error(
              `Expression failed to evaluate ${parameter.expression}`
            );
            console.error(e);
            throw e;
          }
        }
      }
    }
  }
);
