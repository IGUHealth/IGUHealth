import { SQLFragment } from "zapatos/db";

export function toSQLString(sql: SQLFragment): string {
  const v = sql.compile();
  let text = v.text;
  v.values.forEach((v, i) => {
    text = text.replace(`$${i + 1}`, typeof v === "string" ? `'${v}'` : v);
  });
  return text;
}
