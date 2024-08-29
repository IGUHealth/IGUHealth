import { expect, test } from "@jest/globals";

import { ConceptMap, Patient } from "@iguhealth/fhir-types/r4/types";
import { R4 } from "@iguhealth/fhir-types/versions";

import { flatten } from "../utilities";
import { metaValue } from "./index";

test("Simple Type test", async () => {
  const patient: Patient = {
    id: "123",
    resourceType: "Patient",
    identifier: [{ system: "mrn", value: "123" }],
    name: [{ given: ["bob"], _given: [{ id: "test" }] }],
    deceasedBoolean: true,
  } as Patient;

  let root = await metaValue({ fhirVersion: R4 }, patient, []);
  let value = root?.descend("name");
  expect(value?.meta()?.type).toEqual("HumanName");
  value = value?.descend(0)?.descend("given");
  expect(value?.meta()?.type).toEqual("string");
  expect(value?.descend(0)?.getValue()).toEqual("bob");
  value = value?.descend(0)?.descend("id");
  expect(value?.meta()?.type).toEqual("http://hl7.org/fhirpath/System.String");
  expect(value?.getValue()).toEqual("test");
});

test("Simple Type test", async () => {
  const patient: Patient = {
    id: "123",
    resourceType: "Patient",
    identifier: [{ system: "mrn", value: "123" }],
    name: [{ given: ["bob"] }],
    deceasedBoolean: true,
  } as Patient;
  const myValue = await metaValue({ fhirVersion: R4 }, patient);
  expect(myValue?.descend("name")?.getValue()).toEqual([{ given: ["bob"] }]);
  expect(myValue?.descend("name")?.meta()?.type).toEqual("HumanName");
  expect(myValue?.descend("identifier")?.meta()?.type).toEqual("Identifier");
  expect(myValue?.descend("id")?.meta()?.type).toEqual(
    "http://hl7.org/fhirpath/System.String",
  );
  expect(myValue?.descend("deceased")?.getValue()).toEqual(true);
  expect(myValue?.descend("deceased")?.meta()?.type).toEqual("boolean");

  expect(
    flatten(myValue?.descend("identifier")).map(
      (v) => v.descend("system")?.meta()?.type,
    ),
  ).toEqual(["uri"]);
});

test("ConceptMap test", async () => {
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

  const myValue = await metaValue({ fhirVersion: R4 }, cm);

  //ConceptMap.group.element.target.product.property
  let cur = flatten(myValue?.descend("group"))[0];
  expect(cur?.meta()?.type).toEqual("BackboneElement");
  cur = flatten(cur.descend("element"))[0];
  expect(cur?.meta()?.type).toEqual("BackboneElement");
  cur = flatten(cur.descend("target"))[0];
  expect(cur?.meta()?.type).toEqual("BackboneElement");
  cur = flatten(cur.descend("product"))[0];
  expect(cur?.meta()?.type).toEqual("BackboneElement");
  cur = flatten(cur.descend("property"))[0];
  expect(cur?.meta()?.type).toEqual("uri");

  // Test unmapped
  cur = flatten(myValue?.descend("group"))[0];
  expect(cur?.meta()?.type).toEqual("BackboneElement");
  cur = flatten(cur.descend("unmapped"))[0];
  expect(cur?.meta()?.type).toEqual("BackboneElement");
  cur = flatten(cur.descend("url"))[0];
  expect(cur?.meta()?.type).toEqual("canonical");
});

// test("Location test", async () => {
//   const patient: Patient = {
//     id: "123",
//     resourceType: "Patient",
//     identifier: [{ system: "mrn", value: "123" }],
//     name: [{ given: ["bob", "frank"] }],
//     deceasedBoolean: true,
//   } as Patient;
//   const myValue = flatten(
//     await metaValue(meta(R4, "Patient" as uri), patient),
//   )[0];
//   let cur = flatten(await descend(myValue, "name"));
//   cur = flatten(await descend(cur[0], "given"));
//   expect(cur.map((v) => v.location())).toEqual([
//     ["name", 0, "given", 0],
//     ["name", 0, "given", 1],
//   ]);

//   cur = flatten(await descend(myValue, "identifier"));
//   cur = flatten(await descend(cur[0], "system"));
//   expect(cur[0].location()).toEqual(["identifier", 0, "system"]);
// });
