import { parse } from "./parser";

type Options = {
  variables: Record<string, unknown> | ((v: string) => unknown);
};

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

function getVariableValue(name: string, options: Options): unknown[] {
  let value;

  if (options.variables instanceof Function) {
    value = options.variables(name);
  }
  value = options.variables[name];

  return toCollection(value);
}

const fp_functions: Record<
  string,
  (ast: any, context: unknown[], options: Options) => unknown[]
> = {};

function evaluateTerm(
  ast: any,
  context: unknown[],
  options: Options
): unknown[] {
  let curNode = ast;
  while (curNode) {
    switch (curNode.value.type) {
      case "Literal": {
        context = [curNode.value.value];
        break;
      }
      case "Variable": {
        context = [getVariableValue(curNode.value.value, options)];
        break;
      }
      case "Function":
        let fp_func = fp_functions[curNode.value.value];
        if (!fp_func)
          throw new Error("Unknown function '" + curNode.value.value + "'");
        context = fp_func(curNode.value, context, options);
        break;

      case "DotAccess":
        context = context
          .map((v: unknown) => (v as any)[curNode.value.value])
          .filter((v: unknown) => v !== undefined);
        break;

      case "Indexed":
        let indexed = _evaluate(curNode.value.value, context, options);
        if (indexed.length !== 1)
          throw new Error("Indexing requires a single value");
        if (typeof indexed[0] !== "number")
          throw new Error("Indexing requires a number");
        context = context.map((v) => (v as any)[indexed[0] as number]);
        break;
      default:
        throw new Error("Unknown term type: '" + curNode.value.type + "'");
    }
    curNode = curNode.next;
  }
  return context;
}

function binaryOperator<T>(left: T[], right: T[]): [T, T] {
  return [left[0], right[0]];
}

function evaluateOperation(
  ast: any,
  context: unknown[],
  options: Options
): unknown[] {
  const left = evaluateTerm(ast.left, context, options);
  const right = evaluateTerm(ast.right, context, options);
  switch (ast.operator) {
    case "+":
      return left[0] + right[0];
    case "_":
      return left[0] - right[0];
    case "*":
      return left[0] * right[0];
    case "/":
      return left[0] / right[0];
    default:
      throw new Error("Unsupported operator: '" + ast.operator + "'");
  }
}

function _evaluate(ast: any, context: unknown[], options: Options): unknown[] {
  if (ast.type !== "Expression") throw new Error("Invalid AST");
  switch (ast.value.type) {
    case "Operation": {
      return evaluateOperation(ast.value, context, options);
    }
    case "Term": {
      return evaluateTerm(ast.value, context, options);
    }
  }
}

function evaluate(
  expression: string,
  value: unknown,
  options: Options
): unknown[] {
  const ast = parse(expression);
  const ctx = toCollection(value);
  _evaluate(ast, ctx, options);
  return ctx;
}
