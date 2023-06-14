import { traversalBottomUp } from "./sdTraversal";
import { ElementDefinition, StructureDefinition } from "@genfhi/fhir-types/r4";

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

function isRoot(sd: StructureDefinition, elementDefinition: ElementDefinition) {
  return elementDefinition.path === sd.id;
}

function documentation(element: ElementDefinition) {
  if (element.short) return `  /* \n   * ${element.short}\n   */\n`;
  return "";
}

function getElementField(element: ElementDefinition, type?: string) {
  const path = element.path;
  const isRequired = element.min && (element.min as unknown as number) > 0;
  const pathSplit = path.split(".");
  let field = pathSplit[pathSplit.length - 1];
  if (type) {
    field = field.replace("[x]", capitalize(type));
  }
  // Type choice is always optional
  if (!isRequired || type) {
    field = field + "?";
  }
  return `${documentation(element)}  ${field}`;
}

function primitiveToTypescriptType(
  primitiveSd: StructureDefinition
): string | void {
  const primitiveValueType = primitiveSd.snapshot?.element.filter((element) =>
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
      if (!elementDefinition.max) return false;
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

function _typeToTypescriptType(type: string): string {
  let systemType = fhirSystemTypePredicate(type);
  if (systemType !== undefined) {
    return systemType;
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
  if (!element.id)
    throw new Error("Cannot create interface name for '" + element.path + "'");
  return element.id.split(".").map(capitalize).join("");
}

/*
  Resolves an elements content Reference
*/
function contentReference(sd: StructureDefinition, element: ElementDefinition) {
  const contentReference = element.contentReference?.split("#")[1];
  const referenceElement = sd.snapshot?.element.filter(
    (element) => element.id === contentReference
  )[0];
  if (!referenceElement)
    throw new Error(
      "unable to resolve contentreference: '" + element.contentReference + "'"
    );
  let referenceTypescriptType;
  if (isNested(referenceElement)) {
    referenceTypescriptType = getInterfaceName(referenceElement);
  } else {
    let type = referenceElement.type?.[0]?.code;
    if (type === undefined) {
      throw new Error(
        "No type found for content reference: '" + referenceElement.id + "'"
      );
    }
    referenceTypescriptType = typeToTypescriptType(referenceElement, type);
  }
  return [`${getElementField(element)}: ${referenceTypescriptType};`];
}

function processLeaf(sd: StructureDefinition, element: ElementDefinition) {
  if (element.contentReference) {
    return contentReference(sd, element);
  } else if (element.type?.length && element.type?.length > 1) {
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
      element.type?.[0]?.code as string
    )};`,
  ];
}

interface ComplexTypeOutput {
  typescriptInterface: string;
  field: string[];
}

function processComplexToTypescript(
  sd: StructureDefinition,
  element: ElementDefinition,
  children: string[]
): ComplexTypeOutput {
  const interfaceName = getInterfaceName(element);
  // for resources include the resourceType filed
  if (isRoot(sd, element) && sd.kind === "resource") {
    children.unshift(`resourceType: "${sd.id}"`);
  }

  return {
    typescriptInterface: `export interface ${interfaceName} {
${children.join("\n")}
}`,
    field: [
      `${getElementField(element)}: ${wrapAsCollection(
        element,
        interfaceName
      )};`,
    ],
  };
}

function resourceOrComplexFhirToTypescript(
  sd: StructureDefinition
): string | void {
  let typescriptTypes = "";
  traversalBottomUp(sd, (element, children: string[]): string[] => {
    if (children.length === 0) {
      return processLeaf(sd, element);
    } else {
      let { typescriptInterface, field } = processComplexToTypescript(
        sd,
        element,
        children
      );
      typescriptTypes = `${typescriptTypes}\n${typescriptInterface}`;
      return field;
    }
  });
  return typescriptTypes;
}

function getNonAbstractResourceTypes(sds: StructureDefinition[]) {
  return sds.filter((sd) => !sd.abstract);
}

// Handle DomainResource and Resource by union joining existing generated types.
function abstractResourceTypes(resourcesSds: StructureDefinition[]) {
  const abstractResourceTypes = resourcesSds.filter((sd) => sd.abstract);
  const nonAbstractResourceTypes = resourcesSds.filter((sd) => !sd.abstract);
  if (abstractResourceTypes.length > 0) {
    let abstractResourceTypescriptTypes = `export type ${
      abstractResourceTypes[0].id
    } = ${nonAbstractResourceTypes.map((sd) => sd.id).join("\n  | ")};`;

    return `${abstractResourceTypescriptTypes}\n${abstractResourceTypes
      .slice(1)
      .map((sd) => `export type ${sd.id} = ${abstractResourceTypes[0].id}`)
      .join("  |\n")};`;
  }
  return;
}

export function generateTypes(
  version: "r4",
  structureDefinitions: Readonly<Array<StructureDefinition>>
): string {
  const primitiveTypes = structureDefinitions.filter(
    (sd) => sd.kind === "primitive-type"
  );
  const complexTypes = getNonAbstractResourceTypes(
    structureDefinitions.filter((sd) => sd.kind === "complex-type")
  );
  const resourceTypes = structureDefinitions.filter(
    (sd) => sd.kind === "resource"
  );

  const typescriptTypes: string = primitiveTypes
    .map(primitiveToTypescriptType)
    .filter((type) => type)
    .concat(
      complexTypes.map(resourceOrComplexFhirToTypescript).filter((type) => type)
    )
    .concat(abstractResourceTypes(resourceTypes))
    .concat(
      getNonAbstractResourceTypes(resourceTypes)
        .map(resourceOrComplexFhirToTypescript)
        .filter((type) => type)
    )
    .join("\n");

  return typescriptTypes;
}
