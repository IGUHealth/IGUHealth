import path from "node:path";
import { expect, test } from "@jest/globals";
import { invoke } from "@iguhealth/operation-execution";
import { ValueSetExpand } from "./ops";
import { ValueSet } from "@iguhealth/fhir-types";
import { loadArtifacts } from "@iguhealth/artifacts";

const sds = loadArtifacts("StructureDefinition", path.join(__dirname, "../"));

test("Test ValueSet Expands", async () => {
  invoke(
    ValueSetExpand.Op,
    {
      resolveType: (type: string) => {
        const sd = sds.find((sd) => sd.type === type);
        if (!sd) throw new Error(`Could not resolve type ${type}`);
        return sd;
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
