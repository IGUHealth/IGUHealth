import path from "path";

import {
  StructureDefinition,
  Resource,
  ResourceType,
  code,
} from "@iguhealth/fhir-types/r4/types";
import { resourceTypes } from "@iguhealth/fhir-types/r4/sets";
import { expect, test } from "@jest/globals";
import { loadArtifacts } from "@iguhealth/artifacts";
import MemoryDatabase from "@iguhealth/fhir-server/lib/resourceProviders/memory";
import jsonpointer from "jsonpointer";

import createValidator from "./index";

function createMemoryDatabase(resourceTypes: ResourceType[]) {
  const database = MemoryDatabase<any>({});
  const artifactResources: Resource[] = resourceTypes
    .map((resourceType) =>
      loadArtifacts(resourceType, path.join(__dirname, "./"), true)
    )
    .flat();
  for (const resource of artifactResources) {
    database.create({}, resource);
  }
  return database;
}

const memDatabase = createMemoryDatabase([
  ...resourceTypes.values(),
] as ResourceType[]);

test("Testing validating resourceType 'Patient'", async () => {
  const sd = memDatabase.read({}, "StructureDefinition", "Patient");

  const validator = createValidator((type: string) => {
    const sd = memDatabase.read({}, "StructureDefinition", type);
    if (!sd) throw new Error(`Couldn't find sd for type '${type}'`);
    return sd;
  }, "Patient");

  expect(
    validator({
      resourceType: "Patient",
      id: "5",
      identifier: [
        {
          system: 5,
        },
      ],
    })
  ).toEqual([
    {
      severity: "error",
      code: "structure",
      diagnostics:
        "Expected primitive type 'uri' at path '/identifier/0/system'",
      expression: ["/identifier/0/system"],
    },
  ]);
});

test("test typechoice checking", async () => {
  const sd = memDatabase.read({}, "StructureDefinition", "Patient");

  const validator = createValidator((type: string) => {
    const sd = memDatabase.read({}, "StructureDefinition", type);
    if (!sd) throw new Error(`Couldn't find sd for type '${type}'`);
    return sd;
  }, "Patient");

  expect(
    validator({
      resourceType: "Patient",
      deceasedBoolean: "hello",
      deceasedDateTime: "1980-01-01",
    })
  ).toEqual([
    {
      code: "structure",
      diagnostics:
        "Expected primitive type 'boolean' at path '/deceasedBoolean'",
      expression: ["/deceasedBoolean"],
      severity: "error",
    },
    {
      code: "structure",
      diagnostics: "Additional fields found at path '': 'deceasedDateTime'",
      expression: [""],
      severity: "error",
    },
  ]);

  expect(
    validator({
      resourceType: "Patient",
      deceasedBoolean: true,
    })
  ).toEqual([]);

  expect(
    validator({
      resourceType: "Patient",
      deceasedDateTime: "1980-01-01",
    })
  ).toEqual([]);
});

test("Primitive Extensions", () => {
  const sd = memDatabase.read({}, "StructureDefinition", "Patient");

  const validator = createValidator((type: string) => {
    const sd = memDatabase.read({}, "StructureDefinition", type);
    if (!sd) throw new Error(`Couldn't find sd for type '${type}'`);
    return sd;
  }, "Patient");

  expect(
    validator({
      resourceType: "Patient",
      id: "5",
      identifier: [
        {
          system: "http://example.com",
          _system: {
            extension: [
              {
                url: "http://example.com",
                valueCode: "test",
              },
            ],
          },
        },
      ],
    })
  ).toEqual([]);

  expect(
    validator({
      resourceType: "Patient",
      id: "5",
      identifier: [
        {
          system: "http://example.com",
          _system: {
            extension: [
              {
                url: 5,
                valueCode: "test",
              },
            ],
          },
        },
      ],
    })
  ).toEqual([
    {
      code: "structure",
      diagnostics:
        "Expected primitive type 'http://hl7.org/fhirpath/System.String' at path '/identifier/0/_system/extension/0/url'",
      expression: ["/identifier/0/_system/extension/0/url"],
      severity: "error",
    },
  ]);
});

test("SearchParameter testing", () => {
  const parameter = {
    base: ["Account"],
    code: "identifier",
    contact: [
      {
        telecom: [
          {
            system: "url",
            value: "http://hl7.org/fhir",
          },
        ],
      },
      {
        telecom: [
          {
            system: "url",
            value: "http://www.hl7.org/Special/committees/pafm/index.cfm",
          },
        ],
      },
    ],
    date: "2019-11-01T09:29:23+11:00",
    description: "Account number",
    experimental: false,
    expression: "Account.identifier",
    extension: [
      {
        url: "http://hl7.org/fhir/StructureDefinition/structuredefinition-standards-status",
        valueCode: "trial-use",
      },
    ],
    id: "Account-identifier",
    name: "identifier",
    publisher: "Health Level Seven International (Patient Administration)",
    resourceType: "SearchParameter",
    status: "draft",
    type: "token",
    url: "http://hl7.org/fhir/SearchParameter/Account-identifier",
    version: "4.0.1",
    xpath: "f:Account/f:identifier",
    xpathUsage: "normal",
  };

  const validator = createValidator((type: string) => {
    const sd = memDatabase.read({}, "StructureDefinition", type);
    if (!sd) throw new Error(`Couldn't find sd for type '${type}'`);
    return sd;
  }, "SearchParameter");

  expect(validator(parameter)).toEqual([]);
});

test.each([...resourceTypes.values()].sort((r, r2) => (r > r2 ? 1 : -1)))(
  `Testing validating resourceType '%s'`,
  (resourceType) => {
    const structureDefinition = memDatabase.search_type(
      {},
      "StructureDefinition",
      {
        resourceType: "StructureDefinition",
        parameters: {
          base: {
            name: "type",
            value: [resourceType],
          },
        },
      }
    );
    const sd = structureDefinition[0];

    const resources = memDatabase
      .search_type({}, resourceType as ResourceType, { parameters: {} })
      .filter((r) => r.id)
      .sort((r, r2) => JSON.stringify(r).localeCompare(JSON.stringify(r2)))
      .slice(0, 1);
    const validator = createValidator((type: string) => {
      const sd = memDatabase.read({}, "StructureDefinition", type);
      if (!sd) throw new Error(`Couldn't find sd for type '${type}'`);
      return sd;
    }, resourceType);

    for (const resource of resources) {
      const issues = validator(resource);

      expect([resource, issues]).toMatchSnapshot();
    }
  }
);
