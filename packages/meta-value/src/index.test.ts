import { createProxy } from "./index";
import loadArtifacts from "@genfhi/artifacts/loadArtifacts";
import { StructureDefinition, Patient } from "@genfhi/fhir-types/r4/types";
import { evaluate } from "@genfhi/fhirpath";
import { expect, test } from "@jest/globals";

const sds: StructureDefinition[] = loadArtifacts(
  "StructureDefinition",
  "/sd-proxy/"
);

const patientSD = sds.find(
  (sd) => sd.type === "Patient"
) as StructureDefinition;

test("Simple Proxy Test", () => {
  const patient: Patient = {
    resourceType: "Patient",
    name: [{ given: ["bob"] }],
  };
  const myValue = createProxy({
    meta: {
      sd: patientSD,
      elementIndex: 0,
      type: "Patient",
      cardinality: "singular",
    },
    value: patient,
  }) as any;

  console.log(myValue.name.valueOf());
  expect(myValue.name.map((v: any) => v.valueOf())).toEqual([
    { given: ["bob"] },
  ]);
  expect(myValue.name.__meta__.type).toEqual("HumanName");
  expect(myValue.name.__meta__.cardinality).toEqual("many");
});

test("Test FHIRPATH", () => {
  const patient: Patient = {
    resourceType: "Patient",
    identifier: [{ system: "mrn", value: "123" }],
    name: [{ given: ["bob"] }],
  };
  const myValue = createProxy({
    meta: {
      sd: patientSD,
      elementIndex: 0,
      type: "Patient",
      cardinality: "singular",
    },
    value: patient,
  }) as any;

  expect(evaluate("$this.identifier.where(system='mrn')", myValue)).toEqual([
    { system: "mrn", value: "123" },
  ]);

  expect(
    evaluate("$this.identifier.where(system='mrn')", myValue).map((r) => {
      //@ts-ignore
      console.log(r.given);
      // @ts-ignore
      return r.__meta__.type;
    })
  ).toEqual(["HumanName"]);
});
