import { OperationDefinition } from "@iguhealth/fhir-types";

function generateParameterType(
  parameters: NonNullable<OperationDefinition["parameter"]>
): string {
  return parameters
    .map((p) => {
      if (p.type) {
        if (p.type === "Type") throw new Error("Cannot process 'Type'");
        // Handle special Any type which correlates to any resource.
        console.log(p.type);
        const type = p.type === "Any" ? "Resource" : p.type;
        return `"${p.name}": fhirTypes.${type}`;
      } else {
        if (!p.part) throw new Error("parameter has no type or part");
        return `"${p.name}": {${generateParameterType(p.part)}}`;
      }
    })
    .join(",\n");
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function generateOp(op: OperationDefinition): string {
  if (!op.id) throw new Error("Must have id for generating operation");
  const interfaceName = capitalize(
    op.id
      .split("-")
      .map((s) => capitalize(s))
      .join("")
  );
  const inputName = `${interfaceName}Input`;
  const outputName = `${interfaceName}Output`;

  const inputType = `type ${inputName} = {${generateParameterType(
    (op.parameter || []).filter((op) => op.use === "in")
  )}}`;
  const outputType = `type ${outputName} = {${generateParameterType(
    (op.parameter || []).filter((op) => op.use === "out")
  )}}`;

  return [
    inputType,
    outputType,
    `type ${interfaceName}<CTX> = Operation<CTX, ${inputName}, ${outputName}>`,
  ].join("\n");
}

export default function operationGeneration(
  fhirVersion: string,
  operations: Readonly<Array<OperationDefinition>>
) {
  if (fhirVersion !== "r4") throw new Error("Only support r4");
  return [
    `import type * as fhirTypes from "@iguhealth/fhir-types";`,
    `import type { Operation } from "@iguhealth/operation-execution";`,
    ...operations.map((op) => generateOp(op)),
  ].join("\n");
}
