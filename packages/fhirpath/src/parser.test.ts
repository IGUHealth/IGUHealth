import { parse } from "./parser";

test("adds 1 + 2 to equal 3", () => {
  expect(parse("test.this")).toBe(3);
});
