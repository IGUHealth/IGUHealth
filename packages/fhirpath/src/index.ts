import { parse } from "./parser";
import { toFPNodes, FHIRPathNodeType, descend } from "./node";

type Options = {
  variables: Record<string, unknown> | ((v: string) => unknown);
};

function flatten<T>(arr: T[][]): T[] {
  return arr.reduce((acc, v) => [...acc, ...v], []);
}

function getVariableValue(
  name: string,
  options: Options
): FHIRPathNodeType<unknown>[] {
  let value;
  if (options.variables instanceof Function) {
    value = options.variables(name);
  } else if (options.variables instanceof Object) {
    value = options.variables[name];
  }

  return toFPNodes(value);
}

const fp_functions: Record<
  string,
  (
    ast: any,
    context: FHIRPathNodeType<unknown>[],
    options: Options
  ) => FHIRPathNodeType<unknown>[]
> = {
  // Returns true if the input collection is empty ({ }) and false otherwise.
  exists: function (ast, context, options) {
    if (ast.next.length === 1) {
      return toFPNodes(_evaluate(ast.next[0], context, options).length > 0);
    }
    return toFPNodes(context.length > 0);
  },
  // exists([criteria : expression]) : Boolean
  empty(ast, context, options) {
    return toFPNodes(context.length === 0);
  },
  all(ast, context, options) {
    return toFPNodes(
      flatten(context.map((v) => _evaluate(ast.next[0], [v], options)))
        .map((v) => v.value)
        .reduce((acc, v) => acc && v, true)
    );
  },
  allTrue(ast, context, options) {
    return toFPNodes(context.reduce((acc, v) => v.value === true && acc, true));
  },
  anyTrue(ast, context, options) {
    return toFPNodes(
      context.reduce((acc, v) => v.value === true || acc, false)
    );
  },
  allFalse(ast, context, options) {
    return toFPNodes(
      context.reduce((acc, v) => v.value === false && acc, true)
    );
  },
  anyFalse(ast, context, options) {
    return toFPNodes(
      context.reduce((acc, v) => v.value === false || acc, false)
    );
  },
  subsetOf(ast, context, options) {
    const otherSet = _evaluate(ast.next[0], context, options);
    return toFPNodes(
      context.reduce(
        (acc, v1) =>
          acc &&
          otherSet.find((v2) => {
            const result = fp_operations["="]([v1], [v2], options);
            return result[0].value;
          }) !== undefined,
        true
      )
    );
  },
};

function evaluateInvocation(
  ast: any,
  context: FHIRPathNodeType<unknown>[],
  options: Options
): FHIRPathNodeType<unknown>[] {
  switch (ast.value.type) {
    case "Index":
      throw new Error("Not implemented");
    case "Total":
      throw new Error("Not implemented");
    case "This":
      return context;
    case "Identifier":
      return flatten(context.map((v) => descend(v, ast.value.value)));
    case "Function":
      const fp_func = fp_functions[ast.value.value.value];
      if (!fp_func)
        throw new Error("Unknown function '" + ast.value.value.value + "'");
      return fp_func(ast.value, context, options);
    default:
      throw new Error("Unknown invocation type: '" + ast.value.type + "'");
  }
}

function _evaluateTermStart(
  ast: any,
  context: FHIRPathNodeType<unknown>[],
  options: Options
): FHIRPathNodeType<unknown>[] {
  switch (ast.value.type) {
    case "Invocation":
      return evaluateInvocation(ast.value, context, options);
    case "Literal": {
      return toFPNodes(ast.value.value);
    }
    case "Variable":
      return getVariableValue(ast.value.value.value, options);
    case "Expression":
      return _evaluate(ast.value, context, options);
    default:
      throw new Error("Unknown term type: '" + ast.value.type + "'");
  }
}

function evaluateProperty(
  ast: any,
  context: FHIRPathNodeType<unknown>[],
  options: Options
): FHIRPathNodeType<unknown>[] {
  switch (ast.type) {
    case "Invocation":
      return evaluateInvocation(ast, context, options);
    case "Indexed":
      let indexed = _evaluate(ast.value, context, options);
      if (indexed.length !== 1)
        throw new Error("Indexing requires a single value");
      if (typeof indexed[0] !== "number")
        throw new Error("Indexing requires a number");
      return [context[indexed[0] as number]];
    default:
      throw new Error("Unknown term type: '" + ast.type + "'");
  }
}

function evaluateSingular(
  ast: any,
  context: FHIRPathNodeType<unknown>[],
  options: Options
): FHIRPathNodeType<unknown>[] {
  const start = _evaluateTermStart(ast, context, options);
  if (ast.next) {
    return ast.next.reduce(
      (context: FHIRPathNodeType<unknown>[], next: any) => {
        return evaluateProperty(next, context, options);
      },
      start
    );
  }
  return start;
}

type OperatorType<op_type> = op_type extends "number"
  ? number
  : op_type extends "string"
  ? string
  : unknown;

type ValidOperandType = "number" | "string";

function validateOperators<T extends ValidOperandType, U>(
  typeChecking: T,
  args: FHIRPathNodeType<unknown>[]
): args is FHIRPathNodeType<OperatorType<T>>[] {
  return args.reduce((acc: boolean, v: FHIRPathNodeType<unknown>) => {
    if (typeof v.value !== typeChecking) return false;
    return acc;
  }, true) as boolean;
}

function invalidOperandError(args: unknown[], operator: string) {
  new Error(
    `Invalid operands for operator: '${operator}' Found types '${typeof args[0]}' and '${typeof args[1]}'`
  );
}

const fp_operations: Record<
  string,
  (
    left: FHIRPathNodeType<unknown>[],
    right: FHIRPathNodeType<unknown>[],
    options: Options
  ) => FHIRPathNodeType<unknown>[]
> = {
  "+"(left, right, options) {
    if (
      validateOperators("number", left) &&
      validateOperators("number", right)
    ) {
      return toFPNodes(left[0].value + right[0].value);
    } else if (
      validateOperators("string", left) &&
      validateOperators("string", right)
    ) {
      return toFPNodes(left[0].value + right[0].value);
    } else {
      throw invalidOperandError([left[0], right[0]], "+");
    }
  },
  "-"(left, right, options) {
    if (
      validateOperators("number", left) &&
      validateOperators("number", right)
    ) {
      return toFPNodes(left[0].value - right[0].value);
    } else {
      throw invalidOperandError([left[0], right[0]], "-");
    }
  },
  "*"(left, right, options) {
    if (
      validateOperators("number", left) &&
      validateOperators("number", right)
    ) {
      return toFPNodes(left[0].value * right[0].value);
    } else {
      throw invalidOperandError([left[0], right[0]], "*");
    }
  },
  "/"(left, right, options) {
    if (
      validateOperators("number", left) &&
      validateOperators("number", right)
    ) {
      return toFPNodes(left[0].value / right[0].value);
    } else {
      throw invalidOperandError([left[0], right[0]], "/");
    }
  },
  "="(left, right, options): FHIRPathNodeType<boolean>[] {
    // TODO improve Deep Equals speed.
    if (typeof left[0].value === "object") {
      return toFPNodes(
        JSON.stringify(left[0].value) === JSON.stringify(right[0].value)
      );
    }
    return toFPNodes(left[0].value === right[0].value);
  },
};

function evaluateOperation(
  ast: any,
  context: FHIRPathNodeType<unknown>[],
  options: Options
): FHIRPathNodeType<unknown>[] {
  const left = _evaluate(ast.left, context, options);
  const right = _evaluate(ast.right, context, options);

  const operator = fp_operations[ast.operator];
  if (operator) return operator(left, right, options);
  else throw new Error("Unsupported operator: '" + ast.operator + "'");
}

function _evaluate(
  ast: any,
  context: FHIRPathNodeType<unknown>[],
  options: Options
): FHIRPathNodeType<unknown>[] {
  switch (ast.value.type) {
    case "Operation": {
      return evaluateOperation(ast.value, context, options);
    }
    case "Singular": {
      return evaluateSingular(ast.value, context, options);
    }
    default:
      throw new Error("Invalid AST Expression Node '" + ast.value.type + "'");
  }
}

/**
 * Because Primitive types could have undefined on .value do quick check here to confirm existence.
 */
function nonNullable(v: unknown): v is NonNullable<unknown> {
  return v !== undefined && v !== null;
}

export function evaluate(
  expression: string,
  value: unknown,
  options: Options
): NonNullable<unknown>[] {
  const ast = parse(expression);
  const ctx = toFPNodes(value);
  const output = _evaluate(ast, ctx, options)
    .map((v) => v.value)
    .filter(nonNullable);

  return output;
}
