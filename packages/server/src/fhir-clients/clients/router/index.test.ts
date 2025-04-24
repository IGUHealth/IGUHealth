import { expect, test } from "@jest/globals";

import { FHIRRequest, Interaction } from "@iguhealth/client/lib/types";
import {
  Patient,
  Practitioner,
  id,
} from "@iguhealth/fhir-types/lib/generated/r4/types";
import { FHIR_VERSION, R4 } from "@iguhealth/fhir-types/lib/versions";

import { testServices } from "../../test-ctx.js";
import { Memory } from "../memory/async.js";
import RouterClient from "./index.js";

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
        middleware: new Memory({
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
        }).middleware,
      },
      {
        filter: {
          r4: {
            levelsSupported: ["system", "type", "instance"],
            resourcesSupported: ["Practitioner"],
            interactionsSupported: ["read-request", "search-request"],
          },
        },
        middleware: new Memory({
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
        }).middleware,
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

        middleware: new Memory({
          [R4]: {
            ["Practitioner"]: {
              ["4" as id]: {
                id: "4",
                resourceType: "Practitioner",
                name: [{ given: ["TEST"] }],
              } as Practitioner,
            },
          },
        }).middleware,
      },
      {
        filter: {
          r4: {
            levelsSupported: ["system", "type", "instance"],
          },
          useSource: (
            request: FHIRRequest<FHIR_VERSION, Interaction[keyof Interaction]>,
          ) => {
            return (
              request.type === "search-request" &&
              request.level === "type" &&
              request.resource === "Practitioner"
            );
          },
        },
        middleware: new Memory({
          [R4]: {
            ["Practitioner"]: {
              ["5" as id]: {
                id: "5",
                resourceType: "Practitioner",
                name: [{ given: ["TEST"] }],
              } as Practitioner,
            },
          },
        }).middleware,
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
        middleware: new Memory({
          [R4]: {
            ["Practitioner"]: {
              ["4" as id]: {
                id: "4",
                resourceType: "Practitioner",
                name: [{ given: ["TEST"] }],
              } as Practitioner,
            },
          },
        }).middleware,
      },
      {
        filter: {
          useSource: (
            request: FHIRRequest<FHIR_VERSION, Interaction[keyof Interaction]>,
          ) => {
            return false;
          },
        },
        middleware: new Memory({
          [R4]: {
            ["Practitioner"]: {
              ["5" as id]: {
                id: "5",
                resourceType: "Practitioner",
                name: [{ given: ["TEST"] }],
              } as Practitioner,
            },
          },
        }).middleware,
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
