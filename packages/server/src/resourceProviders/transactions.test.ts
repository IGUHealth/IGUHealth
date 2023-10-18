import path from "path";
import { test, expect } from "@jest/globals";
import { alg } from "@dagrejs/graphlib";

import {
  ResourceType,
  Resource,
  StructureDefinition,
} from "@iguhealth/fhir-types/r4/types";
import { loadArtifacts } from "@iguhealth/artifacts";
import { FHIRClientSync } from "@iguhealth/client/interface";

import MemoryDatabase from "./memory/sync.js";
import { buildTransactionTopologicalGraph } from "./transactions";

function createMemoryDatabase(
  resourceTypes: ResourceType[]
): FHIRClientSync<unknown> {
  const database = MemoryDatabase<unknown>({});
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

const memDB = createMemoryDatabase(["StructureDefinition"]);

function getSD(type: string): StructureDefinition | undefined {
  return memDB.read({}, "StructureDefinition", type);
}

test("Generate a graph from a transaction", () => {
  const { graph, locationsToUpdate } = buildTransactionTopologicalGraph(getSD, {
    resourceType: "Bundle",
    type: "transaction-request",
    entry: [
      {
        fullUrl: "urn:oid:2",
        resource: {
          resourceType: "Patient",
          generalPractitioner: [{ reference: "urn:oid:1" }],
        },
      },
      {
        fullUrl: "urn:oid:1",
        resource: {
          resourceType: "Practitioner",
          name: [{ given: ["Bob"] }],
        },
      },
    ],
  });
  expect({ graph, locationsToUpdate }).toMatchSnapshot();
  expect(alg.topsort(graph)).toEqual(["1", "0"]);
});

test("Test Cyclical", () => {
  const { graph, locationsToUpdate } = buildTransactionTopologicalGraph(getSD, {
    resourceType: "Bundle",
    type: "transaction-request",
    entry: [
      {
        fullUrl: "urn:oid:2",
        resource: {
          resourceType: "Patient",
          generalPractitioner: [{ reference: "urn:oid:1" }],
        },
      },
      {
        fullUrl: "urn:oid:1",
        resource: {
          extension: [
            { url: "test", valueReference: { reference: "urn:oid:2" } },
          ],
          resourceType: "Practitioner",
          name: [{ given: ["Bob"] }],
        },
      },
    ],
  });
  expect({ graph, locationsToUpdate }).toMatchSnapshot();
  expect(() => {
    alg.topsort(graph);
  }).toThrow();
});
