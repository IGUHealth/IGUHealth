import { expect, test } from "@jest/globals";

import { OperationDefinition, code, id } from "@iguhealth/fhir-types/r4/types";

import HTTPClient from "./index.js";

const client = HTTPClient({
  url: "http://localhost:3000/w/system/api/v1/fhir/r4",
  getAccessToken: async function () {
    return "fake_token";
  },
});

test("Test creating and destroying with HTTP Client", async () => {
  const operationDefinition: OperationDefinition = {
    resourceType: "OperationDefinition",
    name: "test",
    status: "draft" as code,
    kind: "operation" as code,
    code: "my-operation" as code,
    system: false,
    instance: false,
    type: false,
    parameter: [],
  } as OperationDefinition;
  const response = await client.create({}, operationDefinition);
  expect(response).toMatchObject({
    resourceType: "OperationDefinition",
    name: "test",
    status: "draft",
    kind: "operation",
    code: "my-operation",
    system: false,
    instance: false,
    type: false,
    parameter: [],
  });

  await client.delete({}, "OperationDefinition", response.id as id);
});
