import path from "path";
import { fileURLToPath } from "url";
import { test, expect } from "@jest/globals";

import { loadArtifacts } from "@iguhealth/artifacts";
import { R4 } from "@iguhealth/fhir-types/versions";
import { descend, pointer } from "@iguhealth/fhir-pointer";

import { getSliceIndices, splitSlicing, validateSlices } from "./slicing.js";
import { id, Observation } from "@iguhealth/fhir-types/lib/generated/r4/types";

const profiles = loadArtifacts({
  fhirVersion: R4,
  loadDevelopmentPackages: true,
  resourceType: "StructureDefinition",
  packageLocation: path.join(fileURLToPath(import.meta.url), "../.."),
  silence: true,
  onlyPackages: ["hl7.fhir.us.core"],
});

const bloodProfile = profiles.find(
  (p) =>
    p.url ===
    "http://hl7.org/fhir/us/core/StructureDefinition/us-core-blood-pressure",
);

test("getSliceIndices", () => {
  const elements = bloodProfile?.differential?.element ?? [];
  const sliceIndexes = getSliceIndices(elements, 0);

  expect(sliceIndexes).toEqual([
    {
      discriminator: 2,
      slices: [3, 10],
    },
  ]);

  expect(elements[sliceIndexes[0].discriminator]?.path).toEqual(
    "Observation.component",
  );

  expect(elements[sliceIndexes[0].slices[0]]?.path).toEqual(
    "Observation.component",
  );
  expect(elements[sliceIndexes[0].slices[0]]?.id).toEqual(
    "Observation.component:systolic",
  );

  expect(elements[sliceIndexes[0].slices[1]]?.path).toEqual(
    "Observation.component",
  );
  expect(elements[sliceIndexes[0].slices[1]]?.id).toEqual(
    "Observation.component:diastolic",
  );
});

const bloodPressureObservation: Observation = {
  id: "blood-pressure-observation",
  resourceType: "Observation",
  status: "final",
  category: [
    {
      coding: [
        {
          system: "http://terminology.hl7.org/CodeSystem/observation-category",
          code: "vital-signs",
          display: "Vital Signs",
        },
      ],
      text: "Vital Signs",
    },
  ],
  code: {
    coding: [
      {
        system: "http://loinc.org",
        code: "85354-9",
        display: "Blood pressure panel with all children optional",
      },
    ],
    text: "Blood pressure systolic and diastolic",
  },
  subject: {
    reference: "Patient/example",
    display: "Amy Shaw",
  },
  encounter: {
    display: "GP Visit",
  },
  effectiveDateTime: "1999-07-02",
  component: [
    {
      code: {
        coding: [
          {
            system: "http://loinc.org",
            code: "8480-6",
            display: "Systolic blood pressure",
          },
        ],
        text: "Systolic blood pressure",
      },
      valueQuantity: {
        value: 109,
        unit: "mmHg",
        system: "http://unitsofmeasure.org",
        code: "mm[Hg]",
      },
    },
    {
      code: {
        coding: [
          {
            system: "http://loinc.org",
            code: "8462-4",
            display: "Diastolic blood pressure",
          },
        ],
        text: "Diastolic blood pressure",
      },
      valueQuantity: {
        value: 44,
        unit: "mmHg",
        system: "http://unitsofmeasure.org",
        code: "mm[Hg]",
      },
    },
  ],
} as Observation;

test("Slicing Validation", async () => {
  const elements = bloodProfile?.differential?.element ?? [];
  const sliceIndexes = getSliceIndices(elements, 0);
});

test("Slice Splitting", async () => {
  const elements = bloodProfile?.differential?.element ?? [];
  const sliceIndexes = getSliceIndices(elements, 0);

  expect(
    splitSlicing(
      elements,
      sliceIndexes[0],
      bloodPressureObservation,
      descend(
        pointer("Observation", bloodPressureObservation.id as id),
        "component",
      ),
    ),
  ).resolves.toEqual({
    3: ["Observation|blood-pressure-observation/component/0"],
    10: ["Observation|blood-pressure-observation/component/1"],
  });

  expect(
    bloodPressureObservation?.component?.[0]?.code.coding?.[0]?.code,
  ).toEqual("8480-6");
  expect(
    bloodPressureObservation?.component?.[1]?.code.coding?.[0]?.code,
  ).toEqual("8462-4");
  expect(bloodProfile?.differential?.element[3]?.sliceName).toEqual("systolic");
});
