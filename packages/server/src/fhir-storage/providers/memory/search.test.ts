import { expect, test } from "@jest/globals";
import path from "path";
import { fileURLToPath } from "url";

import { loadArtifacts } from "@iguhealth/artifacts";
import { FHIRClientAsync } from "@iguhealth/client/lib/interface";
import {
  Observation,
  Patient,
  Resource,
  ResourceType,
} from "@iguhealth/fhir-types/lib/r4/types";

import { FHIRServerCTX } from "../../fhir/context.js";
import { testServices } from "../test-ctx.js";
import MemoryDatabase from "./async.js";

function createMemoryDatabase(
  resourceTypes: ResourceType[],
): FHIRClientAsync<FHIRServerCTX> {
  const database = MemoryDatabase({});
  const artifactResources: Resource[] = resourceTypes
    .map((resourceType) =>
      loadArtifacts({
        resourceType,
        packageLocation: path.join(fileURLToPath(import.meta.url), "../../../"),
        silence: true,
      }),
    )
    .flat();
  for (const resource of artifactResources) {
    database.create(testServices, resource);
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
  } as Patient);
  const response = await memDB.search_type(CTX, "Patient", [
    { name: "given", value: ["John"] },
  ]);

  expect(response.resources.map((r) => r.id)).toEqual(["test"]);

  const response2 = await memDB.search_type(CTX, "Patient", [
    { name: "given", value: ["John2"] },
  ]);

  expect(response2.resources.map((r) => r.id)).toEqual([]);

  const response3 = await memDB.search_type(CTX, "Patient", [
    { name: "given", value: ["jo"] },
  ]);

  expect(response3.resources.map((r) => r.id)).toEqual(["test"]);
});

test("Quantity Test", async () => {
  const observation: Observation = {
    resourceType: "Observation",
    code: {
      coding: [
        {
          system: "http://loinc.org",
          code: "15074-8",
          display: "Glucose [Moles/volume] in Blood",
        },
      ],
    },
    id: "ob1",
    status: "final",
    valueQuantity: {
      value: 15.1,
    },
  } as Observation;
  await memDB.create(CTX, observation);

  expect(
    (
      await memDB.search_type(CTX, "Observation", [
        { name: "value-quantity", value: [15.12] },
      ])
    ).resources.map((r) => r.id),
  ).toEqual(["ob1"]);

  expect(
    (
      await memDB.search_type(CTX, "Observation", [
        { name: "value-quantity", value: [15.2] },
      ])
    ).resources.map((r) => r.id),
  ).toEqual([]);

  expect(
    (
      await memDB.search_type(CTX, "Observation", [
        { name: "value-quantity", value: [15.0] },
      ])
    ).resources.map((r) => r.id),
  ).toEqual([]);
  expect(
    (
      await memDB.search_type(CTX, "Observation", [
        { name: "value-quantity", value: [15.14] },
      ])
    ).resources.map((r) => r.id),
  ).toEqual(["ob1"]);
});

test("Date Test", async () => {
  const observation: Observation = {
    resourceType: "Observation",
    code: {
      coding: [
        {
          system: "http://loinc.org",
          code: "15074-8",
          display: "Glucose [Moles/volume] in Blood",
        },
      ],
    },
    effectiveDateTime: "1980",
    id: "ob1",
    status: "final",
    valueDateTime: "1980",
  } as Observation;

  await memDB.create(CTX, observation);

  expect(
    (
      await memDB.search_type(CTX, "Observation", [
        { name: "value-date", value: ["1980-01"] },
      ])
    ).resources.map((r) => r.id),
  ).toEqual(["ob1"]);

  expect(
    (
      await memDB.search_type(CTX, "Observation", [
        { name: "value-date", value: ["1981"] },
      ])
    ).resources.map((r) => r.id),
  ).toEqual([]);

  expect(
    (
      await memDB.search_type(CTX, "Observation", [
        { name: "value-date", value: ["1979"] },
      ])
    ).resources.map((r) => r.id),
  ).toEqual([]);
});
