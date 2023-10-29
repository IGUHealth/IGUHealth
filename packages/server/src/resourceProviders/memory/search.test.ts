import path from "path";

import {
  ResourceType,
  Resource,
  Patient,
} from "@iguhealth/fhir-types/r4/types";
import { resourceTypes } from "@iguhealth/fhir-types/r4/sets";
import { expect, test } from "@jest/globals";
import { loadArtifacts } from "@iguhealth/artifacts";
import * as fhirpath from "@iguhealth/fhirpath";
import { FHIRClientAsync } from "@iguhealth/client/interface";

import { testServices } from "../test_ctx.js";
import MemoryDatabase from "./async.js";

function createMemoryDatabase(
  resourceTypes: ResourceType[]
): FHIRClientAsync<unknown> {
  const database = MemoryDatabase<unknown>({});
  const artifactResources: Resource[] = resourceTypes
    .map((resourceType) =>
      loadArtifacts(resourceType, path.join(__dirname, "../../"), true)
    )
    .flat();
  for (const resource of artifactResources) {
    database.create({}, resource);
  }
  return database;
}

const memDB = createMemoryDatabase([
  "SearchParameter",
  "StructureDefinition",
] as ResourceType[]);

const CTX = { ...testServices, client: memDB };

test("TEST Name search", async () => {
  await memDB.create(CTX, {
    resourceType: "Patient",
    id: "test",
    name: [{ given: ["John"], family: "Doe" }],
  });
  const response = await memDB.search_type({}, "Patient", [
    { name: "given", value: ["John"] },
  ]);

  expect(response.resources.map((r) => r.id)).toEqual(["test"]);

  const response2 = await memDB.search_type({}, "Patient", [
    { name: "given", value: ["John2"] },
  ]);

  expect(response2.resources.map((r) => r.id)).toEqual([]);
});
