import { expect, test } from "@jest/globals";
import path from "path";
import { fileURLToPath } from "url";

import { loadArtifacts } from "@iguhealth/artifacts";
import { uri } from "@iguhealth/fhir-types/lib/generated/r4/types";
import {
  AllResourceTypes,
  FHIR_VERSION,
  R4,
  Resource,
  ResourceType,
} from "@iguhealth/fhir-types/lib/versions";
import * as fhirpath from "@iguhealth/fhirpath";
import spoof from "@iguhealth/meta-value/spoof";

function getArtifactResources<Version extends FHIR_VERSION>(
  fhirVersion: Version,
  resourceTypes: ResourceType<Version>[],
): Resource<Version, AllResourceTypes>[] {
  const artifactResources = resourceTypes
    .map((resourceType) =>
      loadArtifacts({
        fhirVersion,
        loadDevelopmentPackages: true,
        resourceType,
        packageLocation: path.join(fileURLToPath(import.meta.url), "../../"),
        // Limiting to strictly hl7 packages as iguhealth packages changing constantly for snapshots.
        onlyPackages: [
          "@iguhealth/hl7.fhir.r4.core",
          "@iguhealth/hl7.fhir.r4b.core",
          "@iguhealth/hl7.fhir.r4.test-data",
          "@iguhealth/hl7.fhir.r4b.test-data",
        ],
        silence: true,
      }),
    )
    .flat();

  return artifactResources as Resource<Version, AllResourceTypes>[];
}

const r4ArtifactResources = getArtifactResources(R4, ["SearchParameter"]);

const searchParameters = r4ArtifactResources.filter(
  (r): r is Resource<R4, "SearchParameter"> =>
    r.resourceType === "SearchParameter" && r.expression !== undefined,
);

test("R4 Testing spoof resourceType 'SearchParameter'", async () => {
  expect(
    (
      await fhirpath.evaluateWithMeta("id", spoof(R4, "Patient" as uri), {
        fhirVersion: R4,
      })
    ).map((v) => ({ type: v.meta()?.type, cardinality: v.cardinality() })),
  ).toEqual([
    { cardinality: "single", type: "http://hl7.org/fhirpath/System.String" },
  ]);
});

test("OF type with or", async () => {
  expect(
    (
      await fhirpath.evaluateWithMeta(
        "(Group.characteristic.value.ofType(CodeableConcept)) | (Group.characteristic.value.ofType(boolean))",
        spoof(R4, "Group" as uri),
        { fhirVersion: R4 },
      )
    ).map((v) => ({ type: v.meta()?.type, cardinality: v.cardinality() })),
  ).toEqual([
    {
      cardinality: "array",
      type: "CodeableConcept",
    },
    {
      cardinality: "array",
      type: "boolean",
    },
  ]);
});

test.each(searchParameters)(
  `R4 Testing spoof resourceType '%s'`,
  async (parameter) => {
    for (const base of parameter.base ?? []) {
      const value = spoof(R4, base as unknown as uri);
      const evalResult = await fhirpath.evaluateWithMeta(
        parameter.expression as string,
        value,
        {
          fhirVersion: R4,
        },
      );
      expect(
        evalResult.map((v) => ({
          type: v.meta()?.type,
          cardinality: "cardinality" in v ? v.cardinality() : "unknown",
        })),
      ).toMatchSnapshot();
    }
  },
);
