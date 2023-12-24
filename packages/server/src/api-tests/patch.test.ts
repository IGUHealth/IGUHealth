import { expect, test } from "@jest/globals";

import { Resource, Bundle, Patient, id } from "@iguhealth/fhir-types/r4/types";
import HTTPClient from "@iguhealth/client/http";

const client = HTTPClient({
  url: "http://localhost:3000/w/system/api/v1/fhir/r4",
  getAccessToken: async function () {
    return "blah";
  },
});

test("Test successfull patch", async () => {
  const resources: Resource[] = [];
  try {
    const patient = (await client.create(
      {},
      {
        resourceType: "Patient",
      }
    )) as Patient;

    resources.push(patient);

    const patientUpdated = await client
      .patch({}, patient, [
        { op: "add", path: "/name", value: [] },
        { op: "add", path: "/name/0", value: {} },
        { op: "add", path: "/name/0/family", value: "Smith" },
      ])
      .catch((e) => {
        throw e.operationOutcome;
      });

    expect(patientUpdated.name).toEqual([{ family: "Smith" }]);

    const OOFAILURE = await client
      .patch({}, patient, [{ op: "add", path: "/d", value: "Smith" }])
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
      .patch({}, patient, [{ z: "add", path: "/d", value: "Smith" }])
      .catch((e) => {
        return e.operationOutcome;
      });

    expect(invalidPatchData).toEqual({
      issue: [
        {
          code: "invalid",
          diagnostics: "JSON Patch is not valid.",
          severity: "error",
        },
      ],
      resourceType: "OperationOutcome",
    });

    const invalidAppliedPatch = await client
      .patch({}, patient, [{ op: "add", path: "/d/1", value: "Z" }])
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
        return await client.delete({}, resourceType, id as id);
      })
    );
  }
});
