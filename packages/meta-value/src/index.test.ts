import { MetaValueSingular, MetaValueArray, descend } from "./index";
import { loadArtifacts } from "@iguhealth/artifacts";
import {
  StructureDefinition,
  Patient,
  ConceptMap,
} from "@iguhealth/fhir-types/r4/types";
// import { evaluate } from "@iguhealth/fhirpath";
import { expect, test } from "@jest/globals";
import path from "path";

const sds: StructureDefinition[] = loadArtifacts(
  "StructureDefinition",
  path.join(__dirname)
);

const patientSD = sds.find(
  (sd) => sd.type === "Patient"
) as StructureDefinition;

function flattenedDescend<T>(
  node: MetaValueSingular<T>,
  field: string
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
  };
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
  };
  const myValue = new MetaValueSingular(
    {
      type: {
        type: "Patient",
        getSD: (type: string) => {
          const foundSD = sds.find((sd) => sd.type === type);
          return foundSD;
        },
      },
    },
    patient
  ) as any;

  expect(descend(myValue, "name")?.valueOf()).toEqual([{ given: ["bob"] }]);
  expect(descend(myValue, "name")?.meta()?.type).toEqual("HumanName");
  expect(descend(myValue, "identifier")?.meta()?.type).toEqual("Identifier");
  expect(descend(myValue, "id")?.meta()?.type).toEqual(
    "http://hl7.org/fhirpath/System.String"
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
  };
  const myValue = new MetaValueSingular(
    {
      type: {
        type: "ConceptMap",
        getSD: (type: string) => {
          const foundSD = sds.find((sd) => sd.type === type);
          return foundSD;
        },
      },
    },
    cm
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
  };
  const myValue = new MetaValueSingular(
    {
      type: {
        type: "Patient",
        getSD: (type: string) => {
          const foundSD = sds.find((sd) => sd.type === type);
          return foundSD;
        },
      },
    },
    patient
  ) as any;
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
