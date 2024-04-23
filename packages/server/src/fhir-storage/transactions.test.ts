import { expect, test } from "@jest/globals";
import path from "path";
import { fileURLToPath } from "url";

import { loadArtifacts } from "@iguhealth/artifacts";
import { FHIRRequest } from "@iguhealth/client/lib/types/index.js";
import {
  AResource,
  Bundle,
  Resource,
  ResourceType,
  canonical,
} from "@iguhealth/fhir-types/lib/generated/r4/types";
import {
  FHIR_VERSION,
  VersionedAResource,
  VersionedResourceType,
} from "@iguhealth/fhir-types/lib/versions.js";
import { OperationError, outcomeFatal } from "@iguhealth/operation-outcomes";

import { testServices } from "./test-ctx.js";
import { buildTransactionTopologicalGraph } from "./transactions";

function loadResources(resourceTypes: ResourceType[]): Resource[] {
  const artifactResources: Resource[] = resourceTypes
    .map((resourceType) =>
      loadArtifacts({
        resourceType,
        packageLocation: path.join(fileURLToPath(import.meta.url), "../../"),
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
    Type extends VersionedResourceType<FHIRVersion>,
  >(
    fhirVersion: FHIRVersion,
    type: Type,
    url: canonical,
  ): VersionedAResource<FHIRVersion, Type> | undefined {
    // @ts-ignore
    const sd = resources.find((sd) => sd.url === url);
    if (!sd) throw new Error(`Could not resolve url ${url}`);
    return sd as VersionedAResource<FHIRVersion, Type> | undefined;
  },
};

test("Generate a graph from a transaction", () => {
  const result = buildTransactionTopologicalGraph(CTX, "4.0", {
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
  expect(result).toMatchSnapshot();
  expect(result.order).toEqual(["1", "0"]);
});

test("Test Cyclical", () => {
  expect(() => {
    return buildTransactionTopologicalGraph(CTX, "4.0", {
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
  }).toThrow(
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
    buildTransactionTopologicalGraph(CTX, "4.0", {
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
