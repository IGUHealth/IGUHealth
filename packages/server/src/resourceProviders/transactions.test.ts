import path from "path";
import { test, expect } from "@jest/globals";

import {
  ResourceType,
  Resource,
  StructureDefinition,
} from "@iguhealth/fhir-types/r4/types";
import { loadArtifacts } from "@iguhealth/artifacts";
import { FHIRClientSync } from "@iguhealth/client/interface";
import { OperationError, outcomeFatal } from "@iguhealth/operation-outcomes";

import MemoryDatabase from "./memory/sync.js";
import { buildTransactionTopologicalGraph } from "./transactions";
import { testServices } from "./test_ctx.js";
import { FHIRServerCTX } from "../fhirServer.js";

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

const CTX = {
  ...testServices,
  resolveSD: (ctx: FHIRServerCTX, type: string) => getSD(type),
};

test("Generate a graph from a transaction", () => {
  const result = buildTransactionTopologicalGraph(CTX, {
    resourceType: "Bundle",
    type: "transaction",
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
  expect(result).toMatchSnapshot();
  expect(result.order).toEqual(["1", "0"]);
});

test("Test Cyclical", () => {
  expect(() => {
    return buildTransactionTopologicalGraph(CTX, {
      resourceType: "Bundle",
      type: "transaction",
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
  }).toThrow(
    new OperationError(
      outcomeFatal(
        "exception",
        `Transaction bundle has cycles at following indices ${JSON.stringify(
          []
        )}.`
      )
    )
  );
  try {
    buildTransactionTopologicalGraph(CTX, {
      resourceType: "Bundle",
      type: "transaction",
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
  } catch (e) {
    if (e instanceof OperationError) {
      expect(e.operationOutcome.issue).toEqual([
        {
          code: "exception",
          diagnostics:
            "Transaction bundle has cycles at following indice paths 1->0.",
          expression: undefined,
          severity: "fatal",
        },
      ]);
    } else {
      throw e;
    }
  }
});
