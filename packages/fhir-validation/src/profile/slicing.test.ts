import path from "path";
import { fileURLToPath } from "url";
import { test, expect } from "@jest/globals";

import { loadArtifacts } from "@iguhealth/artifacts";
import {
  AllResourceTypes,
  FHIR_VERSION,
  R4,
  Resource,
  ResourceType,
} from "@iguhealth/fhir-types/versions";
import { descend, pointer } from "@iguhealth/fhir-pointer";
import {
  canonical,
  id,
  Observation,
  StructureDefinition,
  uri,
} from "@iguhealth/fhir-types/r4/types";

import { getSliceIndices, splitSlicing, validateSlices } from "./slicing.js";
import { ValidationCTX } from "../types.js";

function createMemoryDatabase(
  resourceTypes: ResourceType<R4>[],
): Record<ResourceType<R4>, Resource<FHIR_VERSION, AllResourceTypes>[]> {
  const data: Record<
    ResourceType<R4>,
    Resource<FHIR_VERSION, AllResourceTypes>[]
  > = {} as Record<
    ResourceType<R4>,
    Resource<FHIR_VERSION, AllResourceTypes>[]
  >;
  for (const resourceType of resourceTypes) {
    const resources = loadArtifacts({
      fhirVersion: R4,
      loadDevelopmentPackages: true,
      resourceType: resourceType,
      packageLocation: path.join(fileURLToPath(import.meta.url), "../.."),
      silence: true,
      onlyPackages: [
        "hl7.fhir.us.core",
        "@iguhealth/hl7.fhir.r4.core",
        "@iguhealth/hl7.fhir.r4.test-data",
      ],
    });
    data[resourceType] = resources;
  }

  return data;
}

const memDatabase = createMemoryDatabase([
  "StructureDefinition",
] as ResourceType<R4>[]);

const CTX: ValidationCTX = {
  fhirVersion: R4,
  resolveTypeToCanonical: async (
    version: FHIR_VERSION,
    type: uri,
  ): Promise<canonical> => {
    return `http://hl7.org/fhir/StructureDefinition/${type}` as canonical;
  },
  resolveCanonical: async <
    Version extends FHIR_VERSION,
    Type extends ResourceType<Version>,
  >(
    version: Version,
    t: Type,
    url: canonical,
  ): Promise<Resource<Version, Type>> => {
    // @ts-ignore
    const sd: Resource<Version, Type> = memDatabase[t].find(
      (sd: unknown) => (sd as StructureDefinition).url === url,
    ) as Resource<Version, Type>;
    if (!sd) throw new Error(`Couldn't find sd with url '${url}'`);
    return sd as Resource<Version, Type>;
  },
};

const bloodProfile: StructureDefinition = memDatabase[
  "StructureDefinition"
].find(
  (p) =>
    (p as StructureDefinition).url ===
    "http://hl7.org/fhir/us/core/StructureDefinition/us-core-blood-pressure",
) as StructureDefinition;

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

test("Slice Validation", async () => {
  const elements = bloodProfile?.differential?.element ?? [];
  const sliceIndexes = getSliceIndices(elements, 0);

  expect(
    validateSlices(
      CTX,
      bloodProfile,
      sliceIndexes[0],
      bloodPressureObservation,
      pointer("Observation", bloodPressureObservation.id as id),
    ),
  ).resolves.toEqual([]);
});
