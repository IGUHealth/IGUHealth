import { expect, test } from "@jest/globals";

import { R4 } from "@iguhealth/fhir-types/lib/versions";
import { IguhealthUsageStatistics } from "@iguhealth/generated-ops/lib/r4/ops";

test("VALIDATION OUTPUT", async () => {
  const issues = await IguhealthUsageStatistics.Op.validate(
    {
      fhirVersion: R4,
      level: "system",
      resolveCanonical(fhirVersion, type, url) {
        return undefined;
      },
      resolveTypeToCanonical(fhirVersion, type) {
        return undefined;
      },
    },
    "out",
    { statistics: [] },
  );
  expect(issues).toEqual([]);
});

test("VALIDATION OUTPUT", async () => {
  const issues = await IguhealthUsageStatistics.Op.validate(
    {
      fhirVersion: R4,
      level: "system",
      resolveCanonical(fhirVersion, type, url) {
        console.log(type);
        return undefined;
      },
      resolveTypeToCanonical(fhirVersion, type) {
        console.log(type);
        return undefined;
      },
    },
    "out",
    {
      statistics: [
        {
          name: "usage_statistics",
          usage: 1,
          version: "r4",
          limit: 10,
          description: "",
        },
      ],
    },
  );
  expect(issues).toEqual([]);

  const issues2 = await IguhealthUsageStatistics.Op.validate(
    {
      fhirVersion: R4,
      level: "system",
      resolveCanonical(fhirVersion, type, url) {
        return undefined;
      },
      resolveTypeToCanonical(fhirVersion, type) {
        return undefined;
      },
    },
    "out",
    {
      statistics: [
        {
          name: "usage_statistics",
          usage: 1,
          description: "",
        },
      ],
    },
  );
  expect(issues2).toEqual([
    {
      code: "required",
      diagnostics: "Missing required parameter 'version'",
      expression: undefined,
      severity: "error",
    },
    {
      code: "required",
      diagnostics: "Missing required parameter 'limit'",
      expression: undefined,
      severity: "error",
    },
    {
      code: "structure",
      diagnostics: "Expected primitive type 'string' at path '/0'",
      expression: ["/0"],
      severity: "error",
    },
    {
      code: "structure",
      diagnostics: "Expected primitive type 'integer' at path '/0'",
      expression: ["/0"],
      severity: "error",
    },
  ]);
});
