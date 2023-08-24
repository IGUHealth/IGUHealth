import { expect, test } from "@jest/globals";
import { OperationDefinition } from "@iguhealth/fhir-types";

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
    status: "draft",
    kind: "operation",
    code: "my-operation",
    system: false,
    instance: false,
    type: false,
    parameter: [],
  };
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

  await client.delete({}, "OperationDefinition", response.id as string);
});
