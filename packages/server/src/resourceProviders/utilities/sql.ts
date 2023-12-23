export function combineSqlStatements(
  joinBy: "AND" | "OR",
  ...sqlStrings: string[]
) {
  return sqlStrings.filter((sql) => sql && sql !== "").join(` ${joinBy} `);
}
