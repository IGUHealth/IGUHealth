import path from "path";
import { fileURLToPath } from "url";
import { expect, test } from "@jest/globals";

import {
  AResource,
  StructureDefinition,
  Resource,
  ResourceType,
  Account,
  canonical,
  uri,
} from "@iguhealth/fhir-types/lib/r4/types";
import { resourceTypes } from "@iguhealth/fhir-types/lib/r4/sets";
import { loadArtifacts } from "@iguhealth/artifacts";

import { createValidator } from "./index";

function createMemoryDatabase(
  resourceTypes: ResourceType[]
): Record<ResourceType, Resource[]> {
  const data: Record<ResourceType, Resource[]> = {} as Record<
    ResourceType,
    Resource[]
  >;
  for (const resourceType of resourceTypes) {
    const resources = loadArtifacts(
      resourceType,
      path.join(fileURLToPath(import.meta.url), ".."),
      true
    );
    data[resourceType] = resources;
  }

  return data;
}

const memDatabase = createMemoryDatabase([
  ...resourceTypes.values(),
] as ResourceType[]);

const CTX = {
  resolveTypeToCanonical: (type: uri): canonical => {
    return `http://hl7.org/fhir/StructureDefinition/${type}` as canonical;
  },
  resolveCanonical: <T extends ResourceType>(t: T, url: string) => {
    const sd = memDatabase[t].find(
      (sd) => (sd as StructureDefinition).url === url
    );
    if (!sd) throw new Error(`Couldn't find sd with url '${url}'`);
    return sd as AResource<T>;
  },
};

test("Testing validating resourceType 'Patient'", async () => {
  const validator = createValidator(CTX, "Patient" as uri);

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
  const validator = createValidator(CTX, "Patient" as uri);

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
  const validator = createValidator(CTX, "Patient" as uri);

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
  const validator = createValidator(CTX, "Patient" as uri);

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

  const validator = createValidator(CTX, "SearchParameter" as uri);

  expect(await validator(parameter)).toEqual([]);
});

test("Test cardinality ", async () => {
  const validator = createValidator(CTX, "Patient" as uri);

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
  const validator = createValidator(CTX, "Patient" as uri);

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
  const validator = createValidator(CTX, "Patient" as uri);

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
  const validator = createValidator(CTX, "Observation" as uri);

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
    const structureDefinition = memDatabase["StructureDefinition"].filter(
      (sd) => sd.id === resourceType
    );
    const sd = structureDefinition[0];

    const resources = memDatabase[resourceType as ResourceType]
      .filter((r) => r.id)
      .sort((r, r2) => JSON.stringify(r).localeCompare(JSON.stringify(r2)))
      .slice(0, 1);

    const validator = createValidator(CTX, resourceType as uri);

    for (const resource of resources) {
      const issues = await validator(resource);

      expect([resource, issues]).toMatchSnapshot();
    }
  }
);

test("Patient with primitive on name", async () => {
  const validator = createValidator(CTX, "Patient" as uri);

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

test("Test reference constraints", async () => {
  const validator = createValidator(CTX, "Patient" as uri);
  expect(
    await validator({
      resourceType: "Patient",
      managingOrganization: { reference: "Condition/123" },
    })
  ).toEqual([
    {
      code: "structure",
      diagnostics:
        "Expected reference to be constrained by one of the following profiles 'http://hl7.org/fhir/StructureDefinition/Organization' at path '/managingOrganization' found reference of type 'Condition' instead.",
      expression: ["/managingOrganization"],
      severity: "error",
    },
  ]);

  expect(
    await validator({
      resourceType: "Patient",
      managingOrganization: { reference: "Organization/123" },
    })
  ).toEqual([]);

  expect(
    await validator({
      resourceType: "Patient",
      managingOrganization: {
        reference: "Organization/123",
        type: "Organization",
      },
    })
  ).toEqual([]);

  expect(
    await validator({
      resourceType: "Patient",
      managingOrganization: {
        reference: "Organization/123",
        type: "Condition",
      },
    })
  ).toEqual([
    {
      code: "structure",
      diagnostics:
        "Expected reference to be constrained by one of the following profiles 'http://hl7.org/fhir/StructureDefinition/Organization' at path '/managingOrganization' found reference of type 'Condition' instead.",
      expression: ["/managingOrganization"],
      severity: "error",
    },
  ]);
});

test("validate regexes", async () => {
  const validator = createValidator(CTX, "Account" as uri);
  const account: Account = {
    resourceType: "Account",
    status: "active",
    coverage: [
      {
        coverage: { reference: "Coverage/123" },
        priority: -1,
      },
    ],
  } as Account;
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

  const validator2 = createValidator(CTX, "Appointment" as uri);

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

test("Misaligned types", async () => {
  const validator2 = createValidator(CTX, "Appointment" as uri);
  expect(
    await validator2({
      resourceType: "Patient",
      name: [{ given: ["bob"] }],
    })
  ).toEqual([
    {
      code: "invalid",
      diagnostics:
        "ResourceType 'Patient' does not match expected type 'Appointment'",
      expression: [""],
      severity: "error",
    },
  ]);
});

test("string checking", async () => {
  const stringValidator = createValidator(CTX, "string" as uri);
  expect(await stringValidator("bob")).toEqual([]);
  expect(await stringValidator({})).toEqual([
    {
      code: "structure",
      diagnostics: "Expected primitive type 'string' at path ''",
      expression: [""],
      severity: "error",
    },
  ]);
});

test("Type checking", async () => {
  const patientValidator = createValidator(CTX, "Patient" as uri);
  expect(await patientValidator("test")).toEqual([
    {
      code: "structure",
      diagnostics:
        "Value must be an object when validating 'Patient'. Instead found type of 'string'",
      expression: [""],
      severity: "error",
    },
  ]);
});
