import {
  ElementDefinition,
  StructureDefinition,
} from "@genfhi/fhir-types/r4/types";

function generateTypeSet(
  name: string,
  sds: Readonly<Array<StructureDefinition>>
) {
  return `export const ${name}: Set<string>  = new Set([${sds
    .map((sd) => `"${sd.id}"`)
    .join(",")}])\n`;
}

export function generateSets(
  version: "r4",
  structureDefinitions: Readonly<Array<StructureDefinition>>
): string {
  const primitiveTypes = structureDefinitions.filter(
    (sd) => sd.kind === "primitive-type"
  );
  const complexTypes = structureDefinitions.filter(
    (sd) => sd.kind === "complex-type"
  );
  const resourceTypes = structureDefinitions.filter(
    (sd) => sd.kind === "resource"
  );

  return `${generateTypeSet("resourceTypes", resourceTypes)}\n${generateTypeSet(
    "complexTypes",
    complexTypes
  )}\n${generateTypeSet("primitiveTypes", primitiveTypes)}\n`;
}
