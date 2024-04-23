import { expect, test } from "@jest/globals";

import { R4 } from "@iguhealth/fhir-types/lib/versions";
import { OperationDefinition, code, id } from "@iguhealth/fhir-types/r4/types";

import HTTPClient from "./index.js";

const client = HTTPClient({
  url: "http://localhost:3000/w/system",
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
  const response = await client.create({}, R4, operationDefinition);
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

  await client.delete({}, R4, "OperationDefinition", response.id as id);
});
