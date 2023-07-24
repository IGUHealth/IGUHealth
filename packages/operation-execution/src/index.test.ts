import path from "node:path";
import { expect, test } from "@jest/globals";

import { parseParameters, toParametersResource, OperationExecution } from ".";
import { loadArtifacts } from "@iguhealth/artifacts";
import { OperationDefinition, Parameters } from "@iguhealth/fhir-types";

const operationDefinitions = loadArtifacts(
  "OperationDefinition",
  path.join(__dirname, "./")
);

const structureDefinitions = loadArtifacts(
  "StructureDefinition",
  path.join(__dirname, "./")
);

const valueSetExpandOp = operationDefinitions.find(
  (op) => op.id === "ValueSet-expand"
);

if (!valueSetExpandOp)
  throw new Error("could not resolve valueset expand operation definition");

test("parseParameters", () => {
  expect(
    parseParameters(valueSetExpandOp, "in", {
      resourceType: "Parameters",
      parameter: [
        { name: "url", valueUri: "https://my-valueset.com" },
        {
          name: "valueSetVersion",
          valueString: "12",
        },
        {
          name: "filter",
          valueString: "test",
        },
      ],
    })
  ).toEqual({
    filter: "test",
    url: "https://my-valueset.com",
    valueSetVersion: "12",
  });
});

test("No Extra Parameters Allowed", () => {
  expect(() => {
    parseParameters(valueSetExpandOp, "in", {
      resourceType: "Parameters",
      parameter: [
        { name: "extra parameter", valueString: "test" },
        { name: "url", valueUri: "https://my-valueset.com" },
        {
          name: "valueSetVersion",
          valueString: "12",
        },
        {
          name: "filter",
          valueString: "test",
        },
      ],
    });
  }).toThrow();
});

const operationTest: OperationDefinition = {
  resourceType: "OperationDefinition",
  id: "test",
  status: "active",
  kind: "operation",
  name: "test",
  code: "test",
  system: true,
  type: false,
  instance: false,

  parameter: [
    {
      name: "testOut",
      type: "string",
      use: "out",
      min: 1,
      max: "1",
    },
    {
      name: "test",
      type: "string",
      use: "in",
      min: 1,
      max: "1",
    },
    {
      name: "test2",
      type: "integer",
      use: "in",
      min: 0,
      max: "*",
    },
    {
      name: "nested",
      use: "in",
      min: 0,
      max: "*",
      part: [
        {
          name: "nested1",
          type: "string",
          use: "in",
          min: 1,
          max: "1",
        },
        {
          name: "nested2",
          use: "in",
          min: 1,
          max: "1",
          part: [
            {
              name: "nested3",
              type: "string",
              use: "in",
              min: 1,
              max: "*",
            },
          ],
        },
      ],
    },
  ],
};

test("Test Operation 1", () => {
  expect(
    parseParameters(operationTest, "in", {
      resourceType: "Parameters",
      parameter: [
        { name: "test", valueString: "value1" },
        { name: "test2", valueInteger: 5 },
        { name: "nested", part: [{ name: "nested1", valueString: "value2" }] },
        {
          name: "nested",
          part: [
            { name: "nested1", valueString: "value3" },
            {
              name: "nested2",
              part: [{ name: "nested3", valueString: "value4" }],
            },
          ],
        },
      ],
    })
  ).toEqual({
    test: "value1",
    test2: [5],
    nested: [
      {
        nested1: "value2",
      },
      {
        nested1: "value3",
        nested2: {
          nested3: ["value4"],
        },
      },
    ],
  });
});

test("roundTrip", () => {
  const operation = new OperationExecution(
    operationTest,
    async (ctx, input: { v: "z" }) => {
      console.log(input);
      return { v: "5" };
    }
  );
  const parameters: Parameters = {
    resourceType: "Parameters",
    parameter: [
      { name: "test", valueString: "value1" },
      { name: "test2", valueInteger: 5 },
      { name: "nested", part: [{ name: "nested1", valueString: "value2" }] },
      {
        name: "nested",
        part: [
          { name: "nested1", valueString: "value3" },
          {
            name: "nested2",
            part: [{ name: "nested3", valueString: "value4" }],
          },
        ],
      },
    ],
  };
  expect(
    operation.parseToParameters("in", operation.parseToObject("in", parameters))
  ).toEqual(parameters);
});

test("execution", async () => {
  const operation = new OperationExecution(
    operationTest,
    async (ctx, input: { test: string }) => {
      console.log(input);
      return { testOut: input.test };
    }
  );

  const ctx = {
    resolveType: (type: string) => {
      const sd = structureDefinitions.find((sd) => sd.type === type);
      if (!sd) throw new Error(`Could not resolve type ${type}`);
      return sd;
    },
  };

  const output = await operation.execute(ctx, { test: "asdf" });
  expect(output).toEqual({ testOut: "asdf" });
});
