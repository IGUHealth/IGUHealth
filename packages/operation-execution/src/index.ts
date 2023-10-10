import {
  OperationDefinition,
  Parameters,
  Resource,
  StructureDefinition,
} from "@iguhealth/fhir-types/r4/types";
import { resourceTypes } from "@iguhealth/fhir-types/r4/sets";
import validate from "@iguhealth/fhir-validation";
import {
  OperationError,
  outcome,
  outcomeError,
} from "@iguhealth/operation-outcomes";

type ParameterDefinitions = NonNullable<OperationDefinition["parameter"]>;

function capitalize(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function mapToParameter(
  definition: NonNullable<ParameterDefinitions[number]>,
  use: "out" | "in",
  valueMap: any
): NonNullable<Parameters["parameter"]> {
  const isArray = definition.max !== "1";
  let value = valueMap[definition.name];
  if (!value) return [];

  if (!isArray) value = [value];
  if (isArray && !Array.isArray(value)) value = [value];

  const params: NonNullable<Parameters["parameter"]> = value.map(
    (value: any): NonNullable<Parameters["parameter"]>[number] => {
      if (definition.type) {
        if (definition.type === "Type")
          throw new Error("Cannot process 'Type'");
        if (definition.type === "Any" || resourceTypes.has(definition.type)) {
          return { name: definition.name, resource: value };
        }
        const fieldName = `value${capitalize(definition.type || "")}`;
        return {
          name: definition.name,
          [fieldName]: value,
        };
      } else {
        if (!definition.part)
          throw new OperationError(
            outcomeError(
              "invalid",
              `No type or part found on parameter definition ${definition.name}`
            )
          );
      }

      return {
        name: definition.name,
        part: definition.part
          .map((partDefinition) => {
            return mapToParameter(partDefinition, use, value);
          })
          .flat(),
      };
    }
  );

  return params;
}

export function toParametersResource(
  operationDefinition: OperationDefinition,
  use: "out" | "in",
  value: Record<string, any>
): Parameters {
  const definitions =
    operationDefinition.parameter?.filter((param) => param.use === use) || [];
  const parameters: Parameters = {
    resourceType: "Parameters",
    parameter: definitions
      .map((definition) => mapToParameter(definition, use, value))
      .flat(),
  };

  return parameters;
}

function validateNoExtraFields(
  definitions: ParameterDefinitions,
  use: "out" | "in",
  parameters: NonNullable<Parameters["parameter"]>
) {
  const definitionNames = new Set(
    definitions
      .filter((d) => d.use === use)
      .map((definition) => definition.name)
  );
  const paramNames = new Set(parameters.map((param) => param.name));
  paramNames.forEach((paramName) => {
    if (!definitionNames.has(paramName)) {
      throw new OperationError(
        outcomeError("invalid", `Parameter ${paramName} not supported`)
      );
    }
  });
}

function parseParameter(
  definition: ParameterDefinitions[number],
  use: "out" | "in",
  parameters: NonNullable<Parameters["parameter"]>
) {
  const isRequired = definition.min > 1;
  const isArray = definition.max !== "1";

  const parsedParameters = parameters
    .map((param) => {
      if (definition.type || definition.searchType) {
        // Means this is a primitive
        if (
          (definition.type === "Any", resourceTypes.has(definition.type || ""))
        ) {
          return param.resource;
        } else {
          if (definition.searchType)
            throw new OperationError(
              outcomeError("not-supported", `SearchType not supported`)
            );
          if (definition.type === "Type")
            throw new Error("Cannot process 'Type'");
          // @ts-ignore
          return param[`value${capitalize(definition.type || "")}`];
        }
        // Means this is a primitive
      } else {
        if (!definition.part)
          throw new OperationError(
            outcomeError(
              "invalid",
              `No type or part found on parameter definition ${definition.name}`
            )
          );
        validateNoExtraFields(definition.part, use, param.part || []);
        return (definition.part || []).reduce(
          (acc: Record<string, any>, paramDefinition) => {
            const parsedParam = parseParameter(
              paramDefinition,
              use,
              (param.part || []).filter(
                (param) => param.name === paramDefinition.name
              )
            );
            if (parsedParam !== undefined)
              acc[paramDefinition.name] = parsedParam;
            return acc;
          },
          {}
        );
      }
    })
    .filter((v) => v !== undefined);

  if (isRequired && parsedParameters.length === 0)
    throw new OperationError(
      outcomeError("required", `Missing required parameter ${definition.name}`)
    );
  if (
    definition.max !== "*" &&
    parsedParameters.length > parseInt(definition.max)
  ) {
    throw new OperationError(
      outcomeError("too-many", `Too many parameters ${definition.name}`)
    );
  }

  if (!isArray) {
    return parsedParameters[0];
  }
  return parsedParameters.length > 0 ? parsedParameters : undefined;
}

export function parseParameters(
  operationDefinition: OperationDefinition,
  use: "out" | "in",
  parameters: Parameters
) {
  const paramDefinitions =
    operationDefinition.parameter?.filter((param) => param.use === use) || [];
  validateNoExtraFields(paramDefinitions, use, parameters.parameter || []);
  const parametersParsed: Record<string, any> = paramDefinitions.reduce(
    (parametersParsed: Record<string, any>, parameterDefinition) => {
      const curParameters =
        parameters.parameter?.filter(
          (param) => param.name === parameterDefinition.name
        ) || [];
      const parsedParam = parseParameter(
        parameterDefinition,
        use,
        curParameters
      );
      if (parsedParam !== undefined) {
        parametersParsed[parameterDefinition.name] = parsedParam;
      }
      return parametersParsed;
    },
    {}
  );

  return parametersParsed;
}

type InputOutput<I, O> = { in: I; out: O };

export function isParameters(input: any): input is Parameters {
  return input.resourceType === "Parameters";
}

function isRecord(input: any): input is Record<string, any> {
  return typeof input === "object" && input !== null;
}

function validateRequired(
  definitions: NonNullable<OperationDefinition["parameter"]>,
  value: Record<string, any>
) {
  definitions
    .filter((d) => d.min > 0)
    .forEach((d) => {
      if (!(d.name in value))
        throw new OperationError(
          outcomeError("required", `Missing required parameter '${d.name}'`)
        );
    });
}

function validateCardinalities(
  definition: NonNullable<OperationDefinition["parameter"]>[number],
  value: unknown[]
) {
  if (definition.min > value.length)
    throw new OperationError(
      outcomeError(
        "required",
        `Must have '${definition.min}' minimum for field ${definition.min}`
      )
    );
  if (definition.max !== "*" && value.length > parseInt(definition.max)) {
    throw new OperationError(
      outcomeError("too-many", `Too many parameters ${definition.name}`)
    );
  }
}

function validateParameter<Use extends "in" | "out">(
  paramDefinition: NonNullable<OperationDefinition["parameter"]>[number],
  use: Use,
  value: any,
  resolveType?: (type: string) => StructureDefinition
) {
  let arr: Array<any> = (value = Array.isArray(value) ? value : [value]);
  validateCardinalities(paramDefinition, value);

  arr.forEach((_v: unknown, index) => {
    if (paramDefinition.type) {
      const type =
        paramDefinition.type === "Any" ||
        paramDefinition.type === "Resource" ||
        paramDefinition.type === "DomainResource"
          ? arr[index].resourceType
          : paramDefinition.type;
      if (resolveType) {
        const issues = validate(resolveType, type, arr, `/${index}`);
        if (issues.length > 0) throw new OperationError(outcome(issues));
      }
    } else {
      if (!paramDefinition.part)
        throw new OperationError(
          outcomeError(
            "invalid",
            `Invalid definition '${paramDefinition.name}' must have either part or type`
          )
        );
      validateRequired(paramDefinition.part, value);
      paramDefinition.part.forEach((part) => {
        if (!isRecord(value)) {
          throw new OperationError(
            outcomeError(
              "invalid",
              `Parameter ${part.name} must be an object found: '${value}'`
            )
          );
        }
        validateParameter(part, use, value[part.name], resolveType);
      });
    }
  });
}

function validateParameters<
  T extends IOperation<any, any>,
  Use extends "in" | "out"
>(
  op: T,
  use: Use,
  value: unknown,
  resolveType?: (type: string) => StructureDefinition
): value is Use extends "in"
  ? OPMetadata<T>["Input"]
  : OPMetadata<T>["Output"] {
  const definitions = (op.operationDefinition.parameter || []).filter(
    (p) => p.use === use
  );
  if (!isRecord(value))
    throw new OperationError(
      outcomeError("invalid", "Invalid input, input must be a Record")
    );

  validateRequired(definitions, value);
  Object.keys(value).forEach((key: string) => {
    const paramDefinition = definitions.find((d) => d.name === key);
    if (paramDefinition === undefined)
      throw new OperationError(
        outcomeError("invalid", `Invalid parameter ${key}`)
      );
    validateParameter(paramDefinition, use, value[key], resolveType);
  });
  return true;
}

export type OpCTX = {
  resolveType?: (type: string) => StructureDefinition;
  level: "system" | "type" | "instance";
};

export interface IOperation<I, O> {
  code: string;
  get operationDefinition(): OperationDefinition;
  parseToObject<Use extends "in" | "out">(
    use: Use,
    input: any
  ): InputOutput<I, O>[Use];
  parseToParameters<Use extends "in" | "out">(
    use: Use,
    input: InputOutput<I, O>[Use]
  ): Parameters;
  validate<Use extends "in" | "out">(
    ctx: OpCTX,
    use: Use,
    value: unknown
  ): value is InputOutput<I, O>[Use];
}

function isStrictlyReturn(op: OperationDefinition): boolean {
  const outputParameters = op.parameter?.filter((p) => p.use === "out") || [];
  if (outputParameters.length === 1) {
    return (
      outputParameters[0].name === "return" &&
      outputParameters[0].max === "1" &&
      outputParameters[0].min === 1 &&
      (outputParameters[0].type === "Any" ||
        resourceTypes.has(outputParameters[0].type || ""))
    );
  }
  return false;
}

function isResource(value: unknown): value is Resource {
  if (typeof value === "object")
    return (value as Resource).resourceType !== undefined;
  return false;
}

export type Executor<CTX, I, O> = (ctx: CTX, input: I) => Promise<O>;

export type OPMetadata<O> = O extends IOperation<infer Input, infer Output>
  ? { Input: Input; Output: Output }
  : never;

export class Operation<I, O> implements IOperation<I, O> {
  private _operationDefinition: OperationDefinition;
  code: string;
  constructor(operationDefinition: OperationDefinition) {
    this.code = operationDefinition.code;
    this._operationDefinition = operationDefinition;
  }
  get operationDefinition(): OperationDefinition {
    return this._operationDefinition;
  }
  parseToObject<Use extends "in" | "out">(
    use: Use,
    input: Parameters | Resource
  ): InputOutput<I, O>[Use] {
    if (
      use === "out" &&
      !isParameters(input) &&
      isStrictlyReturn(this.operationDefinition)
    ) {
      return input as InputOutput<I, O>[Use];
    }
    if (!isParameters(input)) {
      throw new OperationError(
        outcomeError("invalid", "Invalid input, input must be a Parameters")
      );
    }
    const output = parseParameters(this._operationDefinition, use, input);
    return output as InputOutput<I, O>[Use];
  }

  parseToParameters(use: "in" | "out", input: I | O): Parameters {
    if (
      use === "out" &&
      !isParameters(input) &&
      isStrictlyReturn(this.operationDefinition)
    ) {
      return toParametersResource(this._operationDefinition, use, {
        return: input,
      });
    }

    return toParametersResource(
      this._operationDefinition,
      use,
      input as Record<string, any>
    );
  }
  validate<Use extends "in" | "out">(
    ctx: OpCTX,
    use: Use,
    value: unknown
  ): value is InputOutput<I, O>[Use] {
    if (isStrictlyReturn(this.operationDefinition) && use === "out") {
      const type =
        this.operationDefinition.parameter?.find((p) => p.use === "out")
          ?.type || "Resource";
      const fhirtype = type === "Any" ? "Resource" : type;
      if (ctx.resolveType) {
        const issues = validate(ctx.resolveType, fhirtype, value);
        if (issues.length > 0) return false;
        return true;
      }

      return isResource(value)
        ? fhirtype === "Resource"
          ? value?.resourceType !== undefined
          : value?.resourceType === fhirtype
        : false;
    }
    return validateParameters(this, use, value, ctx.resolveType);
  }
}

export type Invocation = <T extends IOperation<any, any>, CTX extends OpCTX>(
  op: T,
  ctx: CTX,
  input: OPMetadata<T>["Input"]
) => Promise<OPMetadata<T>["Output"]>;
