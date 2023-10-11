import path from "node:path";
import { expect, test } from "@jest/globals";

import { loadArtifacts } from "@iguhealth/artifacts";
import {
  OperationDefinition,
  Parameters,
  Resource,
} from "@iguhealth/fhir-types/r4/types";

import {
  parseParameters,
  Operation,
  IOperation,
  Invocation,
  OpCTX,
  toParametersResource,
} from "./index";

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
    { name: "name", type: "HumanName", use: "in", min: 0, max: "1" },
    { name: "patient", type: "Patient", use: "in", min: 0, max: "1" },
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
  const operation: IOperation<{ test: string }, { testOut: string }> =
    new Operation<{ test: string }, { testOut: string }>(operationTest);

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
  const operation: IOperation<{ test: string }, { testOut: string }> =
    new Operation<{ test: string }, { testOut: string }>(operationTest);

  const ctx: OpCTX = {
    resolveType: (type: string) => {
      const sd = structureDefinitions.find((sd) => sd.type === type);
      if (!sd) throw new Error(`Could not resolve type ${type}`);
      return sd;
    },
    level: "instance",
  };

  const invoke: Invocation = async (op, ctx, input) => {
    op.validate(ctx, "in", input);
    const output = { testOut: input.test };
    op.validate(ctx, "out", output);
    return output;
  };

  expect(invoke(operation, ctx, { test: "asdf" })).resolves.toEqual({
    testOut: "asdf",
  });

  expect(
    invoke(
      operation,
      ctx,
      // @ts-ignore
      { test: "asdf", bad: "value" }
    )
  ).rejects.toThrow();

  const invokeBadOutput: Invocation = async (op, ctx, input) => {
    op.validate(ctx, "in", input);
    const output = { testOut: input.test, z: 5 };
    op.validate(ctx, "out", output);
    return output;
  };

  expect(invokeBadOutput(operation, ctx, { test: "asdf" })).rejects.toThrow();
});

test("paramValidation", async () => {
  const operation: IOperation<
    { test: string; [keyword: string]: unknown },
    { testOut: string }
  > = new Operation<
    { test: string; [keyword: string]: unknown },
    { testOut: string }
  >(operationTest);

  const ctx: OpCTX = {
    resolveType: (type: string) => {
      const sd = structureDefinitions.find((sd) => sd.type === type);
      if (!sd) throw new Error(`Could not resolve type ${type}`);
      return sd;
    },
    level: "instance",
  };

  const invoke: Invocation = async (op, ctx, input) => {
    op.validate(ctx, "in", input);
    const output = { testOut: input.test };
    op.validate(ctx, "out", output);
    return output;
  };

  expect(
    invoke(operation, ctx, { test: "asdf", name: { given: "Bob" } })
  ).rejects.toThrow();

  expect(
    invoke(operation, ctx, { test: "test", name: { given: ["Bob"] } })
  ).resolves.toEqual({ testOut: "test" });

  expect(
    invoke(operation, ctx, {
      test: "test",
      name: { given: ["Bob"] },
      patient: { resourceType: "Patien", name: [{ given: ["Hello"] }] },
    })
  ).rejects.toThrow();

  expect(
    invoke(operation, ctx, {
      test: "test",
      name: { given: ["Bob"] },
      patient: { resourceType: "Patient", name: [{ given: ["Hello"] }] },
    })
  ).resolves.toEqual({ testOut: "test" });

  expect(
    invoke(operation, ctx, {
      test: "test",
      name: { given: ["Bob"] },
      patient: { resourceType: "Patient", name: [{ given: [4] }] },
    })
  ).rejects.toThrow();

  expect(
    invoke(operation, ctx, {
      test: "test",
      name: { given: ["Bob"] },
      patient: {
        resourceType: "Patient",
        name: [
          {
            _given: [
              {
                id: "123",
                extension: [{ url: "testing", valueString: "Hello" }],
              },
            ],
          },
        ],
      },
    })
  ).resolves.toEqual({ testOut: "test" });

  expect(
    invoke(operation, ctx, {
      test: "test",
      name: { given: ["Bob"] },
      patient: {
        resourceType: "Patient",
        name: [
          {
            _given: [
              {
                id: "123",
                extension: [{ url: "testing", valueString: 4 }],
              },
            ],
          },
        ],
      },
    })
  ).rejects.toThrow();
});

test("Test mapToParameters", () => {
  const op: OperationDefinition = {
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
        max: "1",
        min: 1,
        use: "out",
        name: "test",
        type: "string",
      },
      {
        max: "*",
        min: 1,
        use: "in",
        name: "payload",
        type: "Resource",
      },
    ],
  };
  expect(toParametersResource(op, "in", { payload: "test" })).toEqual({
    resourceType: "Parameters",
    parameter: [
      {
        name: "payload",
        resource: "test",
      },
    ],
  });
});

test("Test invalid resource validation", async () => {
  const op: OperationDefinition = {
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
        max: "1",
        min: 1,
        use: "out",
        name: "test",
        type: "string",
      },
      {
        max: "*",
        min: 1,
        use: "in",
        name: "payload",
        type: "Resource",
      },
    ],
  };
  const operation: IOperation<{ payload: Resource[] }, { test: string }> =
    new Operation<{ payload: Resource[] }, { test: string }>(op);

  const ctx: OpCTX = {
    resolveType: (type: string) => {
      const sd = structureDefinitions.find((sd) => sd.type === type);
      if (!sd) throw new Error(`Could not resolve type ${type} for validation`);
      return sd;
    },
    level: "instance",
  };

  const invoke = (
    op: IOperation<{ payload: Resource[] }, { test: string }>,
    ctx: OpCTX,
    input: unknown
  ) => {
    op.validate(ctx, "in", input);
    const output = { test: "whatever" };
    op.validate(ctx, "out", output);
    return output;
  };

  expect(() => {
    invoke(operation, ctx, { payload: "asdf" } as unknown);
  }).toThrow(new Error(`Could not resolve type undefined for validation`));
});
