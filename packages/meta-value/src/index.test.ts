import { expect, test } from "@jest/globals";
import path from "path";
import { fileURLToPath } from "url";

import { loadArtifacts } from "@iguhealth/artifacts";
import {
  ConceptMap,
  Patient,
  Practitioner,
  StructureDefinition,
  uri,
} from "@iguhealth/fhir-types/lib/generated/r4/types";
import {
  FHIR_VERSION,
  R4,
  VersionedAResource,
} from "@iguhealth/fhir-types/lib/versions";

import { MetaValueArray, MetaValueSingular, descend } from "./index";

const sds: StructureDefinition[] = loadArtifacts({
  fhirVersion: R4,
  resourceType: "StructureDefinition",
  packageLocation: path.join(fileURLToPath(import.meta.url), ".."),
});

const getSD = <Version extends FHIR_VERSION>(_version: Version, type: uri) => {
  const foundSD = sds.find((sd) => sd.type === type);
  return foundSD as
    | VersionedAResource<Version, "StructureDefinition">
    | undefined;
};

const patientSD = sds.find(
  (sd) => sd.type === "Patient",
) as StructureDefinition;

function flattenedDescend<T>(
  node: MetaValueSingular<T>,
  field: string,
): MetaValueSingular<unknown>[] {
  const v = descend(node, field);
  if (v instanceof MetaValueArray) return v.toArray();
  if (v instanceof MetaValueSingular) return [v];
  return [];
}

test("Untyped", () => {
  const patient: Patient = {
    id: "123",
    resourceType: "Patient",
    identifier: [{ system: "mrn", value: "123" }],
    name: [{ given: ["bob"] }],
    deceasedBoolean: true,
  } as Patient;
  const myValue = new MetaValueSingular({}, patient) as any;

  expect(descend(myValue, "name")?.valueOf()).toEqual([{ given: ["bob"] }]);
  expect(descend(myValue, "deceased")?.valueOf()).toEqual(true);
  expect(descend(myValue, "identifier")?.valueOf()).toEqual([
    { system: "mrn", value: "123" },
  ]);
  expect(descend(myValue, "nonExistent")?.valueOf()).toEqual(undefined);
});

test("Simple Type test", () => {
  const patient: Patient = {
    id: "123",
    resourceType: "Patient",
    identifier: [{ system: "mrn", value: "123" }],
    name: [{ given: ["bob"] }],
    deceasedBoolean: true,
  } as Patient;
  const myValue = new MetaValueSingular(
    {
      type: {
        type: "Patient" as uri,
        getSD,
      },
    },
    patient,
  ) as any;

  expect(descend(myValue, "name")?.valueOf()).toEqual([{ given: ["bob"] }]);
  expect(descend(myValue, "name")?.meta()?.type).toEqual("HumanName");
  expect(descend(myValue, "identifier")?.meta()?.type).toEqual("Identifier");
  expect(descend(myValue, "id")?.meta()?.type).toEqual(
    "http://hl7.org/fhirpath/System.String",
  );
  expect(descend(myValue, "deceased")?.valueOf()).toEqual(true);
  expect(descend(myValue, "deceased")?.meta()?.type).toEqual("boolean");

  let output: (string | undefined)[] = [];
  const v = descend(myValue, "identifier");
  if (v && v.isArray()) {
    output = v.toArray().map((v) => descend(v, "system")?.meta()?.type);
  }
  expect(output).toEqual(["uri"]);
});

test("ConceptMap test", () => {
  const cm: ConceptMap = {
    resourceType: "ConceptMap",
    status: "final",
    group: [
      {
        unmapped: {
          mode: "other-map",
          url: "test",
        },
        element: [
          {
            target: [
              {
                equivalence: "equal",
                dependsOn: [
                  { property: "system", value: "http://snomed.info/sct" },
                ],
                product: [
                  {
                    property: "code",
                    system: "http://snomed.info/sct",
                    value: "123",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  } as ConceptMap;
  const myValue = new MetaValueSingular(
    {
      type: {
        type: "ConceptMap" as uri,
        getSD,
      },
    },
    cm,
  ) as any;
  //ConceptMap.group.element.target.product.property
  let cur = flattenedDescend(myValue, "group");
  expect(cur[0]?.meta()?.type).toEqual("BackboneElement");
  cur = flattenedDescend(cur[0], "element");
  expect(cur[0]?.meta()?.type).toEqual("BackboneElement");
  cur = flattenedDescend(cur[0], "target");
  expect(cur[0]?.meta()?.type).toEqual("BackboneElement");
  cur = flattenedDescend(cur[0], "product");
  expect(cur[0]?.meta()?.type).toEqual("BackboneElement");
  cur = flattenedDescend(cur[0], "property");
  expect(cur[0]?.meta()?.type).toEqual("uri");

  // Test unmapped
  cur = flattenedDescend(myValue, "group");
  expect(cur[0]?.meta()?.type).toEqual("BackboneElement");
  cur = flattenedDescend(cur[0], "unmapped");
  expect(cur[0]?.meta()?.type).toEqual("BackboneElement");
  cur = flattenedDescend(cur[0], "url");
  expect(cur[0]?.meta()?.type).toEqual("canonical");
});

test("Location test", () => {
  const patient: Patient = {
    id: "123",
    resourceType: "Patient",
    identifier: [{ system: "mrn", value: "123" }],
    name: [{ given: ["bob", "frank"] }],
    deceasedBoolean: true,
  } as Patient;
  const myValue = new MetaValueSingular(
    {
      type: {
        type: "Patient" as uri,
        getSD,
      },
    },
    patient,
  );
  let cur = flattenedDescend(myValue, "name");
  cur = flattenedDescend(cur[0], "given");
  expect(cur.map((v) => v.location())).toEqual([
    ["name", 0, "given", 0],
    ["name", 0, "given", 1],
  ]);

  cur = flattenedDescend(myValue, "identifier");
  cur = flattenedDescend(cur[0], "system");
  expect(cur[0].location()).toEqual(["identifier", 0, "system"]);
});

test("typechoice", () => {
  const practitioner: Practitioner = {
    extension: [{ url: "test", valueReference: { reference: "urn:oid:2" } }],
    resourceType: "Practitioner",
    name: [{ given: ["Bob"] }],
  } as Practitioner;
  const myValue = new MetaValueSingular(
    {
      type: {
        type: "Practitioner" as uri,
        getSD,
      },
    },
    practitioner,
  );

  let cur = flattenedDescend(myValue, "extension");
  cur = flattenedDescend(cur[0], "value");

  expect(cur[0].meta()?.type).toEqual("Reference");

  cur = flattenedDescend(myValue, "extension");
  cur = flattenedDescend(cur[0], "valueReference");
  expect(cur[0].meta()?.type).toEqual("Reference");
});

function getValue(loc: (string | number)[] = [], obj: any) {
  let cur: any = obj;
  for (const l of loc) {
    cur = cur[l];
  }
  return cur;
}

test("Location test primitive extensions", () => {
  const patient = new MetaValueSingular(
    {
      type: {
        type: "Practitioner" as uri,
        getSD,
      },
    },
    {
      id: "123",
      resourceType: "Patient",
      identifier: [{ system: "mrn", value: "123" }],
      deceasedBoolean: true,
      name: [
        {
          given: ["Bob"],
          _given: [
            { extension: [{ url: "https://given.com", valueString: "given" }] },
          ],
        },
      ],
      _deceasedBoolean: {
        extension: [{ url: "https://test.com", valueString: "boolean" }],
      },
    },
  );

  let cur = flattenedDescend(patient, "deceased");
  cur = flattenedDescend(cur[0], "extension");
  cur = flattenedDescend(cur[0], "value");
  expect(cur[0].location()).toEqual([
    "_deceasedBoolean",
    "extension",
    0,
    "valueString",
  ]);
  expect(cur[0].valueOf()).toEqual("boolean");
  expect(getValue(cur[0].location(), patient.valueOf())).toEqual("boolean");

  cur = flattenedDescend(patient, "name");
  cur = flattenedDescend(cur[0], "given");
  cur = flattenedDescend(cur[0], "extension");
  cur = flattenedDescend(cur[0], "value");

  expect(cur[0].location()).toEqual([
    "name",
    0,
    "_given",
    0,
    "extension",
    0,
    "valueString",
  ]);
  expect(cur[0].valueOf()).toEqual("given");
  expect(getValue(cur[0].location(), patient.valueOf())).toEqual("given");
});
