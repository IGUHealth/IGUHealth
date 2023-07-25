import { OperationDefinition } from "@iguhealth/fhir-types";

function generateParameterType(
  parameters: NonNullable<OperationDefinition["parameter"]>
): string {
  return parameters
    .map((p) => {
      const isArray = p.max !== "1";
      const required = p.min > 0;

      const fieldName = `"${p.name}"${required ? "" : "?"}`;
      const type = p.type === "Any" ? "Resource" : p.type;

      const singularValue = p.type
        ? `fhirTypes.${type}`
        : `{${generateParameterType(p.part || [])}}`;
      const value = isArray ? `Array<${singularValue}>` : singularValue;

      return `${fieldName}: ${value}`;
    })
    .join(",\n");
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function getName(op: OperationDefinition): string {
  if (!op.id) throw new Error("Must have id for generating operation");
  return capitalize(
    op.id
      .split("-")
      .map((s) => capitalize(s))
      .join("")
  );
}

function generateCode(operation: OperationDefinition) {
  const name = getName(operation);

  return `
  function Executor<CTX>(
    executor: CapabilityStatementImplements<CTX>["constructor"]["prototype"]["_execute"]
  ): CapabilityStatementImplements<CTX> {
    return new OperationExecution(
      {
        resourceType: "OperationDefinition",
        code: "blah",
        name: "what",
        system: false,
        type: false,
        instance: false,
        status: "final",
        kind: "resource",
      },
      executor
    );
  }
  `;
}

export function generateOp(op: OperationDefinition): string {
  const namespace = getName(op);
  const interfaceName = "IOp"
  const operationName = "Op"
  const inputName = `Input`;
  const outputName = `Output`;

  const inputType = `export type ${inputName} = {${generateParameterType(
    (op.parameter || []).filter((op) => op.use === "in")
  )}}`;
  const outputType = `export type ${outputName} = {${generateParameterType(
    (op.parameter || []).filter((op) => op.use === "out")
  )}}`;

  const operationType = `export type ${interfaceName} = IOperation<${inputName}, ${outputName}>`
  const operationInstance = `export const ${operationName}: ${interfaceName} = new Operation<${inputName}, ${outputName}>(${JSON.stringify(op)})`

  return `export namespace ${namespace} {
  ${[
    inputType,
    outputType,
    operationType,
    operationInstance,
  ].join("\n")}}`

}

export default async function operationGeneration(
  fhirVersion: string,
  operations: Readonly<Array<OperationDefinition>>
): Promise<string> {
  if (fhirVersion !== "r4") throw new Error("Only support r4");
  const code = [
    `import type * as fhirTypes from "@iguhealth/fhir-types";`,
    `import { Operation, IOperation, Executor } from "@iguhealth/operation-execution";`,
    ...operations.map((op) => generateOp(op)),
  ].join("\n");

  const prettier = await import("prettier");

  return prettier.format(code, { parser: "typescript" });
}
