import { expect, test } from "@jest/globals";
import path from "path";
import { fileURLToPath } from "url";

import { loadArtifacts } from "@iguhealth/artifacts";
import HTTPClient from "@iguhealth/client/lib/http";
import { StructureDefinition } from "@iguhealth/fhir-types/lib/generated/r4/types";
import { R4 } from "@iguhealth/fhir-types/lib/versions";
import { StructureDefinitionSnapshot } from "@iguhealth/generated-ops/lib/r4/ops";

import usCoreDifferential from "../data/us-core-differential";

const sds = loadArtifacts({
  fhirVersion: R4,
  resourceType: "StructureDefinition",
  packageLocation: path.join(fileURLToPath(import.meta.url), "../../../../"),
  silence: true,
});

const client = HTTPClient({
  url: "http://localhost:3000/w/system",
  getAccessToken: async function () {
    return "pub_token";
  },
});

const PATIENT_URL = "http://hl7.org/fhir/StructureDefinition/Patient";

test("Patient expansion", async () => {
  const result = await client
    .invoke_type(
      StructureDefinitionSnapshot.Op,
      {},
      R4,
      "StructureDefinition",
      {
        url: PATIENT_URL,
      },
    )
    .catch((e) => {
      return e.response.body;
    });

  expect(result).toEqual(sds.find((sd) => sd.url === PATIENT_URL));

  const patientTest = await client
    .invoke_type(
      StructureDefinitionSnapshot.Op,
      {},
      R4,
      "StructureDefinition",
      {
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
      },
    )
    .catch((e) => e.response.body);

  expect(patientTest.snapshot.element).toMatchSnapshot();
});

test("us-core-snapshot", async () => {
  const usCoreSnapshot = await client
    .invoke_type(
      StructureDefinitionSnapshot.Op,
      {},
      R4,
      "StructureDefinition",
      {
        definition: { ...usCoreDifferential, snapshot: undefined },
      },
    )
    .catch((e) => console.error(e.response.body));

  const idSets = new Set(
    sds
      .find((sd) => sd.url === PATIENT_URL)
      ?.snapshot?.element.map((e) => e.id),
  );

  usCoreDifferential?.differential?.element?.forEach((e) => idSets.add(e.id));

  expect(usCoreSnapshot?.snapshot?.element.map((e) => e.id).sort()).toEqual(
    Array.from(idSets).sort(),
  );
});
