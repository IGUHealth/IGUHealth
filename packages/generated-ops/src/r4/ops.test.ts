import path from "node:path";
import { expect, test } from "@jest/globals";

import { Invocation } from "@iguhealth/operation-execution";
import { ValueSet } from "@iguhealth/fhir-types/r4/types";
import { loadArtifacts } from "@iguhealth/artifacts";
import { OpCTX } from "@iguhealth/operation-execution/src/index.js";

import { ValueSetExpand } from "./ops.js";

const sds = loadArtifacts("StructureDefinition", path.join(__dirname, "../"));

test("Test ValueSet Expands", async () => {
  const ctx: OpCTX = {
    resolveSD: (type: string) => {
      const sd = sds.find((sd) => sd.type === type);
      if (!sd) throw new Error(`Could not resolve type ${type}`);
      return sd;
    },
    level: "instance",
  };

  const valueSet: ValueSet = {
    resourceType: "ValueSet",
    status: "final",
  };
  const output = valueSet;

  const invoke: Invocation = async (op, ctx, input) => {
    const inputIssues = await op.validate(ctx, "in", input);
    if (inputIssues.length > 0) throw new Error("Input is invalid");

    const outputIssues = await op.validate(ctx, "out", output);
    if (outputIssues.length > 0) throw new Error("Output is invalid");

    return output;
  };
  expect(invoke(ValueSetExpand.Op, ctx, { url: "asdf" })).resolves.toEqual(
    output,
  );

  expect(
    invoke(
      ValueSetExpand.Op,
      ctx,
      // @ts-ignore
      { url: 5 },
    ),
  ).rejects.toThrow();

  const badOutput: Invocation = async (op, ctx, input) => {
    const inputIssues = await op.validate(ctx, "in", input);
    if (inputIssues.length > 0) throw new Error("Input is invalid");

    const output = { return: 5 };

    const outputIssues = await op.validate(ctx, "out", output);
    if (outputIssues.length > 0) throw new Error("Output is invalid");

    return output;
  };

  expect(badOutput(ValueSetExpand.Op, ctx, { url: "asdf" })).rejects.toThrow();
});
