import { expect, test } from "@jest/globals";

import HTTPClient from "@iguhealth/client/lib/http";
import {
  ResourceValidate,
  ValueSetExpand,
} from "@iguhealth/generated-ops/lib/r4/ops";

const client = HTTPClient({
  url: "http://localhost:3000/w/system/api/v1/fhir/r4",
  getAccessToken: async function () {
    return "pub_token";
  },
});

test("create bad patient", async () => {
  expect(
    // @ts-ignore
    client.create({}, { resourceType: "Patient", badValue: 5 }),
  ).rejects.toThrowError();
});

test("Bad Creation", async () => {
  const badPatient = { resourceType: "Patient", name: "bob" };
  //@ts-ignore
  expect(client.create({}, badPatient)).rejects.toThrow();
});

test("Bad expansion", async () => {
  const badExpansion = { urz: "123" };

  expect(
    // @ts-ignore
    client.invoke_type(ValueSetExpand.Op, {}, "ValueSet", badExpansion),
  ).rejects.toThrow();
});

test("ValidationOperation", async () => {
  const badPatient = { resourceType: "Patient", name: "bob" };
  const invocation = client
    .invoke_type(
      ResourceValidate.Op,
      {},
      "Patient",
      // @ts-ignore
      { resource: badPatient },
    )
    .catch((e) => {
      throw e.operationOutcome;
    });
  expect(invocation).rejects.toEqual({
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

  const successfulInvocation = client.invoke_type(
    ResourceValidate.Op,
    {},
    "Patient",
    { resource: { resourceType: "Patient", name: [{ given: ["bob"] }] } },
  );

  expect(successfulInvocation).resolves.toEqual({
    issue: [
      {
        code: "informational",
        diagnostics: "Validation successful",
        severity: "information",
      },
    ],
    resourceType: "OperationOutcome",
  });

  const invalidType = client.invoke_type(
    ResourceValidate.Op,
    {},
    "Practitioner",
    { resource: { resourceType: "Patient", name: [{ given: ["bob"] }] } },
  );

  expect(invalidType).resolves.toEqual({
    issue: [
      {
        code: "invalid",
        diagnostics:
          "ResourceType 'Patient' does not match expected type 'Practitioner'",
        expression: [""],
        severity: "error",
      },
    ],
    resourceType: "OperationOutcome",
  });
});

test("Invalid Operation Payload", async () => {
  expect(
    // @ts-ignore
    client.invoke_system(ValueSetExpand.Op, {}, { url: 5 }).catch((e) => {
      throw e.operationOutcome;
    }),
  ).rejects.toEqual({
    issue: [
      {
        code: "structure",
        diagnostics:
          "Expected primitive type 'uri' at path '/parameter/0/valueUri'",
        expression: ["/parameter/0/valueUri"],
        severity: "error",
      },
    ],
    resourceType: "OperationOutcome",
  });
});
