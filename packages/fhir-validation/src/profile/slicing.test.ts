import path from "path";
import { fileURLToPath } from "url";
import { test, expect } from "@jest/globals";

import { loadArtifacts } from "@iguhealth/artifacts";
import { R4 } from "@iguhealth/fhir-types/versions";

import { getSliceIndices } from "./slicing.js";

const profiles = loadArtifacts({
  fhirVersion: R4,
  loadDevelopmentPackages: true,
  resourceType: "StructureDefinition",
  packageLocation: path.join(fileURLToPath(import.meta.url), "../.."),
  silence: true,
  onlyPackages: ["hl7.fhir.us.core"],
});

test("getSliceIndices", () => {
  const bloodProfile = profiles.find(
    (p) =>
      p.url ===
      "http://hl7.org/fhir/us/core/StructureDefinition/us-core-blood-pressure",
  );
  const elements = bloodProfile?.differential?.element ?? [];
  const sliceIndexes = getSliceIndices(elements, 0);

  expect(sliceIndexes).toEqual([
    {
      discriminator: 2,
      elements: [3, 10],
    },
  ]);

  expect(elements[sliceIndexes[0].discriminator]?.path).toEqual(
    "Observation.component",
  );

  expect(elements[sliceIndexes[0].elements[0]]?.path).toEqual(
    "Observation.component",
  );
  expect(elements[sliceIndexes[0].elements[0]]?.id).toEqual(
    "Observation.component:systolic",
  );

  expect(elements[sliceIndexes[0].elements[1]]?.path).toEqual(
    "Observation.component",
  );
  expect(elements[sliceIndexes[0].elements[1]]?.id).toEqual(
    "Observation.component:diastolic",
  );
});
