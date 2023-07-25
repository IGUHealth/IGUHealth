import { expect, test } from "@jest/globals";
import { invoke } from "@iguhealth/operation-execution";
import { ValueSetExpand } from "./ops";
import { ValueSet } from "@iguhealth/fhir-types";

test("Test ValueSet Expands", async () => {
  invoke(
    ValueSetExpand.Op,
    {
      resolveType: (type: string) => {
        throw new Error(`Could not resolve type ${type}`);
      },
    },
    { url: "asdf" },
    async (op, ctx, input) => {
      const valueSet: ValueSet = {
        resourceType: "ValueSet",
        status: "final",
      };
      return {
        return: valueSet,
      };
    }
  );
});
