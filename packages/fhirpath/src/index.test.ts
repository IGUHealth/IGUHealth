import { evaluate, evaluateWithMeta } from "./index";
import { StructureDefinition, code } from "@genfhi/fhir-types/r4/types";
import loadArtifacts from "@genfhi/artifacts/loadArtifacts";
import { MetaValue } from "@genfhi/meta-value";

const sds: StructureDefinition[] = loadArtifacts(
  "StructureDefinition",
  "/sd-proxy/"
);

function getSD(type: code) {
  const foundSD = sds.find((sd) => sd.type === type);
  return foundSD;
}

const metaOptions = (startingType: code) => ({
  meta: {
    type: startingType,
    getSD: getSD,
  },
});

test("Eval tests", () => {
  // Operator testing
  expect(evaluate("4 + 5", {})).toEqual([9]);
  expect(evaluate("$this.test + 2 * 4", { test: 4 })).toEqual([12]);

  expect(evaluate("2 * 4", { test: 4 })).toEqual([8]);

  expect(evaluate("$this.test * 2", { test: 4 })).toEqual([8]);
});

test("Variable tests", () => {
  expect(evaluate("%nonexistant", {})).toEqual([]);
  expect(
    evaluate(
      "%hello.test",
      {},
      { variables: { hello: [{ test: 4 }, { test: 3 }] } }
    )
  ).toEqual([4, 3]);

  expect(
    evaluate(
      "%hello.test",
      {},
      {
        variables: (name: string) => {
          return [{ test: 4 }, { test: 3 }];
        },
      }
    )
  ).toEqual([4, 3]);
});

test("PrimitiveExtensions", () => {
  expect(evaluate("%nonexistant", {})).toEqual([]);
  expect(
    evaluate(
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
      }
    )
  ).toEqual([true]);
});

test("PrimitiveExtensions array", () => {
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
  expect(evaluate("%hello.test.id", {}, options)).toEqual([
    "id1",
    "id2",
    "id3",
  ]);
});

test("typechoices", () => {
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
  expect(evaluate("%hello.test", {}, options)).toEqual([4, 5, "3"]);
  expect(evaluate("%hello.test.id", {}, options)).toEqual([
    "id1",
    "id2",
    "id3",
  ]);
});

test("Test all operations", () => {
  expect(evaluate("(5 + 5) / (4-2)", {})).toEqual([5]);
  expect(evaluate("4 + 4 / 4 - 2", {})).toEqual([3]);
  expect(evaluate("(4 + 4) / (4 - 2)", {})).toEqual([4]);
});

test("exists", () => {
  expect(evaluate("$this.exists(test)", { test: [1, 2, 3] })).toEqual([true]);

  expect(evaluate("$this.exists()", { test: [1, 2, 3] })).toEqual([true]);

  expect(evaluate("$this.exists($this.z)", { test: [1, 2, 3] })).toEqual([
    false,
  ]);

  expect(evaluate("$this.exists()", undefined)).toEqual([false]);
});

test("empty", () => {
  expect(evaluate("5.empty()", { test: [1, 2, 3] })).toEqual([false]);

  expect(evaluate("$this.test.empty()", { test: [1, 2, 3] })).toEqual([false]);

  expect(evaluate("test.empty()", { test: [1, 2, 3] })).toEqual([false]);

  expect(evaluate("empty()", undefined)).toEqual([true]);

  expect(evaluate("$this.z.empty()", { test: [1, 2, 3] })).toEqual([true]);
});

test("all", () => {
  expect(evaluate("$this.test.all($this=1)", { test: [1, 2, 3] })).toEqual([
    false,
  ]);
  expect(evaluate("$this.test.all($this=1)", { test: [1, 1] })).toEqual([true]);
  expect(evaluate("$this.test.all($this=1)", { test: [1] })).toEqual([true]);
  expect(evaluate("1.all($this=1)", { test: [1] })).toEqual([true]);
});

test("allTrue", () => {
  expect(evaluate("$this.test.allTrue()", { test: [true, true] })).toEqual([
    true,
  ]);
  expect(
    evaluate("$this.test.allTrue()", { test: [true, true, false] })
  ).toEqual([false]);

  expect(evaluate("$this.test.allTrue()", { test: [true, true, 1] })).toEqual([
    false,
  ]);

  expect(evaluate("true.allTrue()", { test: [true, true, 1] })).toEqual([true]);
});

test("anyTrue", () => {
  expect(evaluate("$this.test.anyTrue()", { test: [true, true] })).toEqual([
    true,
  ]);
  expect(
    evaluate("$this.test.anyTrue()", { test: [true, true, false] })
  ).toEqual([true]);
  expect(evaluate("$this.test.anyTrue()", { test: [true, true, 1] })).toEqual([
    true,
  ]);
  expect(evaluate("false.anyTrue()", {})).toEqual([false]);
  expect(evaluate("true.anyTrue()", {})).toEqual([true]);
  expect(evaluate("$this.test.anyTrue()", { test: [false, 5, 1] })).toEqual([
    false,
  ]);
});

test("allFalse", () => {
  expect(evaluate("$this.test.allFalse()", { test: [0, 1, false] })).toEqual([
    false,
  ]);
});

test("anyFalse", () => {
  expect(evaluate("$this.test.anyFalse()", { test: [0, 1, false] })).toEqual([
    true,
  ]);
});

test("subsetOf", () => {
  expect(
    evaluate("%set2.subsetOf(%set1)", undefined, {
      variables: { set1: [0, 1, false], set2: [0, -1], set3: ["none"] },
    })
  ).toEqual([false]);
  expect(
    evaluate("%set2.subsetOf(%set1)", undefined, {
      variables: { set1: [0, 1, false], set2: [0], set3: ["none"] },
    })
  ).toEqual([true]);
  expect(
    evaluate("%set2.subsetOf(%set1)", undefined, {
      variables: { set1: [0, 1, false], set2: [0, 1], set3: ["none"] },
    })
  ).toEqual([true]);
  expect(
    evaluate("%set2.subsetOf(%set1)", undefined, {
      variables: { set1: [0, 1, false], set2: [0, 1, false], set3: ["none"] },
    })
  ).toEqual([true]);
  expect(
    evaluate("%set1.subsetOf(%set2)", undefined, {
      variables: { set1: [0, 1, false], set2: [0, 1], set3: ["none"] },
    })
  ).toEqual([false]);
  expect(
    evaluate("%set3.subsetOf(%set2)", undefined, {
      variables: { set1: [0, 1, false], set2: [0, 1], set3: ["none"] },
    })
  ).toEqual([false]);
});

test("supersetOf", () => {
  expect(
    evaluate("%set1.supersetOf(%set2)", undefined, {
      variables: { set1: [0, 1, false], set2: [0, 1], set3: ["none"] },
    })
  ).toEqual([true]);

  expect(
    evaluate("%set2.supersetOf(%set1)", undefined, {
      variables: { set1: [0, 1, false], set2: [0, 1], set3: ["none"] },
    })
  ).toEqual([false]);
});

test("distinct", () => {
  expect(evaluate("$this.distinct()", [{ v: 1 }, { v: 1 }, 2])).toEqual([
    2,
    { v: 1 },
  ]);

  expect(
    evaluate(
      "$this.distinct().count()= %set1.count()",
      [{ v: 1 }, { v: 1 }, 2],
      {
        variables: { set1: [1, 1, 2] },
      }
    )
  ).toEqual([false]);

  expect(evaluate("$this.isDistinct()", [{ v: 1 }, { v: 1 }, 2])).toEqual([
    false,
  ]);

  expect(evaluate("$this.isDistinct()", [{ v: 1 }, { v: 2 }])).toEqual([true]);
});

test("where", () => {
  expect(evaluate("$this.where($this=1)", [1, 2, 3])).toEqual([1]);

  expect(() => {
    evaluate("$this.where('Bob')", [{ name: "John" }, { name: "Bob" }]);
  }).toThrow();
});

test("select", () => {
  expect(
    evaluate("$this.select($this.name.given + ' ' + $this.name.family)", [
      { name: { given: ["Bob"], family: "Jameson" } },
      { name: { given: ["Jason"], family: "Kyle" } },
    ])
  ).toEqual(["Bob Jameson", "Jason Kyle"]);
});

test("repeat", () => {
  expect(
    evaluate("$this.repeat(item)", [
      {
        resourceType: "Questionnaire",
        item: [{ id: "1", item: [{ id: "2", item: { id: "4" } }] }],
      },
    ])
  ).toEqual([
    { id: "1", item: [{ id: "2", item: { id: "4" } }] },
    { id: "2", item: { id: "4" } },
    { id: "4" },
  ]);
});

test("indexed", () => {
  expect(() => {
    evaluate("$this.test['test']", { test: [1, 2, 3] });
  }).toThrow();
  expect(evaluate("$this.test[0]", { test: [1, 2, 3] })).toEqual([1]);
});

test("backtick", () => {
  expect(evaluate("$this.`PID-1`", { "PID-1": "PID-1 value" })).toEqual([
    "PID-1 value",
  ]);
});

test("ofType", () => {
  expect(
    evaluate("ofType(Patient)", [
      { resourceType: "Patient" },
      { resourceType: "MedicationRequest" },
    ])
  ).toEqual([{ resourceType: "Patient" }]);
  expect(() => {
    evaluate("ofType(HumanName)", [
      { resourceType: "Patient" },
      { resourceType: "MedicationRequest" },
    ]);
  }).toThrow();
});

test("Return Type meta", () => {
  expect(
    evaluateWithMeta(
      "$this.name",
      {
        resourceType: "Patient",
        name: [{ given: ["bob"], family: "jameson" }],
      },
      metaOptions("Patient")
    ).map((v) => v.meta()?.type)
  ).toEqual(["HumanName"]);

  expect(
    evaluateWithMeta(
      "$this.name.given",
      {
        resourceType: "Patient",
        name: [{ given: ["bob"], family: "jameson" }],
      },
      metaOptions("Patient")
    ).map((v) => v.meta()?.type)
  ).toEqual(["string"]);

  expect(
    evaluateWithMeta(
      "$this.identifier",
      {
        resourceType: "Patient",
        name: [{ given: ["bob"], family: "jameson" }],
        identifier: [{ system: "mrn", value: "123" }],
      },
      metaOptions("Patient")
    ).map((v) => v.meta()?.type)
  ).toEqual(["Identifier"]);

  expect(
    evaluateWithMeta(
      "$this.identifier.value",
      {
        resourceType: "Patient",
        name: [{ given: ["bob"], family: "jameson" }],
        identifier: [{ system: "mrn", value: "123" }],
      },
      metaOptions("Patient")
    ).map((v) => v.meta()?.type)
  ).toEqual(["string"]);

  expect(
    evaluateWithMeta(
      "$this.identifier.system",
      {
        resourceType: "Patient",
        name: [{ given: ["bob"], family: "jameson" }],
        identifier: [{ system: "mrn", value: "123" }],
      },
      metaOptions("Patient")
    ).map((v) => v.meta()?.type)
  ).toEqual(["uri"]);
});

test("Typechoice meta", () => {
  expect(
    evaluateWithMeta(
      "$this.deceased",
      {
        resourceType: "Patient",
        name: [{ given: ["bob"], family: "jameson" }],
        deceasedBoolean: false,
        identifier: [{ system: "mrn", value: "123" }],
      },
      metaOptions("Patient")
    ).map((v) => v.meta()?.type)
  ).toEqual(["boolean"]);

  expect(
    evaluateWithMeta(
      "$this.deceased",
      {
        resourceType: "Patient",
        name: [{ given: ["bob"], family: "jameson" }],
        deceasedDateTime: "1980-01-01T00:00:00Z",
        identifier: [{ system: "mrn", value: "123" }],
      },
      metaOptions("Patient")
    ).map((v) => v.meta()?.type)
  ).toEqual(["dateTime"]);
});
