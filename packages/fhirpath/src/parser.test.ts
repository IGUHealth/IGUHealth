import { parse } from "./parser";

test("SNAPSHOT Tests", () => {
  // Operator testing
  expect(parse("$this.test + $this.test2")).toMatchSnapshot();
  expect(parse("$this.test + $this.test2 - 14")).toMatchSnapshot();
  expect(
    parse(
      "45 < $this.test.that * $this.test2 / 14 | 'test' in 'hello' and x != 12 and 45 implies 23"
    )
  ).toMatchSnapshot();

  // Deliniated identifiers testing
  expect(
    parse("test.`HELLO-WORLD IDENTIFIER`.deliniated.`strange-synt`")
  ).toMatchSnapshot();

  // expect(parse("45days - 12years")).toMatchSnapshot();
  // Parameter testing
  expect(
    parse(
      "$this.test.where(value != 'test' and value / 11 = 12, $index != $total + %testing)"
    )
  ).toMatchSnapshot();
  // Literal testing
  expect(parse("'testing'")).toMatchSnapshot();
  expect(
    parse(
      "true != false and @T04:00 = @T04:00 and @1980-01-01 != @1980-01-01T00:00:00Z = @1980-01-01T00:00:00-05:00"
    )
  ).toMatchSnapshot();
  // Number testing
  expect(parse("45 - 55.23 + 0.23")).toMatchSnapshot();

  expect(parse("this[45 + 15 * 3].hello")).toMatchSnapshot();
  expect(parse("$this.test + 2 * 4")).toMatchSnapshot();

  expect(parse("true.anyTrue()")).toMatchSnapshot();
});
