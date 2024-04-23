import { expect, test } from "@jest/globals";

import HTTPClient from "@iguhealth/client/lib/http";
import {
  Patient,
  Resource,
  id,
} from "@iguhealth/fhir-types/lib/generated/r4/types";

const client = HTTPClient({
  url: "http://localhost:3000/w/system",
  getAccessToken: async function () {
    return "pub_token";
  },
});

test("Test successfull patch", async () => {
  const resources: Resource[] = [];
  try {
    const patient = (await client.create({}, "4.0", {
      resourceType: "Patient",
    })) as Patient;

    resources.push(patient);

    const patientUpdated = await client
      .patch({}, "4.0", patient.resourceType, patient.id as id, [
        { op: "add", path: "/name", value: [] },
        { op: "add", path: "/name/0", value: {} },
        { op: "add", path: "/name/0/family", value: "Smith" },
      ])
      .catch((e) => {
        throw e.operationOutcome;
      });

    expect(patientUpdated.name).toEqual([{ family: "Smith" }]);

    const OOFAILURE = await client
      .patch({}, "4.0", patient.resourceType, patient.id as id, [
        { op: "add", path: "/d", value: "Smith" },
      ])
      .catch((e) => {
        return e.operationOutcome;
      });

    expect(OOFAILURE).toEqual({
      issue: [
        {
          code: "structure",
          diagnostics: "Additional fields found at path '': 'd'",
          expression: [""],
          severity: "error",
        },
      ],
      resourceType: "OperationOutcome",
    });

    const invalidPatchData = await client
      .patch({}, "4.0", patient.resourceType, patient.id as id, [
        { z: "add", path: "/d", value: "Smith" },
      ])
      .catch((e) => {
        return e.operationOutcome;
      });

    expect(invalidPatchData).toEqual({
      issue: [
        {
          code: "invalid",
          diagnostics:
            "data/0 must have required property 'op', data/0 must have required property 'op', data/0 must have required property 'from', data/0 must match exactly one schema in oneOf",
          severity: "error",
        },
      ],
      resourceType: "OperationOutcome",
    });

    const invalidAppliedPatch = await client
      .patch({}, "4.0", patient.resourceType, patient.id as id, [
        { op: "add", path: "/d/1", value: "Z" },
      ])
      .catch((e) => {
        return e.operationOutcome;
      });

    expect(invalidAppliedPatch).toEqual({
      issue: [
        {
          code: "structure",
          diagnostics: `Patch could not be applied to the given resource '${patient.resourceType}/${patient.id}'`,
          severity: "error",
        },
      ],
      resourceType: "OperationOutcome",
    });
  } finally {
    await Promise.all(
      resources.map(async ({ resourceType, id }) => {
        return await client.delete({}, "4.0", resourceType, id as id);
      }),
    );
  }
});
