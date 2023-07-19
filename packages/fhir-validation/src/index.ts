import {
  OperationError,
  outcomeError,
  outcomeFatal,
} from "@iguhealth/operation-outcomes";
import { ElementDefinition, StructureDefinition } from "@iguhealth/fhir-types";
import { primitiveTypes } from "@iguhealth/fhir-types/r4/sets";
import { eleIndexToChildIndices } from "@iguhealth/codegen";

type Validator = (input: any) => Promise<void>;

// Create a validator for a given fhir type and value

function descend(path: string, field: number | string) {
  if (typeof field === "number") {
    return `${path}[${field}]`;
  }
  return `${path}.${field}`;
}

function validatePrimitive(path: string, type: string, value: any) {
  switch (type) {
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

function findType(element: ElementDefinition, value: any) {
  const types = element.type?.map((type) => type.code);
  Object.keys(element.type || {}).forEach((key) => {});
}

function validateSingular(
  resolveType: (type: string) => StructureDefinition,
  path: string,
  structureDefinition: StructureDefinition,
  elementIndex: number,
  value: any
) {
  const element = structureDefinition.snapshot?.element?.[
    elementIndex
  ] as ElementDefinition;
  const pieces = element.path.split(".");
  const field = pieces[pieces.length - 1];
  path = descend(path, field);

  const childrenIndices = eleIndexToChildIndices(
    structureDefinition.snapshot?.element || [],
    elementIndex
  );

  // Leaf validation
  if (childrenIndices.length === 0) {
    const type = element.type?.[0].code as string;
    if (primitiveTypes.has(type)) {
      return validatePrimitive(path, type, value);
    } else {
      const validator = createValidator(resolveType, type, value);
      return validator(value);
    }
  }

  // Validating complex fields.

  const requiredElements = childrenIndices.filter(
    (index) => (structureDefinition.snapshot?.element?.[index].min || 0) > 0
  );
  const optionalElements = childrenIndices.filter(
    (i) => requiredElements.indexOf(i) === -1
  );

  requiredElements.forEach((childIndex) => {
    const elementPath =
      structureDefinition.snapshot?.element?.[childIndex]?.path;
    const fields = elementPath?.split(".") || [];
    const fieldPath = descend(path, fields[fields.length - 1]);

    validateElement(
      resolveType,
      fieldPath,
      structureDefinition,
      childIndex,
      value
    );
  });
}

function validateElement(
  resolveType: (type: string) => StructureDefinition,
  path: string,
  structureDefinition: StructureDefinition,
  elementIndex: number,
  value: any
) {
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
  if (isArray != Array.isArray(value)) {
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

  if (isArray) {
    // Validate each element in the array
    value.forEach((v: any, i: number) => {
      validateSingular(
        resolveType,
        descend(path, i),
        structureDefinition,
        elementIndex,
        v
      );
    });
  } else {
    validateSingular(
      resolveType,
      path,
      structureDefinition,
      elementIndex,
      value
    );
  }
}

const cachedValidators: Record<string, Validator> = {};

function createValidator(
  resolveType: (type: string) => StructureDefinition,
  type: string,
  value: any
): Validator {
  const sd = resolveType(type);
  const indice = 0;

  const validator = async (input: any) => {
    validateElement(resolveType, "", sd, indice, input);
  };

  return validator;
}
