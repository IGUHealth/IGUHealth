import { parse } from "./parser";

function isArray<T>(v: T | T[]): v is T[] {
  return Array.isArray(v);
}

function toCollection<T>(v: T | T[]): T[] {
  if (isArray(v)) {
    return v;
  } else {
    return [v];
  }
}

function expression(ast, context) {}

function evaluate(expression: string, value: unknown): unknown[] {
  const ast = parse(expression);
  const ctx = toCollection(value);
  return ctx;
}
