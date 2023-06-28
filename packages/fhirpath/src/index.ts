// import validator from "@genfhi/fhir-json-schema";
import { parse } from "./parser";
import { primitiveTypes, complexTypes } from "@genfhi/fhir-types/r4/sets";
import { isObject } from "./node";
import {
  PartialMeta,
  MetaValueArray,
  MetaValueSingular,
  descend,
  toMetaValueNodes,
} from "@genfhi/meta-value";

function flattenedDescend<T>(
  node: MetaValueSingular<T>,
  field: string
): MetaValueSingular<unknown>[] {
  const v = descend(node, field);
  if (v instanceof MetaValueArray) return v.toArray();
  if (v instanceof MetaValueSingular) return [v];
  return [];
}

function toMetaValueSingulars<T>(
  meta: PartialMeta | undefined,
  value: T | T[],
  element?: Element | Element[]
): MetaValueSingular<T>[] {
  const node = toMetaValueNodes(meta, value, element);
  if (node instanceof MetaValueArray) return node.toArray();
  if (node instanceof MetaValueSingular) return [node];
  return [];
}

type Options = {
  variables?: Record<string, unknown> | ((v: string) => unknown);
  meta?: PartialMeta;
};

function flatten<T>(arr: T[][]): T[] {
  return arr.reduce((acc, v) => [...acc, ...v], []);
}

function getVariableValue(
  name: string,
  options?: Options
): MetaValueSingular<unknown>[] {
  let value;
  if (options?.variables instanceof Function) {
    value = options.variables(name);
  } else if (options?.variables instanceof Object) {
    value = options.variables[name];
  }

  return toMetaValueSingulars(options?.meta, value);
}

function assert(assertion: boolean, message?: string) {
  if (!assertion) {
    throw new Error(message || "Assertion failed");
  }
}

// Problem is you can't distinguish an identifier vs typeidentifier so just check to confirm singular and only identifier present.
function getTypeIdentifier(ast: any) {
  if (ast.type !== "Expression") return;
  if (ast.value?.type !== "Singular") return;
  if (ast.value?.next !== undefined) return;
  if (ast.value?.value?.type !== "Invocation") return;
  if (ast.value?.value?.value?.type !== "Identifier") return;
  return ast.value.value.value.value;
}

const fp_functions: Record<
  string,
  (
    ast: any,
    context: MetaValueSingular<unknown>[],
    options?: Options
  ) => MetaValueSingular<unknown>[]
> = {
  // [EXISTENCE FUNCTIONS]
  // Returns true if the input collection is empty ({ }) and false otherwise.
  exists: function (ast, context, options) {
    if (ast.next.length === 1) {
      return toMetaValueSingulars(
        options?.meta,
        _evaluate(ast.next[0], context, options).length > 0
      );
    }
    return toMetaValueSingulars(options?.meta, context.length > 0);
  },
  // exists([criteria : expression]) : Boolean
  empty(ast, context, options) {
    return toMetaValueSingulars(options?.meta, context.length === 0);
  },
  all(ast, context, options) {
    return toMetaValueSingulars(
      options?.meta,
      flatten(context.map((v) => _evaluate(ast.next[0], [v], options)))
        .map((v) => v.valueOf())
        .reduce((acc, v) => acc && v, true)
    );
  },
  allTrue(ast, context, options) {
    return toMetaValueSingulars(
      options?.meta,
      context.reduce((acc, v) => v.valueOf() === true && acc, true)
    );
  },
  anyTrue(ast, context, options) {
    return toMetaValueSingulars(
      options?.meta,
      context.reduce((acc, v) => v.valueOf() === true || acc, false)
    );
  },
  allFalse(ast, context, options) {
    return toMetaValueSingulars(
      options?.meta,
      context.reduce((acc, v) => v.valueOf() === false && acc, true)
    );
  },
  anyFalse(ast, context, options) {
    return toMetaValueSingulars(
      options?.meta,
      context.reduce((acc, v) => v.valueOf() === false || acc, false)
    );
  },
  subsetOf(ast, context, options) {
    const otherSet = _evaluate(ast.next[0], context, options);
    return toMetaValueSingulars(
      options?.meta,
      context.reduce(
        (acc, v1) =>
          acc &&
          otherSet.find((v2) => {
            const result = fp_operations["="]([v1], [v2], options);
            return result[0].valueOf();
          }) !== undefined,
        true
      )
    );
  },
  // Conceptionally this is the opposite of subsetOf.
  supersetOf(ast, context, options) {
    const otherSet = _evaluate(ast.next[0], context, options);
    return toMetaValueSingulars(
      options?.meta,
      otherSet.reduce(
        (acc, v1) =>
          acc &&
          context.find((v2) => {
            const result = fp_operations["="]([v1], [v2], options);
            return result[0].valueOf();
          }) !== undefined,
        true
      )
    );
  },
  count(ast, context, options) {
    return toMetaValueSingulars(options?.meta, context.length);
  },
  distinct(ast, context, options) {
    const map = context
      .map(
        (
          v: MetaValueSingular<unknown>
        ): [string, MetaValueSingular<unknown>] => [
          JSON.stringify(v.valueOf()),
          v,
        ]
      )
      .reduce(
        (
          m: { [key: string]: MetaValueSingular<unknown> },
          [k, v]: [string, MetaValueSingular<unknown>]
        ) => {
          m[k] = v;
          return m;
        },
        {}
      );
    return Object.values(map);
  },
  isDistinct(ast, context, options) {
    const distinct = fp_functions.distinct(undefined, context, options);
    return toMetaValueSingulars(
      options?.meta,
      context.length === distinct.length
    );
  },
  // [FILTER FUNCTIONS]
  where(ast, context, options) {
    const criteria = ast.next[0];
    return context.filter((v) => {
      const result = _evaluate(criteria, [v], options);
      assert(result.length === 1, "result must be one");
      if (typeChecking("boolean", result)) return result[0].valueOf();
      throw new Error("Where clause criteria must evaluate to a boolean");
    });
  },
  select(ast, context, options) {
    const selection = ast.next[0];
    return flatten(
      context.map((v) => {
        return _evaluate(selection, [v], options);
      })
    );
  },
  repeat(ast, context, options) {
    const projection = ast.next[0];
    let endResult: MetaValueSingular<unknown>[] = [];
    let cur = context;
    while (cur.length !== 0) {
      cur = _evaluate(projection, cur, options);
      endResult = [...endResult, ...cur];
    }
    return endResult;
  },
  ofType(ast, context, options) {
    const parameters = ast.next;
    const typeIdentifier = getTypeIdentifier(parameters[0]);

    if (
      primitiveTypes.has(typeIdentifier) ||
      complexTypes.has(typeIdentifier)
    ) {
      throw new Error(
        "Of Type not implemented for complex or primitive types yet"
      );
    }
    return context.filter((v) => {
      if (isObject(v.valueOf())) {
        return (v.valueOf() as any)?.resourceType === typeIdentifier;
      }
      return false;
    });
  },
};

function evaluateInvocation(
  ast: any,
  context: MetaValueSingular<unknown>[],
  options?: Options
): MetaValueSingular<unknown>[] {
  switch (ast.value.type) {
    case "Index":
      throw new Error("Not implemented");
    case "Total":
      throw new Error("Not implemented");
    case "This":
      return context;
    case "Identifier":
      return flatten(context.map((v) => flattenedDescend(v, ast.value.value)));
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
  context: MetaValueSingular<unknown>[],
  options?: Options
): MetaValueSingular<unknown>[] {
  switch (ast.value.type) {
    case "Invocation":
      return evaluateInvocation(ast.value, context, options);
    case "Literal": {
      return toMetaValueSingulars(options?.meta, ast.value.value);
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
  context: MetaValueSingular<unknown>[],
  options?: Options
): MetaValueSingular<unknown>[] {
  switch (ast.type) {
    case "Invocation":
      return evaluateInvocation(ast, context, options);
    case "Indexed":
      let indexed = _evaluate(ast.value, context, options);
      if (indexed.length !== 1)
        throw new Error("Indexing requires a single value");
      if (!typeChecking("number", indexed))
        throw new Error("Indexing requires a number");
      return [context[indexed[0].valueOf()]];
    default:
      throw new Error("Unknown term type: '" + ast.type + "'");
  }
}

function evaluateSingular(
  ast: any,
  context: MetaValueSingular<unknown>[],
  options?: Options
): MetaValueSingular<unknown>[] {
  const start = _evaluateTermStart(ast, context, options);
  if (ast.next) {
    return ast.next.reduce(
      (context: MetaValueSingular<unknown>[], next: any) => {
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
  : op_type extends "boolean"
  ? boolean
  : unknown;

type ValidOperandType = "number" | "string" | "boolean";

function typeChecking<T extends ValidOperandType, U>(
  typeChecking: T,
  args: MetaValueSingular<unknown>[]
): args is MetaValueSingular<OperatorType<T>>[] {
  return args.reduce((acc: boolean, v: MetaValueSingular<unknown>) => {
    if (typeof v.valueOf() !== typeChecking) return false;
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
    left: MetaValueSingular<unknown>[],
    right: MetaValueSingular<unknown>[],
    options?: Options
  ) => MetaValueSingular<unknown>[]
> = {
  "+"(left, right, options) {
    if (typeChecking("number", left) && typeChecking("number", right)) {
      return toMetaValueSingulars(
        options?.meta,
        left[0].valueOf() + right[0].valueOf()
      );
    } else if (typeChecking("string", left) && typeChecking("string", right)) {
      return toMetaValueSingulars(
        options?.meta,
        left[0].valueOf() + right[0].valueOf()
      );
    } else {
      throw invalidOperandError([left[0], right[0]], "+");
    }
  },
  "-"(left, right, options) {
    if (typeChecking("number", left) && typeChecking("number", right)) {
      return toMetaValueSingulars(
        options?.meta,
        left[0].valueOf() - right[0].valueOf()
      );
    } else {
      throw invalidOperandError([left[0], right[0]], "-");
    }
  },
  "*"(left, right, options) {
    if (typeChecking("number", left) && typeChecking("number", right)) {
      return toMetaValueSingulars(
        options?.meta,
        left[0].valueOf() * right[0].valueOf()
      );
    } else {
      throw invalidOperandError([left[0], right[0]], "*");
    }
  },
  "/"(left, right, options) {
    if (typeChecking("number", left) && typeChecking("number", right)) {
      return toMetaValueSingulars(
        options?.meta,
        left[0].valueOf() / right[0].valueOf()
      );
    } else {
      throw invalidOperandError([left[0], right[0]], "/");
    }
  },
  "="(left, right, options): MetaValueSingular<boolean>[] {
    // TODO improve Deep Equals speed.
    if (typeof left[0].valueOf() === "object") {
      return toMetaValueSingulars(
        options?.meta,
        JSON.stringify(left[0].valueOf()) === JSON.stringify(right[0].valueOf())
      );
    }
    return toMetaValueSingulars(
      options?.meta,
      left[0].valueOf() === right[0].valueOf()
    );
  },
};

function evaluateOperation(
  ast: any,
  context: MetaValueSingular<unknown>[],
  options?: Options
): MetaValueSingular<unknown>[] {
  const left = _evaluate(ast.left, context, options);
  const right = _evaluate(ast.right, context, options);

  const operator = fp_operations[ast.operator];
  if (operator) return operator(left, right, options);
  else throw new Error("Unsupported operator: '" + ast.operator + "'");
}

function _evaluate(
  ast: any,
  context: MetaValueSingular<unknown>[],
  options?: Options
): MetaValueSingular<unknown>[] {
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

export function evaluateWithMeta(
  expression: string,
  ctx: unknown,
  options?: Options
): MetaValueSingular<NonNullable<unknown>>[] {
  const ast = parse(expression);
  return _evaluate(
    ast,
    toMetaValueSingulars(options?.meta, ctx),
    options
  ).filter(
    (
      v: MetaValueSingular<unknown>
    ): v is MetaValueSingular<NonNullable<unknown>> => nonNullable(v.valueOf())
  );
}

export function evaluate(
  expression: string,
  ctx: unknown,
  options?: Options
): NonNullable<unknown>[] {
  return evaluateWithMeta(expression, ctx, options).map((v) => v.valueOf());
}
