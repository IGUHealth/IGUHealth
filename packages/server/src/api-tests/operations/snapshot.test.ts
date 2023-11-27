import path from "node:path";
import { expect, test } from "@jest/globals";

import { loadArtifacts } from "@iguhealth/artifacts";
import HTTPClient from "@iguhealth/client/lib/http";
import { StructureDefinitionSnapshot } from "@iguhealth/generated-ops/r4";

const sds = loadArtifacts(
  "StructureDefinition",
  path.join(__dirname, "../../")
);

const client = HTTPClient({
  url: "http://localhost:3000/w/system/api/v1/fhir/r4",
  getAccessToken: async function () {
    return "blah";
  },
});

test("Patient expansion", async () => {
  const patientUrl = "http://hl7.org/fhir/StructureDefinition/Patient";
  const result = await client
    .invoke_type(StructureDefinitionSnapshot.Op, {}, "StructureDefinition", {
      url: patientUrl,
    })
    .catch((e) => e.operationOutcome);
  expect(result).toEqual(sds.find((sd) => sd.url === patientUrl));

  const patientTest = await client
    .invoke_type(StructureDefinitionSnapshot.Op, {}, "StructureDefinition", {
      definition: {
        resourceType: "StructureDefinition",
        baseDefinition: "http://hl7.org/fhir/StructureDefinition/Patient",
        url: "https://iguhealth.app/StructureDefinition/patient-test",
        name: "patient test",
        status: "active",
        kind: "resource",
        abstract: false,
        type: "Patient",
        derivation: "constraint",
        differential: {
          element: [
            {
              id: "Patient.identifier",
              path: "Patient.identifier",
              min: 0,
              max: "1",
              type: [
                {
                  code: "Identifier",
                },
              ],
            },
          ],
        },
      },
    })
    .catch((e) => e.operationOutcome);

  expect(patientTest.snapshot.element).toMatchSnapshot();
});
