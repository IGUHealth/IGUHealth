export interface StructureDefinition {
  kind: "primitive-type" | "complex-type" | "resource" | "logical";
}

function fhirSystemTypePredicate(type: string) {
  switch (type) {
    case "http://hl7.org/fhirpath/System.Boolean": {
      return "boolean";
    }
    case "http://hl7.org/fhirpath/System.String": {
      return "string";
    }
    case "http://hl7.org/fhirpath/System.Date": {
      return "string";
    }
    case "http://hl7.org/fhirpath/System.DateTime": {
      return "string";
    }
    case "http://hl7.org/fhirpath/System.Decimal": {
      return "number";
    }
    case "http://hl7.org/fhirpath/System.Integer": {
      return "integer";
    }
    case "http://hl7.org/fhirpath/System.Time": {
      return "string";
    }
  }
}

function primitiveToTypescriptType(primitiveSd: StructureDefinition) {}

export function generateTypes(
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

  const typescriptTypes: string = primitiveTypes
    .map(primitiveToTypescriptType)
    .join("\n");

  return typescriptTypes;
}
