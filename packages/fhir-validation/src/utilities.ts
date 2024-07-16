export function validateIsObject(v: unknown): v is object {
  return typeof v === "object" && v !== null;
}
