import { expect, test } from "@jest/globals";

import MemoryDatabase from "./memory/async.js";
import RouterClient from "./router.js";

import { testServices } from "./test_ctx.js";

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
