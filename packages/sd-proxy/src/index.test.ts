import { createProxy } from "./index";
import loadArtifacts from "@genfhi/artifacts/loadArtifacts";
import { StructureDefinition, Patient } from "@genfhi/fhir-types/r4/types";

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
  const myValue = createProxy(patientSD, patient, 0) as any;

  expect(myValue.name.valueOf()).toEqual([{ given: ["bob"] }]);
  expect(myValue.name.__meta__).toEqual(
    patientSD.snapshot?.element.find((e) => e.path === "Patient.name")
  );
});
