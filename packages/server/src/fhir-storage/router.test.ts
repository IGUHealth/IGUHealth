import { expect, test } from "@jest/globals";

import { FHIRRequest } from "@iguhealth/client/lib/types";
import {
  Patient,
  Practitioner,
  id,
} from "@iguhealth/fhir-types/lib/generated/r4/types";
import { R4 } from "@iguhealth/fhir-types/lib/versions";

import { Memory } from "./providers/memory/async.js";
import RouterClient from "./router.js";
import { testServices } from "./test-ctx.js";

test("Test routing on resourceTypes", async () => {
  const router = RouterClient(
    [],
    [
      {
        filter: {
          r4: {
            levelsSupported: ["system", "type", "instance"],
            resourcesSupported: ["Patient"],
            interactionsSupported: ["read-request", "search-request"],
          },
        },
        source: new Memory({
          [R4]: {
            ["Patient"]: {
              ["1" as id]: { id: "1", resourceType: "Patient" } as Patient,
            },
            ["Practitioner"]: {
              ["3" as id]: {
                id: "3",
                resourceType: "Practitioner",
              } as Practitioner,
            },
          },
        }),
      },
      {
        filter: {
          r4: {
            levelsSupported: ["system", "type", "instance"],
            resourcesSupported: ["Practitioner"],
            interactionsSupported: ["read-request", "search-request"],
          },
        },
        source: new Memory({
          [R4]: {
            ["Patient"]: {
              ["2" as id]: { id: "2", resourceType: "Patient" } as Patient,
            },
            ["Practitioner"]: {
              ["4" as id]: {
                id: "4",
                resourceType: "Practitioner",
              } as Practitioner,
            },
          },
        }),
      },
    ],
  );

  const patientSearch = await router.search_type(
    testServices,
    R4,
    "Patient",
    [],
  );

  expect(patientSearch.resources).toEqual([
    { id: "1", resourceType: "Patient" },
  ]);

  const practitionerSearch = await router.search_type(
    testServices,
    R4,
    "Practitioner",
    [],
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
        filter: {
          r4: {
            levelsSupported: ["system", "type", "instance"],
            resourcesSupported: ["Practitioner"],
            interactionsSupported: ["read-request", "search-request"],
          },
        },

        source: new Memory({
          [R4]: {
            ["Practitioner"]: {
              ["4" as id]: {
                id: "4",
                resourceType: "Practitioner",
                name: [{ given: ["TEST"] }],
              } as Practitioner,
            },
          },
        }),
      },
      {
        filter: {
          r4: {
            levelsSupported: ["system", "type", "instance"],
          },
          useSource: (request: FHIRRequest) => {
            return (
              request.type === "search-request" &&
              request.level === "type" &&
              request.resource === "Practitioner"
            );
          },
        },
        source: new Memory({
          [R4]: {
            ["Practitioner"]: {
              ["5" as id]: {
                id: "5",
                resourceType: "Practitioner",
                name: [{ given: ["TEST"] }],
              } as Practitioner,
            },
          },
        }),
      },
    ],
  );

  const practitioner = await router.search_type(
    testServices,
    R4,
    "Practitioner",
    [],
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
        filter: {
          r4: {
            levelsSupported: ["system", "type", "instance"],
            resourcesSupported: ["Practitioner"],
            interactionsSupported: ["read-request", "search-request"],
          },
        },
        source: new Memory({
          [R4]: {
            ["Practitioner"]: {
              ["4" as id]: {
                id: "4",
                resourceType: "Practitioner",
                name: [{ given: ["TEST"] }],
              } as Practitioner,
            },
          },
        }),
      },
      {
        filter: {
          useSource: (request: FHIRRequest) => {
            return false;
          },
        },
        source: new Memory({
          [R4]: {
            ["Practitioner"]: {
              ["5" as id]: {
                id: "5",
                resourceType: "Practitioner",
                name: [{ given: ["TEST"] }],
              } as Practitioner,
            },
          },
        }),
      },
    ],
  );

  const practitioner2 = await router.search_type(
    testServices,
    R4,
    "Practitioner",
    [],
  );

  expect(practitioner2.resources).toEqual([
    {
      id: "4",
      resourceType: "Practitioner",
      name: [{ given: ["TEST"] }],
    },
  ]);
});
