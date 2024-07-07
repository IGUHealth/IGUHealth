import { expect, test } from "@jest/globals";
import path from "path";
import { fileURLToPath } from "url";

import { loadArtifacts } from "@iguhealth/artifacts";
import {
  OperationDefinition,
  StructureDefinition,
  uri,
} from "@iguhealth/fhir-types/lib/generated/r4/types";
import { FHIR_VERSION, R4, Resource } from "@iguhealth/fhir-types/lib/versions";

import { evaluate, evaluateWithMeta } from "./index";

const sds: StructureDefinition[] = loadArtifacts({
  fhirVersion: R4,
  loadDevelopmentPackages: true,
  resourceType: "StructureDefinition",
  packageLocation: path.join(fileURLToPath(import.meta.url), ".."),
});

const getSD = <Version extends FHIR_VERSION>(_version: Version, type: uri) => {
  const foundSD = sds.find((sd) => sd.type === type);
  return foundSD as Resource<Version, "StructureDefinition"> | undefined;
};

const metaOptions = (startingType: string) => ({
  meta: {
    type: startingType as uri,
    getSD,
  },
});

test("Eval tests", async () => {
  // Operator testing
  expect(await evaluate("4 + 5", {})).toEqual([9]);
  expect(await evaluate("$this.test + 2 * 4", { test: 4 })).toEqual([12]);

  expect(await evaluate("2 * 4", { test: 4 })).toEqual([8]);

  expect(await evaluate("$this.test * 2", { test: 4 })).toEqual([8]);
});

test("Variable tests", async () => {
  expect(await evaluate("%nonexistant", {})).toEqual([]);
  expect(
    await evaluate(
      "%hello.test",
      {},
      { variables: { hello: [{ test: 4 }, { test: 3 }] } },
    ),
  ).toEqual([4, 3]);

  expect(
    await evaluate(
      "%hello.test",
      {},
      {
        variables: (name: string) => {
          return [{ test: 4 }, { test: 3 }];
        },
      },
    ),
  ).toEqual([4, 3]);
});

test("PrimitiveExtensions", async () => {
  expect(await evaluate("%nonexistant", {})).toEqual([]);
  expect(
    await evaluate(
      "%hello.test.extension.valueBoolean",
      {},
      {
        variables: {
          hello: [
            {
              test: 4,
              _test: { id: "test", extension: [{ valueBoolean: true }] },
            },
            { test: 3 },
          ],
        },
      },
    ),
  ).toEqual([true]);
});

test("PrimitiveExtensions array", async () => {
  const options = {
    variables: {
      hello: [
        {
          test: [4, undefined, 5],
          _test: [
            { id: "id1", extension: [{ valueBoolean: true }] },
            { id: "id2" },
            { id: "id3" },
          ],
        },
        { test: 3 },
      ],
    },
  };
  expect(await evaluate("%hello.test.id", {}, options)).toEqual([
    "id1",
    "id2",
    "id3",
  ]);
});

test("typechoices", async () => {
  const options = {
    variables: {
      hello: [
        {
          testInteger: [4, undefined, 5],
          _testInteger: [
            { id: "id1", extension: [{ valueBoolean: true }] },
            { id: "id2" },
            { id: "id3" },
          ],
        },
        { testString: "3" },
      ],
    },
  };
  expect(await evaluate("%hello.test", {}, options)).toEqual([4, 5, "3"]);
  expect(await evaluate("%hello.test.id", {}, options)).toEqual([
    "id1",
    "id2",
    "id3",
  ]);
});

test("Test all operations", async () => {
  expect(await evaluate("(5 + 5) / (4-2)", {})).toEqual([5]);
  expect(await evaluate("4 + 4 / 4 - 2", {})).toEqual([3]);
  expect(await evaluate("(4 + 4) / (4 - 2)", {})).toEqual([4]);
});

test("exists", async () => {
  expect(await evaluate("$this.exists(test)", { test: [1, 2, 3] })).toEqual([
    true,
  ]);

  expect(await evaluate("$this.exists()", { test: [1, 2, 3] })).toEqual([true]);

  expect(await evaluate("$this.exists($this.z)", { test: [1, 2, 3] })).toEqual([
    false,
  ]);

  expect(await evaluate("$this.exists()", undefined)).toEqual([false]);
});

test("empty", async () => {
  expect(await evaluate("5.empty()", { test: [1, 2, 3] })).toEqual([false]);

  expect(await evaluate("$this.test.empty()", { test: [1, 2, 3] })).toEqual([
    false,
  ]);

  expect(await evaluate("test.empty()", { test: [1, 2, 3] })).toEqual([false]);

  expect(await evaluate("empty()", undefined)).toEqual([true]);

  expect(await evaluate("$this.z.empty()", { test: [1, 2, 3] })).toEqual([
    true,
  ]);
});

test("all", async () => {
  expect(
    await evaluate("$this.test.all($this=1)", { test: [1, 2, 3] }),
  ).toEqual([false]);
  expect(await evaluate("$this.test.all($this=1)", { test: [1, 1] })).toEqual([
    true,
  ]);
  expect(await evaluate("$this.test.all($this=1)", { test: [1] })).toEqual([
    true,
  ]);
  expect(await evaluate("1.all($this=1)", { test: [1] })).toEqual([true]);
});

test("allTrue", async () => {
  expect(
    await evaluate("$this.test.allTrue()", { test: [true, true] }),
  ).toEqual([true]);
  expect(
    await evaluate("$this.test.allTrue()", { test: [true, true, false] }),
  ).toEqual([false]);

  expect(
    await evaluate("$this.test.allTrue()", { test: [true, true, 1] }),
  ).toEqual([false]);

  expect(await evaluate("true.allTrue()", { test: [true, true, 1] })).toEqual([
    true,
  ]);
});

test("anyTrue", async () => {
  expect(
    await evaluate("$this.test.anyTrue()", { test: [true, true] }),
  ).toEqual([true]);
  expect(
    await evaluate("$this.test.anyTrue()", { test: [true, true, false] }),
  ).toEqual([true]);
  expect(
    await evaluate("$this.test.anyTrue()", { test: [true, true, 1] }),
  ).toEqual([true]);
  expect(await evaluate("false.anyTrue()", {})).toEqual([false]);
  expect(await evaluate("true.anyTrue()", {})).toEqual([true]);
  expect(
    await evaluate("$this.test.anyTrue()", { test: [false, 5, 1] }),
  ).toEqual([false]);
});

test("allFalse", async () => {
  expect(
    await evaluate("$this.test.allFalse()", { test: [0, 1, false] }),
  ).toEqual([false]);
});

test("anyFalse", async () => {
  expect(
    await evaluate("$this.test.anyFalse()", { test: [0, 1, false] }),
  ).toEqual([true]);
});

test("subsetOf", async () => {
  expect(
    await evaluate("%set2.subsetOf(%set1)", undefined, {
      variables: { set1: [0, 1, false], set2: [0, -1], set3: ["none"] },
    }),
  ).toEqual([false]);
  expect(
    await evaluate("%set2.subsetOf(%set1)", undefined, {
      variables: { set1: [0, 1, false], set2: [0], set3: ["none"] },
    }),
  ).toEqual([true]);
  expect(
    await evaluate("%set2.subsetOf(%set1)", undefined, {
      variables: { set1: [0, 1, false], set2: [0, 1], set3: ["none"] },
    }),
  ).toEqual([true]);
  expect(
    await evaluate("%set2.subsetOf(%set1)", undefined, {
      variables: { set1: [0, 1, false], set2: [0, 1, false], set3: ["none"] },
    }),
  ).toEqual([true]);
  expect(
    await evaluate("%set1.subsetOf(%set2)", undefined, {
      variables: { set1: [0, 1, false], set2: [0, 1], set3: ["none"] },
    }),
  ).toEqual([false]);
  expect(
    await evaluate("%set3.subsetOf(%set2)", undefined, {
      variables: { set1: [0, 1, false], set2: [0, 1], set3: ["none"] },
    }),
  ).toEqual([false]);
});

test("supersetOf", async () => {
  expect(
    await evaluate("%set1.supersetOf(%set2)", undefined, {
      variables: { set1: [0, 1, false], set2: [0, 1], set3: ["none"] },
    }),
  ).toEqual([true]);

  expect(
    await evaluate("%set2.supersetOf(%set1)", undefined, {
      variables: { set1: [0, 1, false], set2: [0, 1], set3: ["none"] },
    }),
  ).toEqual([false]);
});

test("distinct", async () => {
  expect(await evaluate("$this.distinct()", [{ v: 1 }, { v: 1 }, 2])).toEqual([
    2,
    { v: 1 },
  ]);

  expect(
    await evaluate(
      "$this.distinct().count()= %set1.count()",
      [{ v: 1 }, { v: 1 }, 2],
      {
        variables: { set1: [1, 1, 2] },
      },
    ),
  ).toEqual([false]);

  expect(await evaluate("$this.isDistinct()", [{ v: 1 }, { v: 1 }, 2])).toEqual(
    [false],
  );

  expect(await evaluate("$this.isDistinct()", [{ v: 1 }, { v: 2 }])).toEqual([
    true,
  ]);
});

test("where", async () => {
  expect(await evaluate("$this.where($this=1)", [1, 2, 3])).toEqual([1]);

  expect(async () => {
    await evaluate("$this.where('Bob')", [{ name: "John" }, { name: "Bob" }]);
  }).rejects.toThrow();
});

test("select", async () => {
  expect(
    await evaluate("$this.select($this.name.given + ' ' + $this.name.family)", [
      { name: { given: ["Bob"], family: "Jameson" } },
      { name: { given: ["Jason"], family: "Kyle" } },
    ]),
  ).toEqual(["Bob Jameson", "Jason Kyle"]);
});

test("repeat", async () => {
  expect(
    await evaluate("$this.repeat(item)", [
      {
        resourceType: "Questionnaire",
        item: [{ id: "1", item: [{ id: "2", item: { id: "4" } }] }],
      },
    ]),
  ).toEqual([
    { id: "1", item: [{ id: "2", item: { id: "4" } }] },
    { id: "2", item: { id: "4" } },
    { id: "4" },
  ]);
});

test("indexed", async () => {
  expect(async () => {
    await evaluate("$this.test['test']", { test: [1, 2, 3] });
  }).rejects.toThrow();
  expect(await evaluate("$this.test[0]", { test: [1, 2, 3] })).toEqual([1]);
  expect(
    (await evaluateWithMeta("$this.test[0]", { test: [1, 2, 3] })).map((v) =>
      v.location(),
    ),
  ).toEqual([["test", 0]]);
});

test("backtick", async () => {
  expect(await evaluate("$this.`PID-1`", { "PID-1": "PID-1 value" })).toEqual([
    "PID-1 value",
  ]);
});

test("ofType", async () => {
  expect(
    await evaluate("ofType(Patient)", [
      { resourceType: "Patient" },
      { resourceType: "MedicationRequest" },
    ]),
  ).toEqual([{ resourceType: "Patient" }]);
  expect(
    await evaluate("ofType(HumanName)", [
      { resourceType: "Patient" },
      { resourceType: "MedicationRequest" },
    ]),
  ).toEqual([]);
});

test("Return Type meta", async () => {
  expect(
    (
      await evaluateWithMeta(
        "$this.name",
        {
          resourceType: "Patient",
          name: [{ given: ["bob"], family: "jameson" }],
        },
        metaOptions("Patient"),
      )
    ).map((v) => v.meta()?.type),
  ).toEqual(["HumanName"]);

  expect(
    (
      await evaluateWithMeta(
        "$this.name.given",
        {
          resourceType: "Patient",
          name: [{ given: ["bob"], family: "jameson" }],
        },
        metaOptions("Patient"),
      )
    ).map((v) => v.meta()?.type),
  ).toEqual(["string"]);

  expect(
    (
      await evaluateWithMeta(
        "$this.identifier",
        {
          resourceType: "Patient",
          name: [{ given: ["bob"], family: "jameson" }],
          identifier: [{ system: "mrn", value: "123" }],
        },
        metaOptions("Patient"),
      )
    ).map((v) => v.meta()?.type),
  ).toEqual(["Identifier"]);

  expect(
    (
      await evaluateWithMeta(
        "$this.identifier.value",
        {
          resourceType: "Patient",
          name: [{ given: ["bob"], family: "jameson" }],
          identifier: [{ system: "mrn", value: "123" }],
        },
        metaOptions("Patient"),
      )
    ).map((v) => v.meta()?.type),
  ).toEqual(["string"]);

  expect(
    (
      await evaluateWithMeta(
        "$this.identifier.system",
        {
          resourceType: "Patient",
          name: [{ given: ["bob"], family: "jameson" }],
          identifier: [{ system: "mrn", value: "123" }],
        },
        metaOptions("Patient"),
      )
    ).map((v) => v.meta()?.type),
  ).toEqual(["uri"]);
});

test("Typechoice meta", async () => {
  expect(
    (
      await evaluateWithMeta(
        "$this.deceased",
        {
          resourceType: "Patient",
          name: [{ given: ["bob"], family: "jameson" }],
          deceasedBoolean: false,
          identifier: [{ system: "mrn", value: "123" }],
        },
        metaOptions("Patient"),
      )
    ).map((v) => v.meta()?.type),
  ).toEqual(["boolean"]);

  expect(
    (
      await evaluateWithMeta(
        "$this.deceased",
        {
          resourceType: "Patient",
          name: [{ given: ["bob"], family: "jameson" }],
          deceasedDateTime: "1980-01-01T00:00:00Z",
          identifier: [{ system: "mrn", value: "123" }],
        },
        metaOptions("Patient"),
      )
    ).map((v) => v.meta()?.type),
  ).toEqual(["dateTime"]);
});

test("is operator", async () => {
  expect(
    await evaluate(
      "($this.deceased as dateTime)",
      {
        resourceType: "Patient",
        deceasedBoolean: false,
      },
      {
        meta: {
          getSD,
        },
      },
    ),
  ).toEqual([]);

  expect(
    await evaluate(
      "($this.deceased as dateTime)",
      {
        resourceType: "Patient",
        deceasedDateTime: "1980-01-01T00:00:00Z",
      },
      {
        meta: {
          getSD,
        },
      },
    ),
  ).toEqual(["1980-01-01T00:00:00Z"]);
});

test("term with TypeIdentifier", async () => {
  expect(
    await evaluate(
      "(Patient.deceased as dateTime)",
      {
        resourceType: "Patient",
        deceasedBoolean: false,
      },
      {
        meta: {
          getSD,
        },
      },
    ),
  ).toEqual([]);

  expect(
    await evaluate(
      "(Patient.deceased as dateTime)",
      {
        resourceType: "Patient",
        deceasedDateTime: "1980-01-01T00:00:00Z",
      },
      {
        meta: {
          getSD,
        },
      },
    ),
  ).toEqual(["1980-01-01T00:00:00Z"]);
});

test("term with TypeIdentifier 'Resource'", async () => {
  expect(
    await evaluate("Resource.name", {
      resourceType: "Patient",
      name: [{ given: ["bob"], family: "waterson" }],
    }),
  ).toEqual([{ given: ["bob"], family: "waterson" }]);
});

test("union operation", async () => {
  expect(
    await evaluate(
      "$this.name.given | $this.name.family",
      {
        resourceType: "Patient",
        name: [{ given: ["bob"], family: "waterson" }],
      },
      {
        meta: {
          getSD,
        },
      },
    ),
  ).toEqual(["bob", "waterson"]);
});

test("resolve with is operation", async () => {
  expect(
    await evaluate(
      "CarePlan.subject.where(resolve is Patient)",
      {
        resourceType: "CarePlan",
        subject: [{ reference: "Patient/123" }],
      },
      {
        meta: {
          type: "CarePlan" as uri,
          getSD,
        },
      },
    ),
  ).toEqual([{ reference: "Patient/123" }]);
});

test("Subscription extension test", async () => {
  const sub = {
    id: "71298a23-1f35-486d-8d5a-27838966df8f",
    end: "2021-01-01T00:00:00Z",
    meta: {
      extension: [
        {
          url: "https://iguhealth.app/version-sequence",
          valueInteger: 4700,
        },
        {
          url: "https://iguhealth.app/author",
          valueString: "fake-user",
        },
      ],
      versionId: "4700",
      lastUpdated: "2023-08-17T18:40:14.396+00:00",
    },
    text: {
      div: '<div xmlns="http://www.w3.org/1999/xhtml">[Put rendering here]</div>',
      status: "generated",
    },
    reason: "Monitor new neonatal function",
    status: "active",
    channel: {
      _type: {
        extension: [
          {
            url: "https://iguhealth.app/Subscription/channel-type",
            valueCode: "operation",
          },
          {
            url: "https://iguhealth.app/Subscription/operation-code",
            valueCode: "test-1",
          },
        ],
      },
      header: ["Authorization: Bearer secret-token-abc-123"],
      payload: "application/fhir+json",
      endpoint: "https://biliwatch.com/customers/mount-auburn-miu/on-result",
    },
    contact: [
      {
        value: "ext 4123",
        system: "phone",
      },
    ],
    criteria: "Observation?code=29463-7",
    resourceType: "Subscription",
  };

  expect(
    await evaluate(
      "$this.channel.type.extension.where(url=%typeUrl).value",
      sub,
      {
        variables: {
          typeUrl: "https://iguhealth.app/Subscription/channel-type",
        },
      },
    ),
  ).toEqual(["operation"]);

  expect(
    await evaluate(
      "$this.channel.type.extension.where(url=%typeUrl).value",
      sub,
      {
        variables: {
          typeUrl: "https://iguhealth.app/Subscription/operation-code",
        },
      },
    ),
  ).toEqual(["test-1"]);

  expect(
    (
      await evaluateWithMeta(
        "$this.channel.type.extension.where(url=%typeUrl).value",
        sub,
        {
          variables: {
            typeUrl: "https://iguhealth.app/Subscription/operation-code",
          },
        },
      )
    ).map((v) => v.location()),
  ).toEqual([["channel", "_type", "extension", 1, "valueCode"]]);
  expect(
    (
      await evaluateWithMeta(
        "$this.channel.type.extension.where(url=%typeUrl).value",
        sub,
        {
          variables: {
            typeUrl: "https://iguhealth.app/Subscription/channel-type",
          },
        },
      )
    ).map((v) => v.location()),
  ).toEqual([["channel", "_type", "extension", 0, "valueCode"]]);
});

test("test reference finding", async () => {
  expect(
    (
      await evaluateWithMeta(
        "CarePlan.subject.where(resolve is Patient)",
        {
          resourceType: "CarePlan",
          subject: [
            { reference: "Patient/123" },
            { reference: "Practitioner/123" },
            { reference: "Patient/4" },
          ],
        },
        {
          meta: {
            type: "CarePlan" as uri,
            getSD,
          },
        },
      )
    ).map((v) => v.location()),
  ).toEqual([
    ["subject", 0],
    ["subject", 2],
  ]);
});

test("children", async () => {
  expect(
    await evaluate(
      "CarePlan.children()",
      {
        resourceType: "CarePlan",
        subject: [
          { reference: "Patient/123" },
          { reference: "Practitioner/123" },
          { reference: "Patient/4" },
        ],
      },
      {
        meta: {
          type: "CarePlan" as uri,
          getSD,
        },
      },
    ),
  ).toEqual([
    "CarePlan",
    { reference: "Patient/123" },
    { reference: "Practitioner/123" },
    { reference: "Patient/4" },
  ]);

  expect(
    (
      await evaluateWithMeta(
        "CarePlan.children()",
        {
          resourceType: "CarePlan",
          subject: [
            { reference: "Patient/123" },
            { reference: "Practitioner/123" },
            { reference: "Patient/4" },
          ],
        },
        {
          meta: {
            type: "CarePlan" as uri,
            getSD,
          },
        },
      )
    ).map((v) => v.location()),
  ).toEqual([["resourceType"], ["subject", 0], ["subject", 1], ["subject", 2]]);

  expect(
    (
      await evaluateWithMeta(
        "CarePlan.children().ofType(Reference)",
        {
          resourceType: "CarePlan",
          subject: [
            { reference: "Patient/123" },
            { reference: "Practitioner/123" },
            { reference: "Patient/4" },
          ],
        },
        {
          meta: {
            type: "CarePlan" as uri,
            getSD,
          },
        },
      )
    ).map((v) => v.location()),
  ).toEqual([
    ["subject", 0],
    ["subject", 1],
    ["subject", 2],
  ]);
});

test("descendants", async () => {
  expect(
    await evaluate(
      "Patient.descendants()",
      {
        resourceType: "Patient",
        name: [{ given: ["bob"], family: "jameson" }],
        deceasedBoolean: false,
        identifier: [{ system: "mrn", value: "123" }],
      },
      metaOptions("Patient"),
    ),
  ).toEqual([
    "Patient",
    {
      family: "jameson",
      given: ["bob"],
    },
    false,
    {
      system: "mrn",
      value: "123",
    },
    "bob",
    "jameson",
    "mrn",
    "123",
  ]);

  expect(
    await evaluate(
      "Patient.descendants().ofType(Identifier)",
      {
        resourceType: "Patient",
        name: [{ given: ["bob"], family: "jameson" }],
        deceasedBoolean: false,
        identifier: [{ system: "mrn", value: "123" }],
      },
      metaOptions("Patient"),
    ),
  ).toEqual([
    {
      system: "mrn",
      value: "123",
    },
  ]);
  expect(
    await evaluate(
      "Patient.descendants().ofType(string)",
      {
        resourceType: "Patient",
        name: [{ given: ["bob"], family: "jameson" }],
        deceasedBoolean: false,
        identifier: [{ system: "mrn", value: "123" }],
      },
      metaOptions("Patient"),
    ),
  ).toEqual(["bob", "jameson", "123"]);
});

test("descendants with type filter", async () => {
  expect(
    await evaluate(
      "Practitioner.descendants().ofType(Reference)",
      {
        extension: [
          { url: "test", valueReference: { reference: "urn:oid:2" } },
        ],
        resourceType: "Practitioner",
        name: [{ given: ["Bob"] }],
      },
      metaOptions("Patient"),
    ),
  ).toEqual([{ reference: "urn:oid:2" }]);
});

test("Get Locations for extensions", async () => {
  const operationDefinition: OperationDefinition = {
    resourceType: "OperationDefinition",
    status: "active",
    system: true,
    type: false,
    instance: false,
    code: "test",
    kind: "operation",
    name: "Test",
    _name: {
      extension: [
        {
          url: "https://iguhealth.app/Extension/encrypted-value",
          valueString: "testing",
        },
      ],
    },
  } as OperationDefinition;

  const nodes = await evaluateWithMeta(
    "$this.descendants().where($this.extension.url=%extUrl).value",
    operationDefinition,
    {
      variables: {
        extUrl: "https://iguhealth.app/Extension/encrypted-value",
      },
    },
  );
  expect(nodes.map((n) => n.valueOf())).toEqual(["Test"]);
  expect(nodes.map((n) => n.location())).toEqual([["name"]]);
});

test("Patient with name given", async () => {
  expect(
    await evaluate("Patient.name.given[0]", {
      fhirVersion: "4.0",
      type: "create-response",
      level: "type",
      resourceType: "Patient",
      body: {
        id: "1tdKkJKtV5LuZVrn43yvHB",
        meta: {
          extension: [
            {
              url: "https://iguhealth.app/version-sequence",
              valueInteger: 191,
            },
            {
              url: "https://iguhealth.app/author",
              valueReference: {
                reference: "ClientApplication/rB5mVKQ7wIxMeSWthQCE3l",
              },
            },
          ],
          versionId: "191",
          lastUpdated: "2024-06-14T18:15:48.285+00:00",
        },
        name: [{ given: ["Peter"], family: "Chalmers" }],
        resourceType: "Patient",
      },
    }),
  ).toEqual([]);
});

test("QR testing for authored", async () => {
  expect(
    (
      await evaluateWithMeta(
        "QuestionnaireResponse.author",
        {
          resourceType: "QuestionnaireResponse",
          authored: "2024-06-27T04:22:10-05:00",
          status: "in-progress",
        },
        metaOptions("QuestionnaireResponse.author"),
      )
    ).map((v) => v.meta()?.type),
  ).toEqual([]);
});
