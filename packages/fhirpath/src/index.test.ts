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
