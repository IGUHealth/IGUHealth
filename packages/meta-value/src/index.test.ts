import { MetaValueSingular, descend } from "./index";
import loadArtifacts from "@genfhi/artifacts/loadArtifacts";
import { StructureDefinition, Patient } from "@genfhi/fhir-types/r4/types";
// import { evaluate } from "@genfhi/fhirpath";
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
    id: "123",
    resourceType: "Patient",
    identifier: [{ system: "mrn", value: "123" }],
    name: [{ given: ["bob"] }],
    deceasedBoolean: true,
  };
  const myValue = new MetaValueSingular(
    {
      sd: patientSD,
      elementIndex: 0,
      type: "Patient",
      getSD: (type: string) => {
        const foundSD = sds.find((sd) => sd.type === type);
        return foundSD;
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

// test("Test FHIRPATH", () => {
//   const patient: Patient = {
//     resourceType: "Patient",
//     identifier: [{ system: "mrn", value: "123" }],
//     name: [{ given: ["bob"] }],
//   };
//   const myValue = createProxy({
//     meta: {
//       sd: patientSD,
//       elementIndex: 0,
//       type: "Patient",
//       cardinality: "singular",
//     },
//     value: patient,
//   }) as any;

//   expect(evaluate("$this.identifier.where(system='mrn')", myValue)).toEqual([
//     { system: "mrn", value: "123" },
//   ]);

//   expect(
//     evaluate("$this.identifier.where(system='mrn')", myValue).map((r) => {
//       //@ts-ignore
//       console.log(r.given);
//       // @ts-ignore
//       return r.__meta__.type;
//     })
//   ).toEqual(["HumanName"]);
// });
