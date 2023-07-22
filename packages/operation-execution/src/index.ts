import { OperationDefinition, Parameters } from "@iguhealth/fhir-types";

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

function processParameter(
  definition: ParameterDefinitions[number],
  use: "out" | "in",
  parameters: NonNullable<Parameters["parameter"]>
) {
  const isRequired = definition.min > 1;
  const isArray = definition.max !== "1";
  const isNested = definition.part !== undefined;

  if(isRequired && parameters.length === 0) throw new OperationError()
  definition.type;
}

function toSimplifiedObject(
  operationDefinition: OperationDefinition,
  use: "out" | "in",
  parameters: Parameters
) {
  const paramDefinitions =
    operationDefinition.parameter?.filter((param) => param.use === use) || [];

  for (const paramDefinition of paramDefinitions) {
    const curParameters =
      parameters.parameter?.filter(
        (param) => param.name === paramDefinition.name
      ) || [];

    const isRequired = paramDefinition.min > 1;
    const isArray = paramDefinition.max !== "1";
    const isNested = paramDefinition.part !== undefined;

    paramDefinition.type;
  }
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
      this.validateInput(input);
      const output = execute(input);
      this.validateOutput(output);
      return output;
    },
  };
}
