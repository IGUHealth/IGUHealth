import { expect, test } from "@jest/globals";
import { OperationDefinition } from "@iguhealth/fhir-types";

import HTTPClient from "./index.js";

const client = HTTPClient({
  url: "http://localhost:3000/w/1704fc63-dd53-4d6c-8435-1a4b83ba27f7/api/v1/fhir/r4",
  token: "blah",
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
