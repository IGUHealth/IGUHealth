import { Reference, Resource } from "@iguhealth/fhir-types/r4/types";
import {
  PartialMeta,
  PartialTypeMeta,
  MetaValueArray,
  MetaValueSingular,
  descend,
  toMetaValueNodes,
} from "@iguhealth/meta-value";
import { parse } from "./parser.js";

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
  const node = toMetaValueNodes(meta ? meta : {}, value, element);
  if (node instanceof MetaValueArray) return node.toArray();
  if (node instanceof MetaValueSingular) return [node];
  return [];
}

export type Options = {
  variables?: Record<string, unknown> | ((v: string) => unknown);
  meta?: PartialTypeMeta;
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

  return toMetaValueSingulars({ type: options?.meta }, value);
}

function assert(assertion: boolean, message?: string) {
  if (!assertion) {
    throw new Error(message || "Assertion failed");
  }
}

// Problem is you can't distinguish an identifier vs typeidentifier so just check to confirm singular and only identifier present.
function expressionToTypeIdentifier(ast: any) {
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
        { type: options?.meta },
        _evaluate(ast.next[0], context, options).length > 0
      );
    }
    return toMetaValueSingulars({ type: options?.meta }, context.length > 0);
  },
  // exists([criteria : expression]) : Boolean
  empty(ast, context, options) {
    return toMetaValueSingulars({ type: options?.meta }, context.length === 0);
  },
  all(ast, context, options) {
    return toMetaValueSingulars(
      { type: options?.meta },
      flatten(context.map((v) => _evaluate(ast.next[0], [v], options)))
        .map((v) => v.valueOf())
        .reduce((acc, v) => acc && v, true)
    );
  },
  allTrue(ast, context, options) {
    return toMetaValueSingulars(
      { type: options?.meta },
      context.reduce((acc, v) => v.valueOf() === true && acc, true)
    );
  },
  anyTrue(ast, context, options) {
    return toMetaValueSingulars(
      { type: options?.meta },
      context.reduce((acc, v) => v.valueOf() === true || acc, false)
    );
  },
  allFalse(ast, context, options) {
    return toMetaValueSingulars(
      { type: options?.meta },
      context.reduce((acc, v) => v.valueOf() === false && acc, true)
    );
  },
  anyFalse(ast, context, options) {
    return toMetaValueSingulars(
      { type: options?.meta },
      context.reduce((acc, v) => v.valueOf() === false || acc, false)
    );
  },
  subsetOf(ast, context, options) {
    const otherSet = _evaluate(ast.next[0], context, options);
    return toMetaValueSingulars(
      { type: options?.meta },
      context.reduce(
        (acc, v1) =>
          acc &&
          otherSet.find((v2) => {
            const result = equalityCheck([v1], [v2], options);
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
      { type: options?.meta },
      otherSet.reduce(
        (acc, v1) =>
          acc &&
          context.find((v2) => {
            const result = equalityCheck([v1], [v2], options);
            return result[0].valueOf();
          }) !== undefined,
        true
      )
    );
  },
  count(ast, context, options) {
    return toMetaValueSingulars({ type: options?.meta }, context.length);
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
      { type: options?.meta },
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
  /**
   * Returns a collection with all immediate child nodes of all items in the input collection.
   * Note that the ordering of the children is undefined and using functions like first() on the result may return different results on different platforms.
   */
  children(ast, context, options) {
    const children = flatten(
      context.map((node) => {
        const v = node.valueOf();
        const keys = Object.keys(v || {});
        return flatten(keys.map((k) => flattenedDescend(node, k)));
      })
    );

    return children;
  },
  /**
   * Returns a collection with all descendant nodes of all items in the input collection.
   */
  descendants(_ast, context, options) {
    return evaluateWithMeta("repeat(children())", context, options);
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
  // Type Functions
  ofType(ast, context, options) {
    const parameters = ast.next;
    const typeIdentifier = expressionToTypeIdentifier(parameters[0]);
    return filterByType(typeIdentifier, context);
  },
  as(ast, context, options) {
    assert(
      context.length <= 1,
      "as function must have a length of 1 for context."
    );
    const parameters = ast.next;
    const typeIdentifier = expressionToTypeIdentifier(parameters[0]);
    return filterByType(typeIdentifier, context);
  },
  resolve(ast, context, options) {
    // console.warn("not supporting resolve just returning item");
    return context;
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
      // Special code handling for start with typeidentifier
      if (ast.value.value.type === "Identifier") {
        const typeIdentifier = ast?.value?.value?.value;
        const result = filterByType(typeIdentifier, context);
        if (result.length > 0) return result;
      }
      return evaluateInvocation(ast.value, context, options);
    case "Literal": {
      return toMetaValueSingulars({ type: options?.meta }, ast.value.value);
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

type EvaledOperation = (
  left: MetaValueSingular<unknown>[],
  right: MetaValueSingular<unknown>[],
  options?: Options
) => MetaValueSingular<unknown>[];

function op_prevaled(
  operation_function: EvaledOperation
): (
  ast: any,
  context: MetaValueSingular<unknown>[],
  options?: Options
) => MetaValueSingular<unknown>[] {
  return (ast, context, options) => {
    const left = _evaluate(ast.left, context, options);
    const right = _evaluate(ast.right, context, options);

    return operation_function(left, right, options);
  };
}

const equalityCheck: EvaledOperation = (
  left,
  right,
  options
): MetaValueSingular<boolean>[] => {
  // TODO improve Deep Equals speed.
  if (left.length !== right.length)
    return toMetaValueSingulars({ type: options?.meta }, false);
  if (typeof left[0].valueOf() === "object") {
    return toMetaValueSingulars(
      { type: options?.meta },
      JSON.stringify(left[0].valueOf()) === JSON.stringify(right[0].valueOf())
    );
  }
  return toMetaValueSingulars(
    { type: { ...options?.meta, type: "boolean" } },
    left[0].valueOf() === right[0].valueOf()
  );
};

function isType(v: MetaValueSingular<unknown>, type: string): boolean {
  if (v.meta()?.type === "Reference" && type !== "Reference") {
    return (v.valueOf() as Reference).reference?.split("/")[0] === type;
  }
  if (v.meta()?.type) {
    return v.meta()?.type === type;
  }
  return (v.valueOf() as Resource | undefined)?.resourceType === type;
}

function filterByType<T>(type: string, context: MetaValueSingular<T>[]) {
  // Special handling for type 'Resource' and 'DomainResource' abstract types
  if (type === "Resource" || type === "DomainResource") {
    return context.filter(
      (v) => (v.valueOf() as Resource).resourceType !== undefined
    );
  }
  return context.filter((v) => {
    return isType(v, type);
  });
}

const fp_operations: Record<
  string,
  (
    ast: any,
    context: MetaValueSingular<unknown>[],
    options?: Options
  ) => MetaValueSingular<unknown>[]
> = {
  "+": op_prevaled((left, right, options) => {
    if (typeChecking("number", left) && typeChecking("number", right)) {
      return toMetaValueSingulars(
        { type: options?.meta },
        left[0].valueOf() + right[0].valueOf()
      );
    } else if (typeChecking("string", left) && typeChecking("string", right)) {
      return toMetaValueSingulars(
        { type: options?.meta },
        left[0].valueOf() + right[0].valueOf()
      );
    } else {
      throw invalidOperandError([left[0], right[0]], "+");
    }
  }),
  as: (ast, context, options) => {
    const left = _evaluate(ast.left, context, options);
    if (left.length > 1)
      throw new Error(
        "The 'as' operator left hand operand must be equal to length 1"
      );
    const typeIdentifier = expressionToTypeIdentifier(ast.right);
    return filterByType(typeIdentifier, left);
  },
  is: (ast, context, options) => {
    const left = _evaluate(ast.left, context, options);
    if (left.length > 1)
      throw new Error(
        "The 'is' operator left hand operand must be equal to length 1"
      );
    const typeIdentifier = expressionToTypeIdentifier(ast.right);
    return context.map((c) => {
      return new MetaValueSingular(
        { type: { ...options?.meta, type: "boolean" } },
        isType(c, typeIdentifier)
      );
    });
  },
  "-": op_prevaled((left, right, options) => {
    if (typeChecking("number", left) && typeChecking("number", right)) {
      return toMetaValueSingulars(
        { type: options?.meta },
        left[0].valueOf() - right[0].valueOf()
      );
    } else {
      throw invalidOperandError([left[0], right[0]], "-");
    }
  }),
  "*": op_prevaled((left, right, options) => {
    if (typeChecking("number", left) && typeChecking("number", right)) {
      return toMetaValueSingulars(
        { type: options?.meta },
        left[0].valueOf() * right[0].valueOf()
      );
    } else {
      throw invalidOperandError([left[0], right[0]], "*");
    }
  }),
  "/": op_prevaled((left, right, options) => {
    if (typeChecking("number", left) && typeChecking("number", right)) {
      return toMetaValueSingulars(
        { type: options?.meta },
        left[0].valueOf() / right[0].valueOf()
      );
    } else {
      throw invalidOperandError([left[0], right[0]], "/");
    }
  }),
  "|": op_prevaled((left, right, options) => {
    return left.concat(right);
  }),
  and: op_prevaled((left, right, options) => {
    if (typeChecking("boolean", left) && typeChecking("boolean", right)) {
      return toMetaValueSingulars(
        { type: { ...options?.meta, type: "boolean" } },
        left[0].valueOf() && right[0].valueOf()
      );
    }
    throw invalidOperandError([left[0], right[0]], "/");
  }),
  "=": op_prevaled(equalityCheck),
  "!=": op_prevaled((left, right, options) => {
    const equality = equalityCheck(left, right, options);
    equality[0].valueOf() === false;
    return toMetaValueSingulars(
      { type: { ...options?.meta, type: "boolean" } },
      equality[0].valueOf() === false
    );
  }),
};

function evaluateOperation(
  ast: any,
  context: MetaValueSingular<unknown>[],
  options?: Options
): MetaValueSingular<unknown>[] {
  const operator = fp_operations[ast.operator];
  if (operator) return operator(ast, context, options);
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

const cachedAST: Record<string, any> = {};

export function evaluateWithMeta(
  expression: string,
  ctx: unknown,
  options?: Options
): MetaValueSingular<NonNullable<unknown>>[] {
  if (!cachedAST[expression]) {
    const ast = parse(expression);
    cachedAST[expression] = ast;
  }
  return _evaluate(
    cachedAST[expression],
    toMetaValueSingulars({ type: options?.meta }, ctx),
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
