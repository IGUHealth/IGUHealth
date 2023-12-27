import * as db from "zapatos/db";

export const paramsWithComma = (
  arr: unknown[]
): (db.Parameter | db.SQLFragment)[] =>
  db.mapWithSeparator(arr, db.sql`, `, (x) => db.param(x));

export const logQueryWithValues = (query: db.SQLQuery) => {
  console.log(
    query.values.reduce((queryText: string, value, index) => {
      return queryText.replace(`$${index + 1}`, `'${value}'`);
    }, query.text)
  );
};
