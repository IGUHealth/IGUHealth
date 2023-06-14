import { traversalBottomUp } from "./sdTraversal";

export interface ElementDefinition {
  id: string;
  path: string;
  min: number;
  max: string;
  contentReference: string;
  type?: Array<{ code: string }>;
}
export interface StructureDefinition {
  id: string;
  kind: "primitive-type" | "complex-type" | "resource" | "logical";
  snapshot: { element: Array<ElementDefinition> };
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
      return "number";
    }
    case "http://hl7.org/fhirpath/System.Time": {
      return "string";
    }
  }
}

// function to capaitalize a string
function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getElementField(element: ElementDefinition, type?: string) {
  const path = element.path;
  const isRequired = element.min > 0;
  const pathSplit = path.split(".");
  let field = pathSplit[pathSplit.length - 1];
  if (type) {
    field = field.replace("[x]", capitalize(type));
  }
  // Type choice is always optional
  if (!isRequired || type) {
    field = field + "?";
  }
  return field;
}

function primitiveToTypescriptType(
  primitiveSd: StructureDefinition
): string | void {
  const primitiveValueType = primitiveSd.snapshot.element.filter((element) =>
    element.path.endsWith(".value")
  )[0]?.type?.[0]?.code;
  // Skip over these primitive types as already exist in typescript
  if (primitiveSd.id === "string" || primitiveSd.id === "boolean") {
    return;
  } else if (primitiveValueType) {
    return `export type ${primitiveSd.id} = ${fhirSystemTypePredicate(
      primitiveValueType
    )};`;
  } else {
    throw new Error("No type found for primitive");
  }
}

function isCollection(elementDefinition: ElementDefinition) {
  switch (elementDefinition.max) {
    case "*":
      return true;
    default:
      return parseInt(elementDefinition.max) > 1;
  }
}

function wrapAsCollection(
  elementDefinition: ElementDefinition,
  typescriptString: string
) {
  if (isCollection(elementDefinition)) {
    return `Array<${typescriptString}>`;
  } else {
    return typescriptString;
  }
}

function contentReferenceToTypescriptType(element: ElementDefinition) {}

function _typeToTypescriptType(type: string): string {
  if (fhirSystemTypePredicate(type)) {
    return fhirSystemTypePredicate(type) as string;
  }
  return type;
}

function typeToTypescriptType(
  elementDefinition: ElementDefinition,
  type: string
) {
  const typescriptType = _typeToTypescriptType(type);
  return wrapAsCollection(elementDefinition, typescriptType);
}

function isNested(element: ElementDefinition) {
  return (
    element.type?.[0]?.code === "BackboneElement" ||
    element.type?.[0]?.code === "Element"
  );
}
function getInterfaceName(element: ElementDefinition) {
  return element.id.split(".").map(capitalize).join("");
}

function complexToTypescriptType(
  complexSD: StructureDefinition
): string | void {
  let typescriptTypes = "";

  traversalBottomUp(complexSD, (element, children) => {
    if (children.length === 0) {
      if (element.contentReference) {
        // Resolves contentReference to TS type
        const contentReference = element.contentReference.split("#")[1];
        const contentReferenceType = complexSD.snapshot.element.filter(
          (element) => element.id === contentReference
        )[0];
        let referenceTypescriptType;
        if (isNested(contentReferenceType)) {
          referenceTypescriptType = getInterfaceName(contentReferenceType);
        } else {
          referenceTypescriptType = typeToTypescriptType(
            contentReferenceType,
            contentReferenceType.type?.[0]?.code as string
          );
        }
        return [`${getElementField(element)}: ${referenceTypescriptType};`];
      } else if (element.type?.length !== 1) {
        return element.type?.map(
          (type) =>
            `${getElementField(element, type.code)}: ${typeToTypescriptType(
              element,
              type.code
            )};`
        );
      }
      return [
        `${getElementField(element)}: ${typeToTypescriptType(
          element,
          element.type?.[0]?.code
        )};`,
      ];
    } else if (isNested(element)) {
      const interfaceName = getInterfaceName(element);
      typescriptTypes = `${typescriptTypes}
export interface ${interfaceName} {
  ${children.join("\n  ")}
}`;
      return [`${getElementField(element)}: ${interfaceName};`];
    } else {
      const interfaceName = getInterfaceName(element);
      typescriptTypes = `${typescriptTypes}
export interface ${interfaceName} {
  ${children.join("\n  ")}
}`;
      return [interfaceName];
    }
  });

  return typescriptTypes;
}

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
    .filter((type) => type)
    .concat(complexTypes.map(complexToTypescriptType).filter((type) => type))
    .concat(resourceTypes.map(complexToTypescriptType).filter((type) => type))
    .join("\n");

  return typescriptTypes;
}
