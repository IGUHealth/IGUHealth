import path from "path";
import { fileURLToPath } from "url";
import { expect, test } from "@jest/globals";

import { StructureDefinition } from "@iguhealth/fhir-types/lib/r4/types";
import { loadArtifacts } from "@iguhealth/artifacts";
import HTTPClient from "@iguhealth/client/lib/http";
import { StructureDefinitionSnapshot } from "@iguhealth/generated-ops/lib/r4/ops";

import usCoreDifferential from "../data/us-core-differential";

const sds = loadArtifacts({
  resourceType: "StructureDefinition",
  packageLocation: path.join(fileURLToPath(import.meta.url), "../../../"),
});

const client = HTTPClient({
  url: "http://localhost:3000/w/system/api/v1/fhir/r4",
  getAccessToken: async function () {
    return "pub_token";
  },
});

const PATIENT_URL = "http://hl7.org/fhir/StructureDefinition/Patient";

test("Patient expansion", async () => {
  const result = await client
    .invoke_type(StructureDefinitionSnapshot.Op, {}, "StructureDefinition", {
      url: PATIENT_URL,
    })
    .catch((e) => e.operationOutcome);
  expect(result).toEqual(sds.find((sd) => sd.url === PATIENT_URL));

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
      } as StructureDefinition,
    })
    .catch((e) => e.operationOutcome);

  expect(patientTest.snapshot.element).toMatchSnapshot();
});

test("us-core-snapshot", async () => {
  const usCoreSnapshot = await client
    .invoke_type(StructureDefinitionSnapshot.Op, {}, "StructureDefinition", {
      definition: { ...usCoreDifferential, snapshot: undefined },
    })
    .catch((e) => console.error(e.operationOutcome));

  const idSets = new Set(
    sds.find((sd) => sd.url === PATIENT_URL)?.snapshot?.element.map((e) => e.id)
  );

  usCoreDifferential?.differential?.element?.forEach((e) => idSets.add(e.id));

  expect(usCoreSnapshot?.snapshot?.element.map((e) => e.id).sort()).toEqual(
    Array.from(idSets).sort()
  );
});
