import { expect, test } from "@jest/globals";

import HTTPClient from "@iguhealth/client/lib/http";
import { Parameters } from "@iguhealth/fhir-types/lib/generated/r4/types";
import { R4 } from "@iguhealth/fhir-types/lib/versions";

const client = HTTPClient({
  url: "http://localhost:3000/w/system",
  getAccessToken: async function () {
    return "pub_token";
  },
});

test("Test invocation by code Resource Level", async () => {
  const badPatient = { resourceType: "Patient", name: "bob" };
  const invocation = await client
    .invoke_type("validate", {}, R4, "Patient", {
      resourceType: "Parameters",
      parameter: [
        {
          name: "resource",
          // @ts-ignore
          resource: badPatient,
        },
      ],
    } as Parameters)
    .catch((e) => e.operationOutcome);

  expect(invocation).toEqual({
    resourceType: "OperationOutcome",
    issue: [
      {
        code: "structure",
        diagnostics:
          "Element at path '/parameter/0/resource/name' is expected to be an array.",
        expression: ["/parameter/0/resource/name"],
        severity: "error",
      },
    ],
  });
});

test("Test invocation by code System Level", async () => {
  const invocation = await client.invoke_system("usage-statistics", {}, R4, {
    resourceType: "Parameters",
  } as Parameters);

  expect(invocation).toEqual({
    parameter: [],
    resourceType: "Parameters",
  });
});
