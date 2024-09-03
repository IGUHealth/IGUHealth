import { expect, test } from "@jest/globals";

import parse from "./index.js";

test("parserv2 primitive test", () => {
  expect(parse("45.5 + 2 * 5 = 27")).toMatchSnapshot();
  expect(parse("'hello'+'wolrd'")).toMatchSnapshot();
  expect(parse("@1980 + @T12:00")).toMatchSnapshot();
  expect(parse("@1980T12:00Z + @T12:00")).toMatchSnapshot();
});

test("Nested access ops", () => {
  expect(parse("$this.test != 45")).toMatchSnapshot();
});

test("Nested access", () => {
  expect(parse("$this.test")).toMatchSnapshot();
});

test("variables", () => {
  expect(parse("%hello.test + %myint_test")).toMatchSnapshot();
});

test("functions", () => {
  expect(parse("hello()")).toMatchSnapshot();
  expect(parse("hello(45)")).toMatchSnapshot();
  expect(parse("hello(45, 32)")).toMatchSnapshot();
  expect(parse("%deep.test(45,32)")).toMatchSnapshot();
});

test("paren", () => {
  expect(parse("($this.test)[$total]")).toMatchSnapshot();
});
