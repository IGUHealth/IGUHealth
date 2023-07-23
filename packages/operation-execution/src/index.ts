import {
  OperationDefinition,
  Parameters,
  StructureDefinition,
} from "@iguhealth/fhir-types";
import { resourceTypes } from "@iguhealth/fhir-types/r4/sets";
import validate from "@iguhealth/fhir-validation";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

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

interface Operation<CTX, Input, Output> {
  code: string;
  get operationDefinition(): OperationDefinition;
  parseToObject<T extends Input | Output>(use: "in" | "out", input: any): T;
  parseToParameters(use: "in" | "out", input: Input | Output): Parameters;
  execute(ctx: CTX, input: Input): Output;
}

function isParameters(input: any): input is Parameters {
  return input.resourceType === "Parameters";
}

export class OperationExecution<
  CTX extends { resolveType: (type: string) => StructureDefinition },
  Input,
  Output
> implements Operation<CTX, Input, Output>
{
  private _operationDefinition: OperationDefinition;
  code: string;
  constructor(operationDefinition: OperationDefinition) {
    this.code = operationDefinition.code;
    this._operationDefinition = operationDefinition;
  }
  get operationDefinition(): OperationDefinition {
    return this._operationDefinition;
  }
  parseToObject<T extends Input | Output>(
    use: "in" | "out",
    input: Parameters
  ): T {
    const output = parseParameters(this._operationDefinition, use, input);
    return output as T;
  }
  parseToParameters(use: "in" | "out", input: Input | Output): Parameters {
    return toParametersResource(
      this._operationDefinition,
      use,
      input as Record<string, any>
    );
  }
  execute(ctx: CTX, input: Input | Parameters): Output {
    throw new Error();
  }
}
