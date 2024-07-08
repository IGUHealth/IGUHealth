import { Reference, Resource, uri } from "@iguhealth/fhir-types/r4/types";
import * as mv from "@iguhealth/meta-value";

import { parse } from "./parser.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AST = any;

export type Options = {
  variables?: Record<string, unknown> | ((v: string) => unknown);
  meta?: Partial<mv.TypeMeta>;
};

function flatten<T>(arr: T[][]): T[] {
  return arr.reduce((acc, v) => [...acc, ...v], []);
}

async function getVariableValue(
  name: string,
  options?: Options,
): Promise<mv.MetaValue<unknown>[]> {
  let value;
  if (options?.variables instanceof Function) {
    value = options.variables(name);
  } else if (options?.variables instanceof Object) {
    value = options.variables[name];
  }

  return mv.flatten(await mv.metaValue({ type: options?.meta }, value));
}

function assert(assertion: boolean, message?: string) {
  if (!assertion) {
    throw new Error(message || "Assertion failed");
  }
}

// Problem is you can't distinguish an identifier vs typeidentifier so just check to confirm singular and only identifier present.
function expressionToTypeIdentifier(ast: AST) {
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
    ast: AST,
    context: mv.MetaValue<unknown>[],
    options?: Options,
  ) => Promise<mv.MetaValue<unknown>[]>
> = {
  // [EXISTENCE FUNCTIONS]
  // Returns true if the input collection is empty ({ }) and false otherwise.
  async exists(ast, context, options) {
    if (ast.next.length === 1) {
      return mv.flatten(
        await mv.metaValue(
          { type: options?.meta },
          (await _evaluate(ast.next[0], context, options)).length > 0,
        ),
      );
    }
    return mv.flatten(
      await mv.metaValue({ type: options?.meta }, context.length > 0),
    );
  },
  // exists([criteria : expression]) : Boolean
  async empty(ast, context, options) {
    return mv.flatten(
      await mv.metaValue({ type: options?.meta }, context.length === 0),
    );
  },
  async all(ast, context, options) {
    return mv.flatten(
      await mv.metaValue(
        { type: options?.meta },
        flatten(
          await Promise.all(
            context.map((v) => _evaluate(ast.next[0], [v], options)),
          ),
        )
          .map((v) => v.getValue())
          .reduce((acc, v) => acc && v, true),
      ),
    );
  },
  async allTrue(ast, context, options) {
    return mv.flatten(
      await mv.metaValue(
        { type: options?.meta },
        context.reduce((acc, v) => v.getValue() === true && acc, true),
      ),
    );
  },
  async anyTrue(ast, context, options) {
    return mv.flatten(
      await mv.metaValue(
        { type: options?.meta },
        context.reduce((acc, v) => v.getValue() === true || acc, false),
      ),
    );
  },
  async allFalse(ast, context, options) {
    return mv.flatten(
      await mv.metaValue(
        { type: options?.meta },
        context.reduce((acc, v) => v.getValue() === false && acc, true),
      ),
    );
  },
  async anyFalse(ast, context, options) {
    return mv.flatten(
      await mv.metaValue(
        { type: options?.meta },
        context.reduce((acc, v) => v.getValue() === false || acc, false),
      ),
    );
  },
  async subsetOf(ast, context, options) {
    const otherSet = await _evaluate(ast.next[0], context, options);
    return mv.flatten(
      await mv.metaValue(
        { type: options?.meta },
        context.reduce(
          (acc, v1) =>
            acc &&
            otherSet.find((v2) => {
              return equalityCheck([v1], [v2]);
            }) !== undefined,
          true,
        ),
      ),
    );
  },
  // Conceptionally this is the opposite of subsetOf.
  async supersetOf(ast, context, options) {
    const otherSet = await _evaluate(ast.next[0], context, options);
    return mv.flatten(
      await mv.metaValue(
        { type: options?.meta },
        otherSet.reduce(
          (acc, v1) =>
            acc &&
            context.find((v2) => {
              return equalityCheck([v1], [v2]);
            }) !== undefined,
          true,
        ),
      ),
    );
  },
  async count(_ast, context, options) {
    return mv.flatten(
      await mv.metaValue({ type: options?.meta }, context.length),
    );
  },
  async distinct(_ast, context) {
    const map = context
      .map((v: mv.MetaValue<unknown>): [string, mv.MetaValue<unknown>] => [
        JSON.stringify(v.getValue()),
        v,
      ])
      .reduce(
        (
          m: { [key: string]: mv.MetaValue<unknown> },
          [k, v]: [string, mv.MetaValue<unknown>],
        ) => {
          m[k] = v;
          return m;
        },
        {},
      );
    return Object.values(map);
  },
  async isDistinct(ast, context, options) {
    const distinct = await fp_functions.distinct(undefined, context, options);
    return mv.flatten(
      await mv.metaValue(
        { type: options?.meta },
        context.length === distinct.length,
      ),
    );
  },
  // [FILTER FUNCTIONS]
  async where(ast, context, options) {
    const criteria = ast.next[0];
    const result: mv.MetaValue<unknown>[] = [];
    for (const v of context) {
      const evaluation = await _evaluate(criteria, [v], options);
      assert(evaluation.length === 1, "result must be one");
      if (!typeChecking("boolean", evaluation)) {
        throw new Error("Where clause criteria must evaluate to a boolean");
      }
      if (evaluation[0].getValue()) {
        result.push(v);
      }
    }
    return result;
  },
  /**
   * Returns a collection with all immediate child nodes of all items in the input collection.
   * Note that the ordering of the children is undefined and using functions like first() on the result may return different results on different platforms.
   */
  async children(_ast, context) {
    const children = flatten(
      await Promise.all(
        context.map(async (node) => {
          const v = node.getValue();
          const keys = Object.keys(v || {});

          const children = flatten(
            await Promise.all(
              keys.map(async (k) => mv.flatten(await mv.descend(node, k))),
            ),
          );
          return children;
        }),
      ),
    );

    return children;
  },
  /**
   * Returns a collection with all descendant nodes of all items in the input collection.
   */
  async descendants(_ast, context, options) {
    return evaluateWithMeta("repeat(children())", context, options);
  },
  async select(ast, context, options) {
    const selection = ast.next[0];
    return flatten(
      await Promise.all(
        context.map((v) => {
          return _evaluate(selection, [v], options);
        }),
      ),
    );
  },
  async repeat(ast, context, options) {
    const projection = ast.next[0];
    let endResult: mv.MetaValue<unknown>[] = [];
    let cur = context;
    while (cur.length !== 0) {
      cur = await _evaluate(projection, cur, options);
      endResult = [...endResult, ...cur];
    }
    return endResult;
  },
  // Type Functions
  async ofType(ast, context) {
    const parameters = ast.next;
    const typeIdentifier = expressionToTypeIdentifier(parameters[0]);
    return filterByType(typeIdentifier, context);
  },
  async as(ast, context) {
    assert(
      context.length <= 1,
      "as function must have a length of 1 for context.",
    );
    const parameters = ast.next;
    const typeIdentifier = expressionToTypeIdentifier(parameters[0]);
    return filterByType(typeIdentifier, context);
  },
  async resolve(ast, context) {
    // console.warn("not supporting resolve just returning item");
    return context;
  },
};

async function evaluateInvocation(
  ast: AST,
  context: mv.MetaValue<unknown>[],
  options?: Options,
): Promise<mv.MetaValue<unknown>[]> {
  switch (ast.value.type) {
    case "Index":
      throw new Error("Not implemented");
    case "Total":
      throw new Error("Not implemented");
    case "This":
      return context;
    case "Identifier": {
      return (
        await Promise.all(
          context.map(async (v) =>
            mv.flatten(await mv.descend(v, ast.value.value)),
          ),
        )
      ).flat();
    }
    case "Function": {
      const fp_func = fp_functions[ast.value.value.value];
      if (!fp_func)
        throw new Error("Unknown function '" + ast.value.value.value + "'");
      return fp_func(ast.value, context, options);
    }
    default:
      throw new Error("Unknown invocation type: '" + ast.value.type + "'");
  }
}

async function _evaluateTermStart(
  ast: AST,
  context: mv.MetaValue<unknown>[],
  options?: Options,
): Promise<mv.MetaValue<unknown>[]> {
  switch (ast.value.type) {
    case "Invocation": {
      // Special code handling for start with typeidentifier
      if (ast.value.value.type === "Identifier") {
        const typeIdentifier = ast?.value?.value?.value;
        const result = filterByType(typeIdentifier, context);
        if (result.length > 0) return result;
      }
      return evaluateInvocation(ast.value, context, options);
    }
    case "Literal": {
      return mv.flatten(
        await mv.metaValue({ type: options?.meta }, ast.value.value),
      );
    }
    case "Variable": {
      return getVariableValue(ast.value.value.value, options);
    }
    case "Expression": {
      return _evaluate(ast.value, context, options);
    }
    default:
      throw new Error("Unknown term type: '" + ast.value.type + "'");
  }
}

async function evaluateProperty(
  ast: AST,
  context: mv.MetaValue<unknown>[],
  options?: Options,
): Promise<mv.MetaValue<unknown>[]> {
  switch (ast.type) {
    case "Invocation": {
      return evaluateInvocation(ast, context, options);
    }
    case "Indexed": {
      const indexed = await _evaluate(ast.value, context, options);
      if (indexed.length !== 1)
        throw new Error("Indexing requires a single value");
      if (!typeChecking("number", indexed))
        throw new Error("Indexing requires a number");
      const value = context[indexed[0].getValue()];
      return value !== undefined ? [value] : [];
    }
    default:
      throw new Error("Unknown term type: '" + ast.type + "'");
  }
}

async function evaluateSingular(
  ast: AST,
  context: mv.MetaValue<unknown>[],
  options?: Options,
): Promise<mv.MetaValue<unknown>[]> {
  let start = await _evaluateTermStart(ast, context, options);
  if (ast.next) {
    for (const next of ast.next) {
      start = await evaluateProperty(next, start, options);
    }
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

function typeChecking<T extends ValidOperandType>(
  typeChecking: T,
  args: mv.MetaValue<unknown>[],
): args is mv.MetaValue<OperatorType<T>>[] {
  return args.reduce((acc: boolean, v: mv.MetaValue<unknown>) => {
    if (typeof v.getValue() !== typeChecking) return false;
    return acc;
  }, true) as boolean;
}

export class InvalidOperandError extends Error {
  private args: unknown[];
  private operator: string;
  constructor(args: unknown[], operator: string) {
    super(
      `Invalid operands for operator: '${operator}' Found types '${typeof args[0]}' and '${typeof args[1]}'`,
    );
    this.args = args;
    this.operator = operator;
  }
}

type EvaledOperation = (
  left: mv.MetaValue<unknown>[],
  right: mv.MetaValue<unknown>[],
  options?: Options,
) => Promise<mv.MetaValue<unknown>[]>;

function op_prevaled(
  operation_function: EvaledOperation,
): (
  ast: AST,
  context: mv.MetaValue<unknown>[],
  options?: Options,
) => Promise<mv.MetaValue<unknown>[]> {
  return async (ast, context, options) => {
    const left = await _evaluate(ast.left, context, options);
    const right = await _evaluate(ast.right, context, options);

    return operation_function(left, right, options);
  };
}

const equalityCheck = (
  left: mv.MetaValue<unknown>[],
  right: mv.MetaValue<unknown>[],
): boolean => {
  // TODO improve Deep Equals speed.
  if (left.length !== right.length) {
    return false;
  } else if (typeof left[0].getValue() === "object") {
    return (
      JSON.stringify(left[0].getValue()) === JSON.stringify(right[0].getValue())
    );
  }
  return left[0].getValue() === right[0].getValue();
};

function isType(v: mv.MetaValue<unknown>, type: string): boolean {
  if (v.meta()?.type === "Reference" && type !== "Reference") {
    return (v.getValue() as Reference).reference?.split("/")[0] === type;
  }
  if (v.meta()?.type) {
    return v.meta()?.type === type;
  }
  return (v.getValue() as Resource | undefined)?.resourceType === type;
}

function filterByType<T>(type: string, context: mv.MetaValue<T>[]) {
  // Special handling for type 'Resource' and 'DomainResource' abstract types
  if (type === "Resource" || type === "DomainResource") {
    return context.filter(
      (v) => (v.getValue() as Resource).resourceType !== undefined,
    );
  }
  return context.filter((v) => {
    return isType(v, type);
  });
}

const fp_operations: Record<
  string,
  (
    ast: AST,
    context: mv.MetaValue<unknown>[],
    options?: Options,
  ) => Promise<mv.MetaValue<unknown>[]>
> = {
  "+": op_prevaled(async (left, right, options) => {
    if (typeChecking("number", left) && typeChecking("number", right)) {
      return mv.flatten(
        await mv.metaValue(
          { type: options?.meta },
          left[0].getValue() + right[0].getValue(),
        ),
      );
    } else if (typeChecking("string", left) && typeChecking("string", right)) {
      return mv.flatten(
        await mv.metaValue(
          { type: options?.meta },
          left[0].getValue() + right[0].getValue(),
        ),
      );
    } else {
      throw new InvalidOperandError([left[0], right[0]], "+");
    }
  }),
  as: async (ast, context, options) => {
    const left = await _evaluate(ast.left, context, options);
    if (left.length > 1)
      throw new Error(
        "The 'as' operator left hand operand must be equal to length 1",
      );
    const typeIdentifier = expressionToTypeIdentifier(ast.right);
    return filterByType(typeIdentifier, left);
  },
  is: async (ast, context, options) => {
    const left = await _evaluate(ast.left, context, options);
    if (left.length > 1)
      throw new Error(
        "The 'is' operator left hand operand must be equal to length 1",
      );
    const typeIdentifier = expressionToTypeIdentifier(ast.right);
    return (
      await Promise.all(
        context.map(async (c) => {
          return mv.flatten(
            await mv.metaValue(
              { type: { ...options?.meta, type: "boolean" as uri } },
              isType(c, typeIdentifier),
            ),
          );
        }),
      )
    ).flat();
  },
  "-": op_prevaled(async (left, right, options) => {
    if (typeChecking("number", left) && typeChecking("number", right)) {
      return mv.flatten(
        await mv.metaValue(
          { type: options?.meta },
          left[0].getValue() - right[0].getValue(),
        ),
      );
    } else {
      throw new InvalidOperandError([left[0], right[0]], "-");
    }
  }),
  "*": op_prevaled(async (left, right, options) => {
    if (typeChecking("number", left) && typeChecking("number", right)) {
      return mv.flatten(
        await mv.metaValue(
          { type: options?.meta },
          left[0].getValue() * right[0].getValue(),
        ),
      );
    } else {
      throw new InvalidOperandError([left[0], right[0]], "*");
    }
  }),
  "/": op_prevaled(async (left, right, options) => {
    if (typeChecking("number", left) && typeChecking("number", right)) {
      return mv.flatten(
        await mv.metaValue(
          { type: options?.meta },
          left[0].getValue() / right[0].getValue(),
        ),
      );
    } else {
      throw new InvalidOperandError([left[0], right[0]], "/");
    }
  }),
  "|": op_prevaled(async (left, right) => {
    return left.concat(right);
  }),
  and: op_prevaled(async (left, right, options) => {
    if (typeChecking("boolean", left) && typeChecking("boolean", right)) {
      return mv.flatten(
        await mv.metaValue(
          { type: { ...options?.meta, type: "boolean" as uri } },
          left[0].getValue() && right[0].getValue(),
        ),
      );
    }
    throw new InvalidOperandError([left[0], right[0]], "/");
  }),
  "=": op_prevaled(async (left, right, options) =>
    mv.flatten(
      await mv.metaValue({ type: options?.meta }, equalityCheck(left, right)),
    ),
  ),
  "!=": op_prevaled(async (left, right, options) => {
    const equality = equalityCheck(left, right);
    return mv.flatten(
      await mv.metaValue(
        { type: { ...options?.meta, type: "boolean" as uri } },
        equality === false,
      ),
    );
  }),
};

async function evaluateOperation(
  ast: AST,
  context: mv.MetaValue<unknown>[],
  options?: Options,
): Promise<mv.MetaValue<unknown>[]> {
  const operator = fp_operations[ast.operator];
  if (operator) return operator(ast, context, options);
  else throw new Error("Unsupported operator: '" + ast.operator + "'");
}

async function _evaluate(
  ast: AST,
  context: mv.MetaValue<unknown>[],
  options?: Options,
): Promise<mv.MetaValue<unknown>[]> {
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

const cachedAST: Record<string, AST> = {};

export async function evaluateWithMeta(
  expression: string,
  ctx: unknown,
  options?: Options,
): Promise<mv.MetaValue<NonNullable<unknown>>[]> {
  if (!cachedAST[expression]) {
    const ast = parse(expression);
    cachedAST[expression] = ast;
  }
  return (
    await _evaluate(
      cachedAST[expression],
      mv.flatten(await mv.metaValue({ type: options?.meta }, ctx)),
      options,
    )
  ).filter(
    (v: mv.MetaValue<unknown>): v is mv.MetaValue<NonNullable<unknown>> =>
      nonNullable(v.getValue()),
  );
}

export async function evaluate(
  expression: string,
  ctx: unknown,
  options?: Options,
): Promise<NonNullable<unknown>[]> {
  return (await evaluateWithMeta(expression, ctx, options)).map((v) =>
    v.getValue(),
  );
}
