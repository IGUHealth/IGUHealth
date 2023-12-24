import { expect, test } from "@jest/globals";

import MemoryDatabase from "./memory/async.js";
import RouterClient from "./router.js";

import { testServices } from "./test-ctx.js";
import { Patient, Practitioner, id } from "@iguhealth/fhir-types/r4/types";
import { FHIRRequest } from "@iguhealth/client/types";

test("Test routing on resourceTypes", async () => {
  const router = RouterClient(
    [],
    [
      {
        source: MemoryDatabase({
          ["Patient"]: {
            ["1" as id]: { id: "1", resourceType: "Patient" } as Patient,
          },
          ["Practitioner"]: {
            ["3" as id]: {
              id: "3",
              resourceType: "Practitioner",
            } as Practitioner,
          },
        }),
        resourcesSupported: ["Patient"],
        interactionsSupported: ["read-request", "search-request"],
      },
      {
        source: MemoryDatabase({
          ["Patient"]: {
            ["2" as id]: { id: "2", resourceType: "Patient" } as Patient,
          },
          ["Practitioner"]: {
            ["4" as id]: {
              id: "4",
              resourceType: "Practitioner",
            } as Practitioner,
          },
        }),
        resourcesSupported: ["Practitioner"],
        interactionsSupported: ["read-request", "search-request"],
      },
    ]
  );

  const patientSearch = await router.search_type(testServices, "Patient", []);

  expect(patientSearch.resources).toEqual([
    { id: "1", resourceType: "Patient" },
  ]);

  const practitionerSearch = await router.search_type(
    testServices,
    "Practitioner",
    []
  );
  expect(practitionerSearch.resources).toEqual([
    { id: "4", resourceType: "Practitioner" },
  ]);
});

test("Test routing priority", async () => {
  let router = RouterClient(
    [],
    [
      {
        source: MemoryDatabase({
          ["Practitioner"]: {
            ["4" as id]: {
              id: "4",
              resourceType: "Practitioner",
              name: [{ given: ["TEST"] }],
            } as Practitioner,
          },
        }),
        resourcesSupported: ["Practitioner"],
        interactionsSupported: ["read-request", "search-request"],
      },
      {
        source: MemoryDatabase({
          ["Practitioner"]: {
            ["5" as id]: {
              id: "5",
              resourceType: "Practitioner",
              name: [{ given: ["TEST"] }],
            } as Practitioner,
          },
        }),
        useSource: (request: FHIRRequest) => {
          return (
            request.type === "search-request" &&
            request.level === "type" &&
            request.resourceType === "Practitioner"
          );
        },
      },
    ]
  );

  const practitioner = await router.search_type(
    testServices,
    "Practitioner",
    []
  );
  expect(practitioner.resources).toEqual([
    {
      id: "5",
      resourceType: "Practitioner",
      name: [{ given: ["TEST"] }],
    },
    {
      id: "4",
      resourceType: "Practitioner",
      name: [{ given: ["TEST"] }],
    },
  ]);

  router = RouterClient(
    [],
    [
      {
        source: MemoryDatabase({
          ["Practitioner"]: {
            ["4" as id]: {
              id: "4",
              resourceType: "Practitioner",
              name: [{ given: ["TEST"] }],
            } as Practitioner,
          },
        }),
        resourcesSupported: ["Practitioner"],
        interactionsSupported: ["read-request", "search-request"],
      },
      {
        source: MemoryDatabase({
          ["Practitioner"]: {
            ["5" as id]: {
              id: "5",
              resourceType: "Practitioner",
              name: [{ given: ["TEST"] }],
            } as Practitioner,
          },
        }),
        useSource: (request: FHIRRequest) => {
          return false;
        },
      },
    ]
  );

  const practitioner2 = await router.search_type(
    testServices,
    "Practitioner",
    []
  );

  expect(practitioner2.resources).toEqual([
    {
      id: "4",
      resourceType: "Practitioner",
      name: [{ given: ["TEST"] }],
    },
  ]);
});
