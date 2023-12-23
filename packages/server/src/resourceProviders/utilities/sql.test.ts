import { expect, test } from "@jest/globals";

import { combineSqlStatements } from "./sql";

test("Test combining Sql statements", () => {
  expect(
    combineSqlStatements("AND", "SELECT * FROM table1", "SELECT * FROM table2")
  ).toEqual("SELECT * FROM table1 AND SELECT * FROM table2");
  expect(combineSqlStatements("AND", "", "SELECT * FROM table2")).toEqual(
    "SELECT * FROM table2"
  );

  expect(combineSqlStatements("AND", "", "")).toEqual("");
});
