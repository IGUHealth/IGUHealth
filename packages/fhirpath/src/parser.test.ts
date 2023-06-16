import { parse } from "./parser";

test("adds 1 + 2 to equal 3", () => {
  expect(parse("test.this != test.this + whatever.test - testerino.z")).toBe(3);
});

const output = {
  left: {
    children: {
      children: [],
      type: "Expression",
      value: { type: "Identifier", value: "this" },
    },
    type: "Expression",
    value: { type: "Identifier", value: "test" },
  },
  operator: "!=",
  right: {
    left: {
      left: {
        children: {
          children: [],
          type: "Expression",
          value: { type: "Identifier", value: "this" },
        },
        type: "Expression",
        value: { type: "Identifier", value: "test" },
      },
      operator: "+",
      right: {
        children: {
          children: [],
          type: "Expression",
          value: { type: "Identifier", value: "test" },
        },
        type: "Expression",
        value: { type: "Identifier", value: "whatever" },
      },
      type: "Operation",
    },
    operator: "-",
    right: {
      children: {
        children: [],
        type: "Expression",
        value: { type: "Identifier", value: "z" },
      },
      type: "Expression",
      value: { type: "Identifier", value: "testerino" },
    },
    type: "Operation",
  },
  type: "Operation",
};
