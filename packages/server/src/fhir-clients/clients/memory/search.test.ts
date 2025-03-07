import { expect, test } from "@jest/globals";
import { fileURLToPath } from "url";

import { loadArtifacts } from "@iguhealth/artifacts";
import { FHIRClientAsync } from "@iguhealth/client/lib/interface";
import {
  Observation,
  Patient,
  Resource,
  ResourceType,
} from "@iguhealth/fhir-types/lib/generated/r4/types";
import { R4 } from "@iguhealth/fhir-types/lib/versions";

import { IGUHealthServerCTX } from "../../../fhir-server/types.js";
import { testServices } from "../../test-ctx.js";
import { Memory } from "./async.js";

async function createMemoryDatabase(
  resourceTypes: ResourceType[],
): Promise<FHIRClientAsync<IGUHealthServerCTX>> {
  const database = new Memory({});

  const artifactResources: Resource[] = resourceTypes
    .map((resourceType) =>
      loadArtifacts({
        fhirVersion: R4,
        resourceType,
        loadDevelopmentPackages: true,
        currentDirectory: fileURLToPath(import.meta.url),
        onlyPackages: [
          "@iguhealth/hl7.fhir.r4.core",
          "@iguhealth/hl7.fhir.r4b.core",
          "@iguhealth/iguhealth.fhir.r4.core",
          "@iguhealth/iguhealth.fhir.r4b.core",
        ],
        silence: true,
      }),
    )
    .flat();
  for (const resource of artifactResources) {
    await database.create(testServices, R4, resource);
  }
  return database;
}

const memDB = await createMemoryDatabase([
  "SearchParameter",
  "StructureDefinition",
] as ResourceType[]);

const CTX = { ...testServices, client: memDB };

test("TEST Name search", async () => {
  await memDB.create(CTX, R4, {
    resourceType: "Patient",
    id: "test",
    name: [{ given: ["John"], family: "Doe" }],
  } as Patient);
  const response = await memDB.search_type(CTX, R4, "Patient", [
    { name: "given", value: ["John"] },
  ]);

  expect(response.resources.map((r) => r.id)).toEqual(["test"]);

  const response2 = await memDB.search_type(CTX, R4, "Patient", [
    { name: "given", value: ["John2"] },
  ]);

  expect(response2.resources.map((r) => r.id)).toEqual([]);

  const response3 = await memDB.search_type(CTX, R4, "Patient", [
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
  await memDB.create(CTX, R4, observation);

  expect(
    (
      await memDB.search_type(CTX, R4, "Observation", [
        { name: "value-quantity", value: [15.12] },
      ])
    ).resources.map((r) => r.id),
  ).toEqual(["ob1"]);

  expect(
    (
      await memDB.search_type(CTX, R4, "Observation", [
        { name: "value-quantity", value: [15.2] },
      ])
    ).resources.map((r) => r.id),
  ).toEqual([]);

  expect(
    (
      await memDB.search_type(CTX, R4, "Observation", [
        { name: "value-quantity", value: [15.0] },
      ])
    ).resources.map((r) => r.id),
  ).toEqual([]);
  expect(
    (
      await memDB.search_type(CTX, R4, "Observation", [
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

  await memDB.create(CTX, R4, observation);

  expect(
    (
      await memDB.search_type(CTX, R4, "Observation", [
        { name: "value-date", value: ["1980-01"] },
      ])
    ).resources.map((r) => r.id),
  ).toEqual(["ob1"]);

  expect(
    (
      await memDB.search_type(CTX, R4, "Observation", [
        { name: "value-date", value: ["1981"] },
      ])
    ).resources.map((r) => r.id),
  ).toEqual([]);

  expect(
    (
      await memDB.search_type(CTX, R4, "Observation", [
        { name: "value-date", value: ["1979"] },
      ])
    ).resources.map((r) => r.id),
  ).toEqual([]);
});
