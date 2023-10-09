import { expect, test } from "@jest/globals";

import MemoryDatabase from "./memory/async.js";
import RouterClient from "./router.js";

import { testServices } from "./test_ctx.js";
import { FHIRRequest } from "@iguhealth/client/types";

test("Test routing on resourceTypes", async () => {
  const router = RouterClient([
    {
      source: MemoryDatabase({
        ["Patient"]: { "1": { id: "1", resourceType: "Patient" } },
        ["Practitioner"]: {
          "3": { id: "3", resourceType: "Practitioner" },
        },
      }),
      resourcesSupported: ["Patient"],
      interactionsSupported: ["read-request", "search-request"],
    },
    {
      source: MemoryDatabase({
        ["Patient"]: { "2": { id: "2", resourceType: "Patient" } },
        ["Practitioner"]: {
          "4": { id: "4", resourceType: "Practitioner" },
        },
      }),
      resourcesSupported: ["Practitioner"],
      interactionsSupported: ["read-request", "search-request"],
    },
  ]);

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
  let router = RouterClient([
    {
      source: MemoryDatabase({
        ["Practitioner"]: {
          "4": {
            id: "4",
            resourceType: "Practitioner",
            name: [{ given: ["TEST"] }],
          },
        },
      }),
      resourcesSupported: ["Practitioner"],
      interactionsSupported: ["read-request", "search-request"],
    },
    {
      source: MemoryDatabase({
        ["Practitioner"]: {
          "5": {
            id: "5",
            resourceType: "Practitioner",
            name: [{ given: ["TEST"] }],
          },
        },
      }),
      filter: (request: FHIRRequest) => {
        return (
          request.type === "search-request" &&
          request.level === "type" &&
          request.resourceType === "Practitioner"
        );
      },
    },
  ]);

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

  router = RouterClient([
    {
      source: MemoryDatabase({
        ["Practitioner"]: {
          "4": {
            id: "4",
            resourceType: "Practitioner",
            name: [{ given: ["TEST"] }],
          },
        },
      }),
      resourcesSupported: ["Practitioner"],
      interactionsSupported: ["read-request", "search-request"],
    },
    {
      source: MemoryDatabase({
        ["Practitioner"]: {
          "5": {
            id: "5",
            resourceType: "Practitioner",
            name: [{ given: ["TEST"] }],
          },
        },
      }),
      filter: (request: FHIRRequest) => {
        return false;
      },
    },
  ]);

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
