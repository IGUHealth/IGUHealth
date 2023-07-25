import {
  OperationDefinition,
  Parameters,
  StructureDefinition,
} from "@iguhealth/fhir-types";
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

  const params: NonNullable<Parameters["parameter"]> = value.map(
    (value: any): NonNullable<Parameters["parameter"]>[number] => {
      if (definition.type) {
        if (resourceTypes.has(definition.type)) {
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
  const isNested = definition.part !== undefined;

  const parsedParameters = parameters
    .map((param) => {
      if (definition.type || definition.searchType) {
        // Means this is a primitive
        if (resourceTypes.has(definition.type || "")) {
          return param.resource;
        } else {
          if (definition.searchType)
            throw new OperationError(
              outcomeError("not-supported", `SearchType not supported`)
            );
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

function createValidator<ParamType>(
  parameter: ParameterDefinitions
): (input: any) => input is ParamType {
  return (input): input is ParamType => {
    return false;
  };
}

type InputOutput<I, O> = { in: I; out: O };

function isParameters(input: any): input is Parameters {
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
          outcomeError("required", `Missing required parameter ${d.name}`)
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
  resolveType: (type: string) => StructureDefinition,
  paramDefinition: NonNullable<OperationDefinition["parameter"]>[number],
  use: Use,
  value: any
) {
  let arr: Array<any> = (value = Array.isArray(value) ? value : [value]);
  validateCardinalities(paramDefinition, value);

  arr.forEach((_v: unknown, index) => {
    if (paramDefinition.type) {
      const issues = validate(
        resolveType,
        paramDefinition.type,
        arr,
        `/${index}`
      );
      if (issues.length > 0) throw new OperationError(outcome(issues));
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
        validateParameter(resolveType, part, use, value[part.name]);
      });
    }
  });
}

function validateParameters<I, O, Use extends "in" | "out">(
  resolveType: (type: string) => StructureDefinition,
  operationDefinition: OperationDefinition,
  use: Use,
  value: unknown
): value is InputOutput<I, O>[Use] {
  const definitions = (operationDefinition.parameter || []).filter(
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
    validateParameter(resolveType, paramDefinition, use, value[key]);
  });
  return true;
}

export interface Operation<CTX, I, O> {
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
  execute(
    ctx: CTX,
    input: I | Record<string, any> | Parameters
  ): Promise<O | Parameters>;
}

export class OperationExecution<
  CTX extends { resolveType: (type: string) => StructureDefinition },
  I,
  O
> implements Operation<CTX, I, O>
{
  private _operationDefinition: OperationDefinition;
  code: string;
  private _execute: (ctx: CTX, input: I) => O | Parameters;
  constructor(
    operationDefinition: OperationDefinition,
    _execute: (ctx: CTX, input: I) => O | Parameters
  ) {
    this.code = operationDefinition.code;
    this._operationDefinition = operationDefinition;
    this._execute = _execute;
  }
  get operationDefinition(): OperationDefinition {
    return this._operationDefinition;
  }
  parseToObject<Use extends "in" | "out">(
    use: Use,
    input: Parameters
  ): InputOutput<I, O>[Use] {
    const output = parseParameters(this._operationDefinition, use, input);
    return output as InputOutput<I, O>[Use];
  }
  parseToParameters(use: "in" | "out", input: I | O): Parameters {
    return toParametersResource(
      this._operationDefinition,
      use,
      input as Record<string, any>
    );
  }
  async execute(
    ctx: CTX,
    input: Record<string, any> | I | Parameters
  ): Promise<O | Parameters> {
    let parsedInput: Record<string, any> | I | Parameters = input;
    if (isParameters(input)) {
      const parsedInput = parseParameters(
        this._operationDefinition,
        "in",
        input
      );
    }
    if (
      !validateParameters<I, O, "in">(
        ctx.resolveType,
        this._operationDefinition,
        "in",
        parsedInput
      )
    )
      throw new OperationError(outcomeError("invalid", "Invalid input"));

    const output = await this._execute(ctx, parsedInput);

    if (
      !validateParameters<I, O, "out">(
        ctx.resolveType,
        this._operationDefinition,
        "out",
        output
      )
    )
      throw new OperationError(outcomeError("invalid", "Invalid output"));

    if (isParameters(input)) return this.parseToParameters("out", output);
    return output;
  }
}
