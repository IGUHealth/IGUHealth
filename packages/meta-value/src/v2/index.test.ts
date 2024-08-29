import { expect, test } from "@jest/globals";

import { Patient } from "@iguhealth/fhir-types/lib/generated/r4/types";
import { R4 } from "@iguhealth/fhir-types/versions";

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
