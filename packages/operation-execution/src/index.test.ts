import path from "node:path";
import { expect, test } from "@jest/globals";

import { parseParameters } from ".";
import { loadArtifacts } from "@iguhealth/artifacts";

const operationDefinitions = loadArtifacts(
  "OperationDefinition",
  path.join(__dirname, "./")
);

// const sds = loadArtifacts(
//   "StructureDefinition",
//   path.join(__dirname, "./"),
//   true
// );

console.log(operationDefinitions.length);

const valueSetExpandOp = operationDefinitions.find(
  (op) => op.id === "ValueSet-expand"
);

if (!valueSetExpandOp)
  throw new Error("cound not resolve valueset expand operation definition");

test("parseParameters", () => {
  expect(
    parseParameters(valueSetExpandOp, "in", {
      resourceType: "Parameters",
      parameter: [
        {
          name: "identifier",
          valueIdentifier: {
            system: "http://hl7.org/fhir/valueset-identifier-type",
            value: "http://acme.org/fhir/ValueSet/identifier-type",
          },
        },
        {
          name: "filter",
          part: [
            {
              name: "property",
              valueCode: "code",
            },
            {
              name: "op",
              valueCode: "is-a",
            },
            {
              name: "value",
              valueCode: "MR",
            },
          ],
        },
      ],
    })
  ).toEqual({
    // activeOnly: undefined,
    // "check-system-version": [],
    // context: undefined,
    // contextDirection: undefined,
    // count: undefined,
    // date: undefined,
    // designation: [],
    // displayLanguage: undefined,
    // "exclude-system": [],
    // excludeNested: undefined,
    // excludeNotForUI: undefined,
    // excludePostCoordinated: undefined,
    // filter: undefined,
    // "force-system-version": [],
    // includeDefinition: undefined,
    // includeDesignations: undefined,
    // offset: undefined,
    // "system-version": [],
    // url: undefined,
    // valueSet: undefined,
    // valueSetVersion: undefined,
  });
});
