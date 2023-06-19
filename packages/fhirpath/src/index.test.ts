import { evaluate } from "./index";

test("Eval tests", () => {
  // Operator testing
  expect(evaluate("4 + 5", {}, { variables: {} })).toEqual([9]);
  expect(
    evaluate("$this.test + 2 * 4", { test: 4 }, { variables: {} })
  ).toEqual([12]);

  expect(evaluate("2 * 4", { test: 4 }, { variables: {} })).toEqual([8]);

  expect(evaluate("$this.test * 2", { test: 4 }, { variables: {} })).toEqual([
    8,
  ]);
});

test("Variable tests", () => {
  expect(evaluate("%nonexistant", {}, { variables: {} })).toEqual([]);
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
  expect(evaluate("%nonexistant", {}, { variables: {} })).toEqual([]);
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
  expect(evaluate("(5 + 5) / (4-2)", {}, { variables: {} })).toEqual([5]);
  expect(evaluate("4 + 4 / 4 - 2", {}, { variables: {} })).toEqual([3]);
  expect(evaluate("(4 + 4) / (4 - 2)", {}, { variables: {} })).toEqual([4]);
});

test("exists", () => {
  expect(
    evaluate("$this.exists(test)", { test: [1, 2, 3] }, { variables: {} })
  ).toEqual([true]);

  expect(
    evaluate("$this.exists()", { test: [1, 2, 3] }, { variables: {} })
  ).toEqual([true]);

  expect(
    evaluate("$this.exists($this.z)", { test: [1, 2, 3] }, { variables: {} })
  ).toEqual([false]);

  expect(evaluate("$this.exists()", undefined, { variables: {} })).toEqual([
    false,
  ]);
});

test("empty", () => {
  expect(evaluate("5.empty()", { test: [1, 2, 3] }, { variables: {} })).toEqual(
    [false]
  );

  expect(
    evaluate("$this.test.empty()", { test: [1, 2, 3] }, { variables: {} })
  ).toEqual([false]);

  expect(
    evaluate("test.empty()", { test: [1, 2, 3] }, { variables: {} })
  ).toEqual([false]);

  expect(evaluate("empty()", undefined, { variables: {} })).toEqual([true]);

  expect(
    evaluate("$this.z.empty()", { test: [1, 2, 3] }, { variables: {} })
  ).toEqual([true]);
});

test("all", () => {
  expect(
    evaluate("$this.test.all($this=1)", { test: [1, 2, 3] }, { variables: {} })
  ).toEqual([false]);
  expect(
    evaluate("$this.test.all($this=1)", { test: [1, 1] }, { variables: {} })
  ).toEqual([true]);
  expect(
    evaluate("$this.test.all($this=1)", { test: [1] }, { variables: {} })
  ).toEqual([true]);
  expect(evaluate("1.all($this=1)", { test: [1] }, { variables: {} })).toEqual([
    true,
  ]);
});

test("allTrue", () => {
  expect(
    evaluate("$this.test.allTrue()", { test: [true, true] }, { variables: {} })
  ).toEqual([true]);
  expect(
    evaluate(
      "$this.test.allTrue()",
      { test: [true, true, false] },
      { variables: {} }
    )
  ).toEqual([false]);

  expect(
    evaluate(
      "$this.test.allTrue()",
      { test: [true, true, 1] },
      { variables: {} }
    )
  ).toEqual([false]);

  expect(
    evaluate("true.allTrue()", { test: [true, true, 1] }, { variables: {} })
  ).toEqual([true]);
});

test("anyTrue", () => {
  expect(
    evaluate("$this.test.anyTrue()", { test: [true, true] }, { variables: {} })
  ).toEqual([true]);
  expect(
    evaluate(
      "$this.test.anyTrue()",
      { test: [true, true, false] },
      { variables: {} }
    )
  ).toEqual([true]);
  expect(
    evaluate(
      "$this.test.anyTrue()",
      { test: [true, true, 1] },
      { variables: {} }
    )
  ).toEqual([true]);
  expect(evaluate("false.anyTrue()", {}, { variables: {} })).toEqual([false]);
  expect(evaluate("true.anyTrue()", {}, { variables: {} })).toEqual([true]);
  expect(
    evaluate("$this.test.anyTrue()", { test: [false, 5, 1] }, { variables: {} })
  ).toEqual([false]);
});

test("anyTrue", () => {
  expect(
    evaluate(
      "$this.test.anyFalse()",
      { test: [0, 1, false] },
      { variables: {} }
    )
  ).toEqual([true]);
});
