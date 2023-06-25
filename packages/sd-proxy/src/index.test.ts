import { createProxy } from "./index";
import loadArtifacts from "@genfhi/artifacts/loadArtifacts";
import { StructureDefinition, Patient } from "@genfhi/fhir-types";
import { createRequire } from "module";

console.log(process.cwd());
const requirer = createRequire(process.cwd() + "/");
console.log("AYO");
console.log(requirer("../package.json"));

const sds: StructureDefinition[] = loadArtifacts("StructureDefinition");

const patientSD = sds.find(
  (sd) => sd.type === "Patient"
) as StructureDefinition;

test("Simple Proxy Test", () => {
  const patient: Patient = {
    resourceType: "Patient",
    name: [{ given: ["bob"] }],
  };
  const myValue = createProxy(patientSD, patient, 0) as any;
  expect(myValue.name).toEqual([{ given: ["bob"] }]);
  expect(myValue.name.__meta__).toEqual("HumanName");
});
