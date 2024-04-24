import {
  FHIR_VERSION,
  VersionedAResource,
} from "@iguhealth/fhir-types/versions";

function generateTypeSet(
  name: string,
  sds: Readonly<Array<VersionedAResource<FHIR_VERSION, "StructureDefinition">>>,
) {
  return `export const ${name}: Set<string>  = new Set([${sds
    .map((sd) => `"${sd.id}"`)
    .join(",")}])\n`;
}

export function generateSets<Version extends FHIR_VERSION>(
  version: Version,
  structureDefinitions: Readonly<
    Array<VersionedAResource<Version, "StructureDefinition">>
  >,
): string {
  // Ignore templates for now during type generation.
  structureDefinitions = structureDefinitions.filter(
    (sd) => sd.kind !== "logical",
  );

  const primitiveTypes = structureDefinitions.filter(
    (sd) => sd.kind === "primitive-type",
  );
  const complexTypes = structureDefinitions.filter(
    (sd) => sd.kind === "complex-type",
  );
  const resourceTypes = structureDefinitions.filter(
    (sd) => sd.kind === "resource",
  );

  return `${generateTypeSet("resourceTypes", resourceTypes)}\n${generateTypeSet(
    "complexTypes",
    complexTypes,
  )}\n${generateTypeSet("primitiveTypes", primitiveTypes)}\n`;
}
