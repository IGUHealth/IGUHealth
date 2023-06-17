import { evaluate } from "./index";

test("Eval tests", () => {
  // Operator testing
  expect(evaluate("4 + 5", {}, { variables: {} })).toEqual([9]);
  //   expect(
  //     evaluate("$this.test + 2 * 4", { test: 4 }, { variables: {} })
  //   ).toEqual([9]);
  expect(evaluate("$this.test + 2", { test: 4 }, { variables: {} })).toEqual([
    6,
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
