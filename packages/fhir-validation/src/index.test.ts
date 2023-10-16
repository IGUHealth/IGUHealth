import path from "path";
import { expect, test } from "@jest/globals";

import {
  Resource,
  ResourceType,
  Account,
  Appointment,
} from "@iguhealth/fhir-types/r4/types";
import { resourceTypes } from "@iguhealth/fhir-types/r4/sets";
import { loadArtifacts } from "@iguhealth/artifacts";
import MemoryDatabase from "@iguhealth/server/lib/resourceProviders/memory/sync.js";

import { createValidator } from "./index";

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

const CTX = {
  resolveSD: (type: string) => {
    const sd = memDatabase.read({}, "StructureDefinition", type);
    if (!sd) throw new Error(`Couldn't find sd for type '${type}'`);
    return sd;
  },
};

test("Testing validating resourceType 'Patient'", async () => {
  const validator = createValidator(CTX, "Patient");

  expect(
    await validator({
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
  const validator = createValidator(CTX, "Patient");

  expect(
    await validator({
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
    await validator({
      resourceType: "Patient",
      deceasedBoolean: true,
    })
  ).toEqual([]);

  expect(
    await validator({
      resourceType: "Patient",
      deceasedDateTime: "1980-01-01",
    })
  ).toEqual([]);
});

test("Primitive Extensions", async () => {
  const sd = memDatabase.read({}, "StructureDefinition", "Patient");

  const validator = createValidator(CTX, "Patient");

  expect(
    await validator({
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
    await validator({
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

test("Primitive extension testing", async () => {
  const validator = createValidator(CTX, "Patient");

  expect(
    await validator({
      resourceType: "Patient",
      name: [
        {
          given: ["Bob"],
          _given: [{ id: "123" }],
        },
      ],
    })
  ).toEqual([]);
  expect(
    await validator({
      resourceType: "Patient",
      name: [
        {
          given: ["Bob"],
          _given: [{ id: 5 }],
        },
      ],
    })
  ).toEqual([
    {
      code: "structure",
      diagnostics:
        "Expected primitive type 'http://hl7.org/fhirpath/System.String' at path '/name/0/_given/0/id'",
      expression: ["/name/0/_given/0/id"],
      severity: "error",
    },
  ]);
});

test("SearchParameter testing", async () => {
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

  const validator = createValidator(CTX, "SearchParameter");

  expect(await validator(parameter)).toEqual([]);
});

test("Test cardinality ", async () => {
  const validator = createValidator(CTX, "Patient");

  expect(
    await validator({
      resourceType: "Patient",
      id: "5",
      name: [
        {
          given: "Bob",
        },
      ],
    })
  ).toEqual([
    {
      code: "structure",
      diagnostics:
        "Element at path '/name/0/given' is expected to be an array.",
      expression: ["/name/0/given"],
      severity: "error",
    },
  ]);
});

test("Test required ", async () => {
  const validator = createValidator(CTX, "Patient");

  expect(
    await validator({
      resourceType: "Patient",
      id: "5",
      link: [{}],
    })
  ).toEqual([
    {
      code: "structure",
      diagnostics:
        "Missing required field 'Patient.link.other' at path '/link/0'",
      expression: ["/link/0"],
      severity: "error",
    },
    {
      code: "structure",
      diagnostics:
        "Missing required field 'Patient.link.type' at path '/link/0'",
      expression: ["/link/0"],
      severity: "error",
    },
  ]);
});

test("Validate element with no primitive", async () => {
  const validator = createValidator(CTX, "Patient");

  expect(
    await validator({
      resourceType: "Patient",
      id: "5",
      name: [{ _given: [{ id: 5 }] }],
    })
  ).toEqual([
    {
      code: "structure",
      diagnostics:
        "Expected primitive type 'http://hl7.org/fhirpath/System.String' at path '/name/0/_given/0/id'",
      expression: ["/name/0/_given/0/id"],
      severity: "error",
    },
  ]);

  expect(
    await validator({
      resourceType: "Patient",
      id: "5",
      name: [{ _given: [{ id: "5" }] }],
    })
  ).toEqual([]);

  expect(
    await validator({
      resourceType: "Patient",
      id: "5",
      name: [{ _given: { id: "5" } }],
    })
  ).toEqual([
    {
      code: "structure",
      diagnostics:
        "Element at path '/name/0/_given' is expected to be an array.",
      expression: ["/name/0/_given"],
      severity: "error",
    },
  ]);

  expect(
    await validator({
      resourceType: "Patient",
      id: "5",
      _deceasedBoolean: [{ _given: { id: "5" } }],
    })
  ).toEqual([
    {
      code: "structure",
      diagnostics:
        "Element at path '/_deceasedBoolean' is expected to be a singular value.",
      expression: ["/_deceasedBoolean"],
      severity: "error",
    },
  ]);
});

test("Observation nested case", async () => {
  const validator = createValidator(CTX, "Observation");

  expect(
    await validator({
      resourceType: "Observation",
      code: {
        coding: [
          {
            system: "http://loinc.org",
            code: "15074-8",
            display: "Glucose [Moles/volume] in Blood",
          },
        ],
      },
      status: "final",
      _status: {
        id: "1",
        extension: [
          {
            url: "whatever",
            valueString: "testing",
            _valueString: {
              extension: [
                {
                  url: 5,
                },
              ],
            },
          },
        ],
      },
    })
  ).toEqual([
    {
      severity: "error",
      code: "structure",
      diagnostics:
        "Expected primitive type 'http://hl7.org/fhirpath/System.String' at path '/_status/extension/0/_valueString/extension/0/url'",
      expression: ["/_status/extension/0/_valueString/extension/0/url"],
    },
  ]);
});

test.each([...resourceTypes.values()].sort((r, r2) => (r > r2 ? 1 : -1)))(
  `Testing validating resourceType '%s'`,
  async (resourceType) => {
    const structureDefinition = memDatabase.search_type(
      {},
      "StructureDefinition",
      [
        {
          name: "type",
          value: [resourceType],
        },
      ]
    ).resources;
    const sd = structureDefinition[0];

    const resources = memDatabase
      .search_type({}, resourceType as ResourceType, [])
      .resources.filter((r) => r.id)
      .sort((r, r2) => JSON.stringify(r).localeCompare(JSON.stringify(r2)))
      .slice(0, 1);
    const validator = createValidator(CTX, resourceType);

    for (const resource of resources) {
      const issues = await validator(resource);

      expect([resource, issues]).toMatchSnapshot();
    }
  }
);

test("Patient with primitive on name", async () => {
  const validator = createValidator(CTX, "Patient");

  expect(
    await validator({
      resourceType: "Patient",
      name: [1],
    })
  ).toEqual([
    {
      code: "structure",
      diagnostics: "Invalid type 'number' at path '/name/0",
      expression: ["/name/0"],
      severity: "error",
    },
  ]);
});

test("validate regexes", async () => {
  const validator = createValidator(CTX, "Account");
  const account: Account = {
    resourceType: "Account",
    status: "active",
    coverage: [
      {
        coverage: { reference: "Coverage/123" },
        priority: -1,
      },
    ],
  };
  expect(await validator(account)).toEqual([
    {
      code: "value",
      diagnostics:
        "Invalid value '-1' at path '/coverage/0/priority'. Value must conform to regex '/^(\\+?[1-9][0-9]*)$/'",
      expression: ["/coverage/0/priority"],
      severity: "error",
    },
  ]);
  expect(
    await validator({
      ...account,
      coverage: [{ coverage: { reference: "Coverage/122" }, priority: 1 }],
    })
  ).toEqual([]);

  const validator2 = createValidator(CTX, "Appointment");

  expect(
    await validator2({
      resourceType: "Appointment",
      status: "active",
      participant: [{ status: "active", actor: { reference: "Patient/1" } }],
      priority: -1,
    })
  ).toEqual([
    {
      code: "value",
      diagnostics:
        "Invalid value '-1' at path '/priority'. Value must conform to regex '/^([0]|([1-9][0-9]*))$/'",
      expression: ["/priority"],
      severity: "error",
    },
  ]);

  expect(
    await validator2({
      resourceType: "Appointment",
      status: "active",
      participant: [{ status: "active", actor: { reference: "Patient/1" } }],
      priority: 0,
    })
  ).toEqual([]);
});
