import { OperationDefinition, Parameters } from "@iguhealth/fhir-types";
import { resourceTypes } from "@iguhealth/fhir-types/r4/sets";
import validate from "@iguhealth/fhir-validation";
import { OperationError, outcomeError } from "@iguhealth/operation-outcomes";

type ParameterDefinitions = NonNullable<OperationDefinition["parameter"]>;

export function toParametersResource(
  operationDefinition: OperationDefinition,
  use: "out" | "in",
  parameters: Object
) {
  return {
    resourceType: "Parameters",
    parameter: parameters,
  };
}

function parseParameter(
  definition: ParameterDefinitions[number],
  use: "out" | "in",
  parameters: NonNullable<Parameters["parameter"]>
) {
  const isRequired = definition.min > 1;
  const isArray = definition.max !== "1";
  const isNested = definition.part !== undefined;

  function capitalize(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

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
        return (definition.part || []).reduce(
          (acc: Record<string, any>, paramDefinition) => {
            acc[paramDefinition.name] = parseParameter(
              paramDefinition,
              use,
              (param.part || []).filter(
                (param) => param.name === paramDefinition.name
              )
            );
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

  const parametersParsed: Record<string, any> = {};
  return paramDefinitions.reduce(
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
}

function createValidator<ParamType>(
  parameter: ParameterDefinitions
): (input: any) => input is ParamType {
  return (input): input is ParamType => {
    return false;
  };
}

type Operation<CTX, Input, Output> = {
  code: string;
  operationDefinition(): OperationDefinition;
  validateInput(input: any): input is Input;
  validateOutput(output: any): output is Output;
  execute(ctx: CTX, input: Input): Output;
};

function createOperationExecutable<CTX, Input, Output>(
  operation: OperationDefinition,
  execute: (input: Input | Parameters) => Output
): Operation<CTX, Input, Output> {
  const inputDefinitions =
    operation.parameter?.filter((param) => param.use === "in") || [];
  const outputDefinitions =
    operation.parameter?.filter((param) => param.use === "out") || [];

  return {
    code: operation.code,
    operationDefinition: () => operation,
    validateInput: createValidator<Input>(inputDefinitions),
    validateOutput: createValidator<Output>(outputDefinitions),
    execute: (ctx: CTX, input: Input) => {
      // this.validateInput(input);
      const output = execute(input);
      // this.validateOutput(output);
      return output;
    },
  };
}
