import { expect, test } from "@jest/globals";
import path from "path";
import { fileURLToPath } from "url";

import { loadArtifacts } from "@iguhealth/artifacts";
import {
  Bundle,
  canonical,
} from "@iguhealth/fhir-types/lib/generated/r4/types";
import {
  AllResourceTypes,
  FHIR_VERSION,
  R4,
  Resource,
  ResourceType,
} from "@iguhealth/fhir-types/lib/versions";
import {
  OperationError,
  isOperationError,
  outcomeFatal,
} from "@iguhealth/operation-outcomes";

import { testServices } from "./fhir-clients/test-ctx.js";
import { buildTransactionTopologicalGraph } from "./transactions";

function loadResources(
  resourceTypes: ResourceType<R4>[],
): Resource<R4, AllResourceTypes>[] {
  const artifactResources: Resource<R4, AllResourceTypes>[] = resourceTypes
    .map((resourceType) =>
      loadArtifacts({
        fhirVersion: R4,
        loadDevelopmentPackages: true,
        resourceType,
        packageLocation: path.join(fileURLToPath(import.meta.url), "../"),
        silence: true,
      }),
    )
    .flat();
  return artifactResources;
}

const resources = loadResources(["StructureDefinition"]);

const CTX = {
  ...testServices,
  resolveCanonical<
    FHIRVersion extends FHIR_VERSION,
    Type extends ResourceType<FHIRVersion>,
  >(
    fhirVersion: FHIRVersion,
    type: Type,
    url: canonical,
  ): Resource<FHIRVersion, Type> | undefined {
    // @ts-ignore
    const sd = resources.find((sd) => sd.url === url);
    if (!sd) throw new Error(`Could not resolve url ${url}`);
    return sd as Resource<FHIRVersion, Type> | undefined;
  },
};

test("Generate a graph from a transaction", async () => {
  const result = await buildTransactionTopologicalGraph(CTX, R4, {
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
  } as Bundle);
  expect(result.order).toEqual(["1", "0"]);
});

test("Test Cyclical", async () => {
  expect(() => {
    return buildTransactionTopologicalGraph(CTX, R4, {
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
    } as Bundle);
  }).rejects.toEqual(
    new OperationError(
      outcomeFatal(
        "exception",
        `Transaction bundle has cycles at following indices ${JSON.stringify(
          [],
        )}.`,
      ),
    ),
  );
  try {
    await buildTransactionTopologicalGraph(CTX, R4, {
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
    } as Bundle);
  } catch (e) {
    if (isOperationError(e)) {
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
