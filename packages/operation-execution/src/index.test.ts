import path from "node:path";
import { expect, test } from "@jest/globals";

import { parseParameters } from ".";
import { loadArtifacts } from "@iguhealth/artifacts";

const operationDefinitions = loadArtifacts(
  "OperationDefinition",
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
