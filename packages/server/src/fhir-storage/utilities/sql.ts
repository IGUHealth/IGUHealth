import * as db from "zapatos/db";

export const paramsWithComma = (
  arr: unknown[],
): (db.Parameter | db.SQLFragment)[] =>
  db.mapWithSeparator(arr, db.sql`, `, (x) => db.param(x));
