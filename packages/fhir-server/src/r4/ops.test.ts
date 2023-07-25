import { expect, test } from "@jest/globals";
import { invoke } from "@iguhealth/operation-execution";
import { ValueSetExpand } from "./ops";

test("Test ValueSet Expands", async () => {
  invoke(
    ValueSetExpand.Op,
    {
      resolveType: (type: string) => {
        throw new Error(`Could not resolve type ${type}`);
      },
    },
    { test: "asdf" },
    async (op, ctx, input) => {
      return { testOut: input.test };
    }
  );
});
