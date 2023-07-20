import {
  OperationError,
  outcomeError,
  outcomeFatal,
} from "@iguhealth/operation-outcomes";
import { ElementDefinition, StructureDefinition } from "@iguhealth/fhir-types";
import { primitiveTypes } from "@iguhealth/fhir-types/r4/sets";
import { eleIndexToChildIndices } from "@iguhealth/codegen";
import { descend, createPath } from "./path.js";
import jsonpointer from "jsonpointer";

type Validator = (input: any) => void;

// Create a validator for a given fhir type and value

function validatePrimitive(root: any, path: string, type: string) {
  const value = jsonpointer.get(root, path);
  switch (type) {
    case "http://hl7.org/fhirpath/System.String":
    case "id":
    case "string":
    case "xhtml":
    case "markdown":

    case "base64Binary":

    case "uri":
    case "uuid":
    case "canonical":
    case "oid":
    case "url": {
      if (typeof value !== "string") {
        throw new OperationError(
          outcomeError(
            "structure",
            `Expected primitive type '${type}' at path '${path}'`,
            [path]
          )
        );
      }
      break;
    }

    case "boolean": {
      if (typeof value !== "boolean") {
        throw new OperationError(
          outcomeError(
            "structure",
            `Expected primitive type '${type}' at path '${path}'`,
            [path]
          )
        );
      }
      break;
    }

    case "code": {
      if (typeof value !== "string") {
        throw new OperationError(
          outcomeError(
            "structure",
            `Expected primitive type '${type}' at path '${path}'`,
            [path]
          )
        );
      }
      break;
    }

    case "date":
    case "dateTime":
    case "time":
    case "instant": {
      if (typeof value !== "string") {
        throw new OperationError(
          outcomeError(
            "structure",
            `Expected primitive type '${type}' at path '${path}'`,
            [path]
          )
        );
      }
      break;
    }

    case "integer":
    case "positiveInt":
    case "unsignedInt":
    case "decimal": {
      if (typeof value !== "number") {
        throw new OperationError(
          outcomeError(
            "structure",
            `Expected primitive type '${type}' at path '${path}'`,
            [path]
          )
        );
      }
      break;
    }
    default:
      throw new OperationError(
        outcomeError(
          "structure",
          `Unknown primitive type '${type}' at path '${path}'`,
          [path]
        )
      );
  }
}

function isElement(
  element: ElementDefinition | undefined
): element is ElementDefinition {
  if (!element) return false;
  return true;
}

function isTypeChoice(element: ElementDefinition) {
  return (element.type || []).length > 1;
}

function fieldName(elementDefinition: ElementDefinition, type?: string) {
  const field = elementDefinition.path.split(".").pop() as string;
  if (isTypeChoice(elementDefinition)) {
    if (!type)
      throw new Error("deriving field from typechoice requires a type");
    return field.replace("[x]", capitalize(type));
  }
  return field;
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function determineTypeAndField(
  element: ElementDefinition,
  value: any
): [string, string] | undefined {
  if (isTypeChoice(element)) {
    for (const type of element.type?.map((t) => t.code) || []) {
      const field = fieldName(element, type);
      if (value[field]) {
        return [field, type];
      }
    }
  } else {
    const field = fieldName(element);
    if (value[field]) {
      return [field, element.type?.[0].code as string];
    }
  }
}

function validateSingular(
  resolveType: (type: string) => StructureDefinition,
  path: string,
  structureDefinition: StructureDefinition,
  elementIndex: number,
  root: any,
  type: string
) {
  const element = structureDefinition.snapshot?.element?.[
    elementIndex
  ] as ElementDefinition;

  const childrenIndices = eleIndexToChildIndices(
    structureDefinition.snapshot?.element || [],
    elementIndex
  );

  // Leaf validation
  if (childrenIndices.length === 0) {
    const type = element.type?.[0].code as string;
    if (
      primitiveTypes.has(type) ||
      type === "http://hl7.org/fhirpath/System.String"
    ) {
      return validatePrimitive(root, path, type);
    } else {
      const validator = createValidator(resolveType, type, path);
      return validator(root);
    }
  } else {
    // Validating root / backbone / element nested types here.
    // Need to validate that only the _field for primitives
    // And the typechoice check on each field.
    // Found concatenate on found fields so can check at end whether their are additional and throw error.
    const foundFields: string[] = [];
    const value = jsonpointer.get(root, path);

    const requiredElements = childrenIndices.filter(
      (index) => (structureDefinition.snapshot?.element?.[index].min || 0) > 0
    );
    const optionalElements = childrenIndices.filter(
      (i) => requiredElements.indexOf(i) === -1
    );

    requiredElements.forEach((index) => {
      const child = structureDefinition.snapshot?.element?.[index];
      if (!child) throw new Error("Child not found");

      const fieldType = determineTypeAndField(child, value);
      if (!fieldType) {
        throw new OperationError(
          outcomeError(
            "structure",
            `Missing required field '${child.path}' at path '${path}'`,
            [path]
          )
        );
      }
      const [field, type] = fieldType;
      foundFields.push(field);
      validateElement(
        resolveType,
        descend(path, field),
        structureDefinition,
        index,
        root,
        type
      );
    });

    optionalElements.forEach((index) => {
      const child = structureDefinition.snapshot?.element?.[index];
      if (!child) throw new Error("Child not found");

      const fieldType = determineTypeAndField(child, value);
      if (fieldType) {
        const [field, type] = fieldType;
        foundFields.push(field);
        validateElement(
          resolveType,
          descend(path, field),
          structureDefinition,
          index,
          root,
          type
        );
      }
    });

    // Check for additional fields
    let additionalFields = Object.keys(value).filter(
      (field) => foundFields.indexOf(field) === -1
    );

    if (elementIndex === 0 && structureDefinition.kind === "resource") {
      additionalFields = additionalFields.filter((v) => v !== "resourceType");
    }

    if (additionalFields.length > 0) {
      throw new OperationError(
        outcomeError(
          "structure",
          `Additional fields found at path '${path}': ${additionalFields.join(
            ", "
          )}`,
          [path]
        )
      );
    }
  }
}

function validateElement(
  resolveType: (type: string) => StructureDefinition,
  path: string,
  structureDefinition: StructureDefinition,
  elementIndex: number,
  root: any,
  type: string
) {
  const value = jsonpointer.get(root, path);
  const element = structureDefinition.snapshot?.element?.[elementIndex];

  if (!isElement(element)) {
    throw new OperationError(
      outcomeFatal(
        "structure",
        `Element not found at ${elementIndex} for StructureDefinition ${structureDefinition.id}`,
        [path]
      )
    );
  }

  const isArray = element.max === "*" || parseInt(element.max || "1") > 1;
  // Validating cardinality
  // Cardinality set to * on root element so just ignore it.
  if (isArray != Array.isArray(value || []) && elementIndex !== 0) {
    console.log(path, value);
    throw new OperationError(
      outcomeError(
        "structure",
        `Element at path '${path}' is expected to be ${
          isArray ? "an array " : "a singular value "
        }.`,
        [path]
      )
    );
  }

  if (isArray && Array.isArray(value || []) && elementIndex !== 0) {
    // Validate each element in the array
    value.forEach((v: any, i: number) => {
      validateSingular(
        resolveType,
        descend(path, i),
        structureDefinition,
        elementIndex,
        root,
        type
      );
    });
  } else {
    validateSingular(
      resolveType,
      path,
      structureDefinition,
      elementIndex,
      root,
      type
    );
  }
}

const cachedValidators: Record<string, Validator> = {};

export default function createValidator(
  resolveType: (type: string) => StructureDefinition,
  type: string,
  path: string = createPath()
): Validator {
  const sd = resolveType(type);
  const indice = 0;

  const validator = (input: any) => {
    validateElement(
      resolveType,
      path,
      sd,
      indice,
      input,
      // This should only be one at the root.
      sd.snapshot?.element[indice].type?.[0].code as string
    );
  };

  return validator;
}
