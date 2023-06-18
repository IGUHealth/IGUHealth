import { parse } from "./parser";
import { toFhirPathNode, FHIRPathNode, descend, getValue } from "./node";

type Options = {
  variables: Record<string, unknown> | ((v: string) => unknown);
};

function getVariableValue(
  name: string,
  options: Options
): FHIRPathNode<unknown>[] {
  let value;
  if (options.variables instanceof Function) {
    value = options.variables(name);
  } else if (options.variables instanceof Object) {
    value = options.variables[name];
  }
  return toFhirPathNode(value);
}

const fp_functions: Record<
  string,
  (
    ast: any,
    context: FHIRPathNode<unknown>[],
    options: Options
  ) => FHIRPathNode<unknown>[]
> = {};

function evaluateInvocation(
  ast: any,
  context: FHIRPathNode<unknown>[],
  options: Options
): FHIRPathNode<unknown>[] {
  switch (ast.value.type) {
    case "Index":
      throw new Error("Not implemented");
    case "Total":
      throw new Error("Not implemented");
    case "This":
      return context;
    case "Identifier":
      return context.reduce(
        (acc: FHIRPathNode<unknown>[], v) => [
          ...acc,
          ...descend(v, ast.value.value),
        ],
        []
      );
    case "Function":
      let fp_func = fp_functions[ast.value.value];
      if (!fp_func)
        throw new Error("Unknown function '" + ast.value.value + "'");
      return fp_func(ast.value, context, options);
    default:
      throw new Error("Unknown invocation type: '" + ast.value.type + "'");
  }
}

function _evaluateTermStart(
  ast: any,
  context: FHIRPathNode<unknown>[],
  options: Options
): FHIRPathNode<unknown>[] {
  switch (ast.value.type) {
    case "Invocation":
      return evaluateInvocation(ast.value, context, options);
    case "Literal": {
      return toFhirPathNode(ast.value.value);
    }
    case "Variable":
      return getVariableValue(ast.value.value.value, options);
    case "Expression":
      return _evaluate(ast.value, context, options);
    default:
      throw new Error("Unknown term type: '" + ast.value.type + "'");
  }
}

function evaluateTerm(
  ast: any,
  context: FHIRPathNode<unknown>[],
  options: Options
): FHIRPathNode<unknown>[] {
  const start = _evaluateTermStart(ast, context, options);
  if (ast.next) {
    return ast.next.reduce((context: FHIRPathNode<unknown>[], next: any) => {
      return evaluateInvocation(next, context, options);
    }, start);
  }
  return start;
}

function evaluateProperty(
  ast: any,
  context: FHIRPathNode<unknown>[],
  options: Options
): FHIRPathNode<unknown>[] {
  switch (ast.value.type) {
    case "Invocation":
      return evaluateInvocation(ast.value, context, options);
    case "Indexed":
      let indexed = _evaluate(ast.value, ast, options);
      if (indexed.length !== 1)
        throw new Error("Indexing requires a single value");
      if (typeof indexed[0] !== "number")
        throw new Error("Indexing requires a number");
      return [context[indexed[0] as number]];
    default:
      throw new Error("Unknown term type: '" + ast.value.type + "'");
  }
}

type OperatorType<op_type> = op_type extends "number"
  ? number
  : op_type extends "string"
  ? string
  : unknown;

type ValidOperandType = "number" | "string";

function validateOperators<T extends ValidOperandType, U>(
  typeChecking: T,
  args: unknown[]
): args is Array<OperatorType<T>> {
  return args.reduce((acc: boolean, v) => {
    if (typeof v !== typeChecking) return false;
    return acc;
  }, true) as boolean;
}

function invalidOperandError(args: unknown[], operator: string) {
  throw new Error(
    `Invalid operands for operator: '${operator}' Found types '${typeof args[0]}' and '${typeof args[1]}'`
  );
}

function evaluateOperation(
  ast: any,
  context: FHIRPathNode<unknown>[],
  options: Options
): FHIRPathNode<unknown>[] {
  const left = _evaluate(ast.left, context, options);
  const right = _evaluate(ast.right, context, options);
  const binaryArgs = [getValue(left[0]), getValue(right[0])];

  switch (ast.operator) {
    case "+":
      if (validateOperators("number", binaryArgs)) {
        return toFhirPathNode(binaryArgs[0] + binaryArgs[1]);
      } else if (validateOperators("string", binaryArgs)) {
        return toFhirPathNode(binaryArgs[0] + binaryArgs[1]);
      } else {
        invalidOperandError(binaryArgs, ast.operator);
      }
    case "_":
      if (validateOperators("number", binaryArgs)) {
        return toFhirPathNode(binaryArgs[0] - binaryArgs[0]);
      } else {
        invalidOperandError(binaryArgs, ast.operator);
      }
    case "*":
      if (validateOperators("number", binaryArgs)) {
        return toFhirPathNode(binaryArgs[0] * binaryArgs[0]);
      } else {
        invalidOperandError(binaryArgs, ast.operator);
      }
    case "/":
      if (validateOperators("number", binaryArgs)) {
        return toFhirPathNode(binaryArgs[0] / binaryArgs[0]);
      } else {
        invalidOperandError(binaryArgs, ast.operator);
      }
    default:
      throw new Error("Unsupported operator: '" + ast.operator + "'");
  }
}

function _evaluate(
  ast: any,
  context: FHIRPathNode<unknown>[],
  options: Options
): FHIRPathNode<unknown>[] {
  switch (ast.type) {
    case "Operation": {
      return evaluateOperation(ast, context, options);
    }
    case "Term": {
      return evaluateTerm(ast, context, options);
    }
    default:
      throw new Error("Invalid AST Expression Node '" + ast.value.type + "'");
  }
}

export function evaluate(
  expression: string,
  value: unknown,
  options: Options
): unknown[] {
  const ast = parse(expression);
  const ctx = toFhirPathNode(value);
  const output = _evaluate(ast, ctx, options);
  return output.map((v) => getValue(v));
}
