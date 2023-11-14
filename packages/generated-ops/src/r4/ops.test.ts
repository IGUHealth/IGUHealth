import path from "node:path";
import { expect, test } from "@jest/globals";
import { Invocation } from "@iguhealth/operation-execution";
import { ValueSetExpand } from "./ops.js";
import { ValueSet } from "@iguhealth/fhir-types/r4/types";
import { loadArtifacts } from "@iguhealth/artifacts";
import { OpCTX } from "@iguhealth/operation-execution/src/index.js";

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
    if(!await op.validate(ctx, "in", input)){
       throw new Error("Input is invalid")
    }
    if(!await op.validate(ctx, "out", output)){
      throw new Error("Output is invalid")
    } 

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
    if(!await op.validate(ctx, "in", input)){
      throw new Error("Input is invalid")
   }
    const output = { return: 5 };
    if(!await op.validate(ctx, "out", output)){
      throw new Error("Output is invalid")
    } 

    return { return: 5 };
  };

  expect(badOutput(ValueSetExpand.Op, ctx, { url: "asdf" })).rejects.toThrow();
});
