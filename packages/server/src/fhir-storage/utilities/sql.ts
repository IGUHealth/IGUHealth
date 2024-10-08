import * as db from "zapatos/db";

export const paramsWithComma = (
  arr: unknown[],
): (db.Parameter | db.SQLFragment)[] =>
  db.mapWithSeparator(arr, db.sql`, `, (x) => db.param(x));

export const intersect = (arr: db.SQLFragment[]): db.SQLFragment[] =>
  db.mapWithSeparator(arr, db.sql` INTERSECT `, (x) => x);
