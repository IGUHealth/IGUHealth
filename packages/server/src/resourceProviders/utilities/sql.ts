export function combineSqlStatements(
  joinBy: "AND" | "OR",
  ...sqlStrings: string[]
) {
  return sqlStrings.filter((sql) => sql && sql !== "").join(` ${joinBy} `);
}

export function or(...sqlStrings: string[]) {
  return combineSqlStatements("OR", ...sqlStrings);
}

export function and(...sqlStrings: string[]) {
  return combineSqlStatements("AND", ...sqlStrings);
}
