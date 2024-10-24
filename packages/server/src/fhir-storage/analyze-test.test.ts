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
import analyze from "@iguhealth/fhirpath/analyze";

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
          "hl7.fhir.r4.core",
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
    (await analyze(R4, "Patient" as uri, "id")).map((v) => ({
      type: v.meta()?.type,
      cardinality: v.cardinality(),
    })),
  ).toEqual([
    { cardinality: "single", type: "http://hl7.org/fhirpath/System.String" },
  ]);
});

test("OF type with or", async () => {
  expect(
    (
      await analyze(
        R4,
        "Group" as uri,
        "(Group.characteristic.value.ofType(CodeableConcept)) | (Group.characteristic.value.ofType(boolean))",
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

test("Parameters", async () => {
  const res = {};
  for (const parameter of searchParameters) {
    for (const base of parameter.base) {
      const evalResult = await analyze(
        R4,
        base as unknown as uri,
        parameter.expression as string,
      );

      res[parameter.url] = {
        ...res[parameter.url],
        [base]: {
          expression: parameter.expression,
          result: evalResult.map((v) => ({
            type: v.meta()?.type,
            cardinality: "cardinality" in v ? v.cardinality() : "unknown",
          })),
        },
      };
    }
  }

  expect(res).toMatchSnapshot();
});
